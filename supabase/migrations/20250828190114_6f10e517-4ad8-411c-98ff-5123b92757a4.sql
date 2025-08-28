-- Create enum for request types
CREATE TYPE public.request_type AS ENUM ('quote', 'appointment');

-- Create enum for photo types
CREATE TYPE public.photo_type AS ENUM ('registration', 'mileage', 'vehicle_angles', 'damage_photos');

-- Create requests table for main claim requests
CREATE TABLE public.requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type public.request_type NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    description TEXT,
    preferred_date DATE,
    preferred_time TIME,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create damage_parts table for different types of vehicle damage
CREATE TABLE public.damage_parts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for request damages (many-to-many)
CREATE TABLE public.request_damages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
    damage_part_id UUID REFERENCES public.damage_parts(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(request_id, damage_part_id)
);

-- Create photos table for file uploads
CREATE TABLE public.photos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
    photo_type public.photo_type NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.damage_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_damages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for requests
CREATE POLICY "Users can view their own requests" 
ON public.requests 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create requests" 
ON public.requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own requests" 
ON public.requests 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for damage_parts (public read access)
CREATE POLICY "Anyone can view damage parts" 
ON public.damage_parts 
FOR SELECT 
USING (true);

-- RLS Policies for request_damages
CREATE POLICY "Users can view their request damages" 
ON public.request_damages 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.requests r 
    WHERE r.id = request_id AND (r.user_id = auth.uid() OR r.user_id IS NULL)
));

CREATE POLICY "Users can create request damages" 
ON public.request_damages 
FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.requests r 
    WHERE r.id = request_id AND (r.user_id = auth.uid() OR r.user_id IS NULL)
));

-- RLS Policies for photos
CREATE POLICY "Users can view their request photos" 
ON public.photos 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.requests r 
    WHERE r.id = request_id AND (r.user_id = auth.uid() OR r.user_id IS NULL)
));

CREATE POLICY "Users can create request photos" 
ON public.photos 
FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.requests r 
    WHERE r.id = request_id AND (r.user_id = auth.uid() OR r.user_id IS NULL)
));

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('claim-photos', 'claim-photos', false);

-- Storage policies for claim photos
CREATE POLICY "Users can upload their claim photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'claim-photos' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL)
);

CREATE POLICY "Users can view their claim photos" 
ON storage.objects 
FOR SELECT 
USING (
    bucket_id = 'claim-photos' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL)
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_requests_updated_at
    BEFORE UPDATE ON public.requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default damage parts
INSERT INTO public.damage_parts (name, description) VALUES
    ('pare_chocs_avant', 'Pare-chocs avant'),
    ('pare_chocs_arriere', 'Pare-chocs arrière'),
    ('portiere_avant_gauche', 'Portière avant gauche'),
    ('portiere_avant_droite', 'Portière avant droite'),
    ('portiere_arriere_gauche', 'Portière arrière gauche'),
    ('portiere_arriere_droite', 'Portière arrière droite'),
    ('capot', 'Capot'),
    ('coffre', 'Coffre/Hayon'),
    ('toit', 'Toit'),
    ('aile_avant_gauche', 'Aile avant gauche'),
    ('aile_avant_droite', 'Aile avant droite'),
    ('aile_arriere_gauche', 'Aile arrière gauche'),
    ('aile_arriere_droite', 'Aile arrière droite'),
    ('phare_avant_gauche', 'Phare avant gauche'),
    ('phare_avant_droit', 'Phare avant droit'),
    ('feu_arriere_gauche', 'Feu arrière gauche'),
    ('feu_arriere_droit', 'Feu arrière droit'),
    ('retroviseur_gauche', 'Rétroviseur gauche'),
    ('retroviseur_droit', 'Rétroviseur droit'),
    ('pare_brise', 'Pare-brise'),
    ('vitre_laterale', 'Vitre latérale'),
    ('roue_avant_gauche', 'Roue avant gauche'),
    ('roue_avant_droite', 'Roue avant droite'),
    ('roue_arriere_gauche', 'Roue arrière gauche'),
    ('roue_arriere_droite', 'Roue arrière droite');