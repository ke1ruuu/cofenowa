-- FIX: Admin access to all profiles
-- The previous policy only allowed admins to see rows where the row's own role was 'admin'.
-- This new policy allows a user with the 'admin' role to see all profiles.

-- Using a helper function to avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the profiles policies
DROP POLICY IF EXISTS "Admin full access on profiles" ON public.profiles;
CREATE POLICY "Admin full access on profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Also ensure public can't randomly see each other (already handled by the "own profile" policy)
