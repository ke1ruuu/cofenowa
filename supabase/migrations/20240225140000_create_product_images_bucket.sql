-- Create a bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow anyone to view product images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Policy to allow authenticated admins to upload product images
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
);

-- Policy to allow authenticated admins to update product images
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'product-images' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
);

-- Policy to allow authenticated admins to delete product images
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE 
USING (
  bucket_id = 'product-images' AND 
  (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
);
