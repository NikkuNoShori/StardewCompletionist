-- ============================================
-- Add villager birthday tracker to collection_progress.
-- Tracks which villagers the player gave a birthday
-- gift to (keyed by villager name).
-- ============================================

ALTER TABLE public.collection_progress
  ADD COLUMN IF NOT EXISTS birthday_checked JSONB NOT NULL DEFAULT '{}';

-- Update the unified getter to include birthday_checked.
CREATE OR REPLACE FUNCTION public.get_collection_progress()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT jsonb_build_object(
      'recipeChecked',       COALESCE(recipe_checked, '{}'::jsonb),
      'ingredientsChecked',  COALESCE(ingredients_checked, '{}'::jsonb),
      'bundleChecked',       COALESCE(bundle_checked, '{}'::jsonb),
      'fishChecked',         COALESCE(fish_checked, '{}'::jsonb),
      'museumChecked',       COALESCE(museum_checked, '{}'::jsonb),
      'shippingChecked',     COALESCE(shipping_checked, '{}'::jsonb),
      'craftingChecked',     COALESCE(crafting_checked, '{}'::jsonb),
      'walnutChecked',       COALESCE(walnut_checked, '{}'::jsonb),
      'stardropChecked',     COALESCE(stardrop_checked, '{}'::jsonb),
      'secretNoteChecked',   COALESCE(secret_note_checked, '{}'::jsonb),
      'journalScrapChecked', COALESCE(journal_scrap_checked, '{}'::jsonb),
      'fieldOfficeChecked',  COALESCE(field_office_checked, '{}'::jsonb),
      'monsterChecked',      COALESCE(monster_checked, '{}'::jsonb),
      'catalogChecked',      COALESCE(catalog_checked, '{}'::jsonb),
      'birthdayChecked',     COALESCE(birthday_checked, '{}'::jsonb)
    )
    FROM collection_progress
    WHERE user_id = auth.uid()),
    '{}'::jsonb
  );
$$;

-- Update the unified saver to persist birthday_checked.
CREATE OR REPLACE FUNCTION public.save_collection_progress(p_data JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO collection_progress (
    user_id,
    recipe_checked, ingredients_checked, bundle_checked,
    fish_checked, museum_checked, shipping_checked,
    crafting_checked, walnut_checked, stardrop_checked,
    secret_note_checked, journal_scrap_checked, field_office_checked,
    monster_checked, catalog_checked, birthday_checked, updated_at
  ) VALUES (
    auth.uid(),
    COALESCE(p_data->'recipeChecked',       '{}'::jsonb),
    COALESCE(p_data->'ingredientsChecked',  '{}'::jsonb),
    COALESCE(p_data->'bundleChecked',       '{}'::jsonb),
    COALESCE(p_data->'fishChecked',         '{}'::jsonb),
    COALESCE(p_data->'museumChecked',       '{}'::jsonb),
    COALESCE(p_data->'shippingChecked',     '{}'::jsonb),
    COALESCE(p_data->'craftingChecked',     '{}'::jsonb),
    COALESCE(p_data->'walnutChecked',       '{}'::jsonb),
    COALESCE(p_data->'stardropChecked',     '{}'::jsonb),
    COALESCE(p_data->'secretNoteChecked',   '{}'::jsonb),
    COALESCE(p_data->'journalScrapChecked', '{}'::jsonb),
    COALESCE(p_data->'fieldOfficeChecked',  '{}'::jsonb),
    COALESCE(p_data->'monsterChecked',      '{}'::jsonb),
    COALESCE(p_data->'catalogChecked',      '{}'::jsonb),
    COALESCE(p_data->'birthdayChecked',     '{}'::jsonb),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    recipe_checked       = COALESCE(p_data->'recipeChecked',       collection_progress.recipe_checked),
    ingredients_checked  = COALESCE(p_data->'ingredientsChecked',  collection_progress.ingredients_checked),
    bundle_checked       = COALESCE(p_data->'bundleChecked',       collection_progress.bundle_checked),
    fish_checked         = COALESCE(p_data->'fishChecked',         collection_progress.fish_checked),
    museum_checked       = COALESCE(p_data->'museumChecked',       collection_progress.museum_checked),
    shipping_checked     = COALESCE(p_data->'shippingChecked',     collection_progress.shipping_checked),
    crafting_checked     = COALESCE(p_data->'craftingChecked',     collection_progress.crafting_checked),
    walnut_checked       = COALESCE(p_data->'walnutChecked',       collection_progress.walnut_checked),
    stardrop_checked     = COALESCE(p_data->'stardropChecked',     collection_progress.stardrop_checked),
    secret_note_checked  = COALESCE(p_data->'secretNoteChecked',   collection_progress.secret_note_checked),
    journal_scrap_checked = COALESCE(p_data->'journalScrapChecked', collection_progress.journal_scrap_checked),
    field_office_checked = COALESCE(p_data->'fieldOfficeChecked',  collection_progress.field_office_checked),
    monster_checked      = COALESCE(p_data->'monsterChecked',      collection_progress.monster_checked),
    catalog_checked      = COALESCE(p_data->'catalogChecked',      collection_progress.catalog_checked),
    birthday_checked     = COALESCE(p_data->'birthdayChecked',     collection_progress.birthday_checked),
    updated_at           = now();
END;
$$;
