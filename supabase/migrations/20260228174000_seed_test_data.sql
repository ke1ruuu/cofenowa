-- 1. PRE-REQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SEED AUTH USERS (Using NOT EXISTS to avoid unique constraint issues)
-- We insert into auth.users which triggers public.profiles creation
DO $$
DECLARE
    i INT;
    new_id uuid;
    customer_email TEXT;
BEGIN
    FOR i IN 1..100 LOOP
        customer_email := 'seed_customer_' || i || '@example.dev';
        
        -- Check if user already exists
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = customer_email) THEN
            new_id := uuid_generate_v4();
            INSERT INTO auth.users (
                id, 
                instance_id,
                email, 
                encrypted_password, 
                email_confirmed_at, 
                raw_app_meta_data, 
                raw_user_meta_data, 
                role, 
                aud,
                created_at,
                updated_at,
                last_sign_in_at
            )
            VALUES (
                new_id,
                '00000000-0000-0000-0000-000000000000', -- Default Supabase instance_id
                customer_email, 
                '$2a$10$7EqJtq688uR/yG6yJ/fBne6m.m.b/B.fA6/8e.e.e.e.e.e.e.e.e', 
                now(), 
                '{"provider":"email","providers":["email"]}', 
                jsonb_build_object('full_name', 'Mock Customer ' || i),
                'authenticated',
                'authenticated',
                now(),
                now(),
                now()
            );
        END IF;
    END LOOP;
END $$;

-- 3. SEED CATEGORIES
INSERT INTO categories (id, name, description) VALUES 
(uuid_generate_v4(), 'Hot Coffee', 'Freshly brewed warm delights'),
(uuid_generate_v4(), 'Iced Coffee', 'Chilled espresso drinks'),
(uuid_generate_v4(), 'Pastries', 'Bakery fresh treats'),
(uuid_generate_v4(), 'Tea', 'Organic herbal teas'),
(uuid_generate_v4(), 'Non-Coffee', 'Milkshakes and Juices'),
(uuid_generate_v4(), 'Breakfast', 'Morning meals and sandwiches'),
(uuid_generate_v4(), 'Merchandise', 'Coffee beans and equipment')
ON CONFLICT (name) DO NOTHING;

-- 4. SEED PRODUCTS
DO $$
DECLARE
    cat_record RECORD;
    i INT;
    product_names TEXT[] := ARRAY[
        'Espresso', 'Americano', 'Latte', 'Cappuccino', 'Mocha', 'Flat White', 'Macchiato', 'Cortado',
        'Cold Brew', 'Iced Latte', 'Iced Mocha', 'Iced Americano', 'Frappuccino', 'Nitro Cold Brew',
        'Croissant', 'Muffin', 'Cookie', 'Brownie', 'Danish', 'Scone', 'Bagel', 'Cheesecake',
        'Green Tea', 'Black Tea', 'Earl Grey', 'Chai Latte', 'Matcha Latte', 'Chamomile', 'Mint Tea',
        'Hot Chocolate', 'Strawberry Shake', 'Chocolate Shake', 'Vanilla Shake', 'Orange Juice'
    ];
BEGIN
    FOR cat_record IN SELECT id, name FROM categories LOOP
        FOR i IN 1..15 LOOP
            INSERT INTO products (id, category_id, name, description, base_price, is_available)
            VALUES (
                uuid_generate_v4(),
                cat_record.id,
                cat_record.name || ' ' || product_names[trunc(random() * array_length(product_names, 1)) + 1] || ' ' || i,
                'Premium quality ' || cat_record.name || ' sourced from our artisan roastery.',
                (random() * (15 - 3) + 3)::numeric(10,2),
                true
            ) ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- 5. SEED VARIANTS
INSERT INTO product_variants (product_id, name, price_modifier)
SELECT id, 'Small', 0 FROM products ON CONFLICT DO NOTHING;
INSERT INTO product_variants (product_id, name, price_modifier)
SELECT id, 'Medium', 1.50 FROM products ON CONFLICT DO NOTHING;
INSERT INTO product_variants (product_id, name, price_modifier)
SELECT id, 'Large', 2.75 FROM products ON CONFLICT DO NOTHING;

-- 6. SEED ADDONS
INSERT INTO product_addons (name, price) VALUES
('Extra Shot', 1.50),
('Caramel Syrup', 0.75),
('Vanilla Syrup', 0.75),
('Hazelnut Syrup', 0.75),
('Oat Milk', 1.00),
('Almond Milk', 1.00),
('Whipped Cream', 0.50),
('Chocolate Drizzle', 0.50)
ON CONFLICT DO NOTHING;

-- 7. SEED ORDERS (600 orders across the last 6 months)
DO $$
DECLARE
    o_id uuid;
    i INT;
    order_date timestamptz;
    cust_id uuid;
    prod_record RECORD;
BEGIN
    FOR i IN 1..600 LOOP
        -- Select a random customer from our seed users
        SELECT id INTO cust_id FROM profiles WHERE email LIKE 'seed_customer_%' ORDER BY random() LIMIT 1;
        
        -- If no profiles found (trigger delayed), exit early to avoid error
        IF cust_id IS NULL THEN
            CONTINUE;
        END IF;

        -- Generate a date in the last 180 days
        order_date := now() - (random() * interval '180 days');
        
        -- Create Order
        o_id := uuid_generate_v4();
        INSERT INTO orders (id, user_id, total_amount, status, payment_status, created_at)
        VALUES (
            o_id,
            cust_id,
            0,
            CASE trunc(random() * 4) 
                WHEN 0 THEN 'completed' 
                WHEN 1 THEN 'completed' 
                WHEN 2 THEN 'completed'
                ELSE 'pending' 
            END,
            'paid',
            order_date
        );

        -- Add 1 to 3 items per order
        FOR prod_record IN (SELECT name, base_price FROM products ORDER BY random() LIMIT (trunc(random() * 3) + 1)) LOOP
            INSERT INTO order_items (id, order_id, product_name, unit_price, quantity, subtotal)
            VALUES (
                uuid_generate_v4(),
                o_id,
                prod_record.name,
                prod_record.base_price,
                (trunc(random() * 3) + 1),
                prod_record.base_price * (trunc(random() * 3) + 1)
            );
        END LOOP;
        
        -- Update the total_amount of the order based on its items
        UPDATE orders SET total_amount = (SELECT SUM(subtotal) FROM order_items WHERE order_id = o_id) WHERE id = o_id;
    END LOOP;
END $$;
