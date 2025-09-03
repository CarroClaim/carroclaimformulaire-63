-- Add damage screenshot column to requests table
ALTER TABLE public.requests 
ADD COLUMN damage_screenshot TEXT;

COMMENT ON COLUMN public.requests.damage_screenshot IS 'Base64 encoded screenshot of vehicle damage selection';