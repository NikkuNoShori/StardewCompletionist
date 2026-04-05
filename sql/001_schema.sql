-- ============================================
-- 001_schema.sql — Tables & RLS
-- ============================================

-- Recipe progress: one row per user
CREATE TABLE IF NOT EXISTS public.recipe_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  checked JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lock it down
ALTER TABLE public.recipe_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own" ON public.recipe_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own" ON public.recipe_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own" ON public.recipe_progress
  FOR UPDATE USING (auth.uid() = user_id);
