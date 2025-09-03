-- Fix security warning: Function Search Path Mutable
-- Update the update_updated_at_column function to have a secure search_path

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE 
SET search_path = public;