-- Update requests table to support new status values and ensure proper indexing
ALTER TABLE public.requests 
DROP CONSTRAINT IF EXISTS requests_status_check;

-- Add check constraint for valid status values
ALTER TABLE public.requests 
ADD CONSTRAINT requests_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'archived', 'deleted'));

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_is_archived ON public.requests(is_archived);
CREATE INDEX IF NOT EXISTS idx_requests_status_archived ON public.requests(status, is_archived);

-- Update existing archived requests to have 'archived' status
UPDATE public.requests 
SET status = 'archived' 
WHERE is_archived = true AND status != 'archived';

-- Create function to update request status with automatic archiving logic
CREATE OR REPLACE FUNCTION public.update_request_status(
    request_id uuid,
    new_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update the status
    UPDATE public.requests
    SET 
        status = new_status,
        updated_at = now(),
        -- Automatically set archiving fields when status is 'archived'
        is_archived = CASE 
            WHEN new_status = 'archived' THEN true 
            ELSE is_archived 
        END,
        archived_at = CASE 
            WHEN new_status = 'archived' THEN now() 
            ELSE archived_at 
        END
    WHERE id = request_id;
END;
$$;