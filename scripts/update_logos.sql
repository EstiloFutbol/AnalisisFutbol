-- Script to update logo_urls for teams using Supabase Storage
-- Bucket: logos
-- Filename assumption: [short_name].png (e.g. ATH.png, RMA.png)
-- Check your bucket if extensions are .jpg or names are different!

UPDATE teams 
SET logo_url = 'https://uchaeyxgymzmgmujrivi.supabase.co/storage/v1/object/public/logos/' || short_name || '.png'
WHERE short_name IS NOT NULL;
