-- FEEDBACKS TABLE
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'pending', -- pending, reviewed, replied
  created_at timestamptz default now()
);

-- RLS POLICIES
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Anyone can submit feedback (even anonymous guests)
CREATE POLICY "Anyone can insert feedback" ON public.feedbacks
  FOR INSERT WITH CHECK (true);

-- Users can view their own submitted feedback
CREATE POLICY "Users can view their own feedback" ON public.feedbacks
  FOR SELECT USING (auth.uid() = user_id);

-- Admin full access
CREATE POLICY "Admin full access on feedbacks" ON public.feedbacks
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
