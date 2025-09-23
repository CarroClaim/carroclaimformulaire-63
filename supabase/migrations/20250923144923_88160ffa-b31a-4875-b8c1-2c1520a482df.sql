-- Fix RLS policy for request_damages to allow public form submissions
-- The current policy requires user_id = auth.uid(), but public forms don't have authenticated users

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can insert request damages" ON request_damages;

-- Create new policy that allows inserting request damages for any valid request
CREATE POLICY "Allow insert for valid requests" ON request_damages
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM requests 
    WHERE requests.id = request_damages.request_id
  )
);

-- Also update the requests table to set user_id as nullable and allow public inserts
-- Update the RLS policy for requests to allow public submissions
DROP POLICY IF EXISTS "Enable insert for all users" ON requests;

CREATE POLICY "Allow public form submissions" ON requests
FOR INSERT 
WITH CHECK (true);