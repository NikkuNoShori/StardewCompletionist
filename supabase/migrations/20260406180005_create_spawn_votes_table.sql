-- ============================================
-- Spawn code votes: users confirm a spawn code
-- works (up) or flag that it produces the wrong
-- item (down). One vote per user per item; the
-- vote can be switched or cleared. Reviewed by
-- the dev — NOT per-user progress.
-- ============================================

CREATE TABLE IF NOT EXISTS public.spawn_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  vote SMALLINT NOT NULL CHECK (vote IN (1, -1)), -- 1 = up (correct), -1 = down (wrong)
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One vote per user per item (lets us switch/clear).
CREATE UNIQUE INDEX IF NOT EXISTS spawn_votes_user_item_uniq
  ON public.spawn_votes (user_id, item_id);

ALTER TABLE public.spawn_votes ENABLE ROW LEVEL SECURITY;

-- Users may insert/update/see/delete only their own votes.
-- Aggregate review across all users is done by the dev via the
-- service role / dashboard, which bypasses RLS.
CREATE POLICY "insert_own" ON public.spawn_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own" ON public.spawn_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "select_own" ON public.spawn_votes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "delete_own" ON public.spawn_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Cast (or switch) a vote for the calling user.
-- p_vote: 1 = up (correct), -1 = down (wrong).
CREATE OR REPLACE FUNCTION public.vote_spawn_code(
  p_item_id TEXT,
  p_item_name TEXT,
  p_vote SMALLINT,
  p_note TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_vote NOT IN (1, -1) THEN
    RAISE EXCEPTION 'vote must be 1 or -1';
  END IF;

  INSERT INTO spawn_votes (user_id, item_id, item_name, vote, note)
  VALUES (auth.uid(), p_item_id, p_item_name, p_vote, p_note)
  ON CONFLICT (user_id, item_id) DO UPDATE SET
    item_name  = EXCLUDED.item_name,
    vote       = EXCLUDED.vote,
    note       = EXCLUDED.note,
    updated_at = now();
END;
$$;

-- Clear the calling user's vote for an item (toggle off).
CREATE OR REPLACE FUNCTION public.clear_spawn_vote(p_item_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM spawn_votes
  WHERE user_id = auth.uid() AND item_id = p_item_id;
END;
$$;

-- Return the calling user's votes as { item_id: vote } to restore
-- button state on load, e.g. {"74": 1, "120": -1}.
CREATE OR REPLACE FUNCTION public.get_my_spawn_votes()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    jsonb_object_agg(item_id, vote),
    '{}'::jsonb
  )
  FROM spawn_votes
  WHERE user_id = auth.uid();
$$;
