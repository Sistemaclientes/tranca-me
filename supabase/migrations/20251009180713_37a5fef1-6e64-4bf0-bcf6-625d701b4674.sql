-- Create storage buckets for braider media
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('profile-photos', 'profile-photos', true),
  ('gallery-photos', 'gallery-photos', true),
  ('presentation-videos', 'presentation-videos', true);

-- Create policies for profile photos
CREATE POLICY "Profile photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can upload profile photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own profile photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own profile photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-photos' AND auth.uid() IS NOT NULL);

-- Create policies for gallery photos
CREATE POLICY "Gallery photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery-photos');

CREATE POLICY "Authenticated users can upload gallery photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own gallery photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own gallery photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery-photos' AND auth.uid() IS NOT NULL);

-- Create policies for presentation videos
CREATE POLICY "Presentation videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'presentation-videos');

CREATE POLICY "Authenticated users can upload presentation videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'presentation-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own presentation videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'presentation-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own presentation videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'presentation-videos' AND auth.uid() IS NOT NULL);

-- Add new columns to braider_profiles table
ALTER TABLE braider_profiles
ADD COLUMN professional_name TEXT,
ADD COLUMN pricing TEXT,
ADD COLUMN gallery_urls TEXT[] DEFAULT '{}',
ADD COLUMN video_url TEXT;