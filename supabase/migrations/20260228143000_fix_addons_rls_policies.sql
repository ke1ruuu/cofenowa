-- Add missing RLS policies for user-side visibility
-- 1. Ensure public can view variants, addons, and their relationships
DROP POLICY IF EXISTS "Public can view variants" ON public.product_variants;
CREATE POLICY "Public can view variants" ON public.product_variants FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Public can view addons" ON public.product_addons;
CREATE POLICY "Public can view addons" ON public.product_addons FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Public can view variant addons" ON public.variant_addons;
CREATE POLICY "Public can view variant addons" ON public.variant_addons FOR SELECT TO authenticated, anon USING (true);

-- 2. Allow users to view their own cart item addons
DROP POLICY IF EXISTS "Users can view their own cart item addons" ON public.cart_item_addons;
CREATE POLICY "Users can view their own cart item addons" ON public.cart_item_addons
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cart_items
      JOIN public.carts ON carts.id = cart_items.cart_id
      WHERE cart_items.id = cart_item_id AND carts.user_id = auth.uid()
    )
  );

-- 3. Allow users to view their own order item addons
DROP POLICY IF EXISTS "Users can view their own order item addons" ON public.order_item_addons;
CREATE POLICY "Users can view their own order item addons" ON public.order_item_addons
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.order_items
      JOIN public.orders ON orders.id = order_items.order_id
      WHERE order_items.id = order_item_id AND orders.user_id = auth.uid()
    )
  );
