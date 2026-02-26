-- INITIAL AUTHENTICATION & PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  role text not null default 'customer',
  created_at timestamptz default now()
);

-- Handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz default now()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  base_price numeric(10,2) not null check (base_price >= 0),
  image_url text,
  is_available boolean default true,
  created_at timestamptz default now()
);

-- PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null, -- Small, Medium, Large
  price_modifier numeric(10,2) default 0,
  created_at timestamptz default now()
);

-- PRODUCT ADDONS
CREATE TABLE IF NOT EXISTS product_addons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10,2) not null check (price >= 0)
);

-- VARIANT ADDONS (Relations)
CREATE TABLE IF NOT EXISTS variant_addons (
  variant_id uuid references product_variants(id) on delete cascade,
  addon_id uuid references product_addons(id) on delete cascade,
  primary key (variant_id, addon_id)
);

-- CARTS
CREATE TABLE IF NOT EXISTS carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references carts(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  quantity int not null check (quantity > 0),
  created_at timestamptz default now()
);

-- CART ITEM ADDONS
CREATE TABLE IF NOT EXISTS cart_item_addons (
  cart_item_id uuid references cart_items(id) on delete cascade,
  addon_id uuid references product_addons(id),
  primary key (cart_item_id, addon_id)
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  total_amount numeric(10,2) not null,
  status text not null default 'pending', 
  payment_status text not null default 'unpaid',
  delivery_address text,
  created_at timestamptz default now()
);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_name text not null,
  variant_name text,
  unit_price numeric(10,2) not null,
  quantity int not null,
  subtotal numeric(10,2) not null
);

-- ORDER ITEM ADDONS
CREATE TABLE IF NOT EXISTS order_item_addons (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid references order_items(id) on delete cascade,
  addon_name text not null,
  addon_price numeric(10,2) not null
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  provider text, -- gcash, stripe, cod
  transaction_id text,
  amount numeric(10,2),
  status text,
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- INGREDIENTS (Inventory)
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  stock_quantity numeric(10,2) not null default 0,
  unit text not null -- grams, ml, pieces
);

-- PRODUCT INGREDIENTS
CREATE TABLE IF NOT EXISTS product_ingredients (
  product_id uuid references products(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete cascade,
  quantity_required numeric(10,2) not null,
  primary key (product_id, ingredient_id)
);

-- RLS POLICIES (Simplified for Admin access)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;

-- Public read access for products and categories
CREATE POLICY "Public can view categories" ON categories FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Public can view products" ON products FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Public can view variants" ON product_variants FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Public can view addons" ON product_addons FOR SELECT TO authenticated, anon USING (true);

-- User specific access for carts and orders
-- User specific access for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Admin full access on profiles (no recursion)
CREATE POLICY "Admin full access on profiles" ON public.profiles
  FOR ALL USING (role = 'admin');

-- Admin full access across everything else
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != 'profiles'
  LOOP
    EXECUTE 'CREATE POLICY "Admin full access on ' || table_name || '" ON public.' || table_name || 
            ' FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin''))';
  END LOOP;
END $$;

-- User specific access for carts and orders
CREATE POLICY "Users can manage their own carts" ON carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- SEED DATA (Optional, but good for testing)
INSERT INTO categories (name, description) VALUES 
('Hot Coffee', 'Freshly brewed warm delights'),
('Iced Coffee', 'Chilled espresso drinks'),
('Pastries', 'Bakery fresh treats')
ON CONFLICT (name) DO NOTHING;
