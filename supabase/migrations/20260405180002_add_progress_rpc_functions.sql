-- ============================================
-- 002_rpc.sql — Lightweight RPCs
-- ============================================

-- Get the calling user's checked progress.
-- Returns empty object if no row exists yet.
CREATE OR REPLACE FUNCTION public.get_progress()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT checked FROM recipe_progress WHERE user_id = auth.uid()),
    '{}'::jsonb
  );
$$;

-- Upsert the calling user's checked progress.
-- Creates the row on first call, updates on subsequent calls.
CREATE OR REPLACE FUNCTION public.save_progress(p_checked JSONB)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO recipe_progress (user_id, checked, updated_at)
  VALUES (auth.uid(), p_checked, now())
  ON CONFLICT (user_id)
  DO UPDATE SET checked = EXCLUDED.checked, updated_at = EXCLUDED.updated_at;
$$;
