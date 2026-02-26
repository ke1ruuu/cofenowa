-- FIX: Allow users to create orders and order items
-- Currently, users can only SELECT their orders. They need to be able to INSERT them during checkout.

-- 1. Orders policies
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 2. Order Items policies
-- Since order_items references orders, we check if the user owns the parent order
DROP POLICY IF EXISTS "Users can create their own order items" ON public.order_items;
CREATE POLICY "Users can create their own order items" ON public.order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_id AND orders.user_id = auth.uid()
    )
  );

-- Also allow users to view their own order items
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_id AND orders.user_id = auth.uid()
    )
  );
