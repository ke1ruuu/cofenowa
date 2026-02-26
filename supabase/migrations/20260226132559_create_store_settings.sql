-- STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    value jsonb not null,
    description text,
    updated_at timestamptz default now()
);

-- RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Public read for configuration
CREATE POLICY "Public can view store settings" ON public.store_settings 
    FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admin full access on store_settings" ON public.store_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Seed initial settings
INSERT INTO public.store_settings (key, value, description) VALUES
('store_info', '{
    "name": "Nowa Cafe",
    "address": "123 Coffee Lane, Brew City",
    "phone": "+63 912 345 6789",
    "email": "hello@nowacafe.com",
    "opening_hours": "7:00 AM - 9:00 PM",
    "announcement": "Welcome to Nowa Cafe! Enjoy our seasonal brews."
}'::jsonb, 'General store information'),
('operational_status', '{
    "is_open": true,
    "accepting_orders": true,
    "maintenance_mode": false
}'::jsonb, 'Real-time store operation flags'),
('reward_settings', '{
    "points_per_peso": 1,
    "min_redeem_points": 100,
    "points_per_claim": 10
}'::jsonb, 'Loyalty program configuration')
ON CONFLICT (key) DO NOTHING;
