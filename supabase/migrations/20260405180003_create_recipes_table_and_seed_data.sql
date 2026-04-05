-- ============================================
-- 003_recipes_and_ingredients.sql
-- Recipes table + ingredient progress tracking
-- ============================================

-- 1. Create recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  ingredients JSONB NOT NULL DEFAULT '[]',
  season TEXT NOT NULL DEFAULT 'Any',
  item_type TEXT NOT NULL DEFAULT 'Mixed',
  source TEXT NOT NULL DEFAULT 'Friendship',
  object_id TEXT NOT NULL DEFAULT '',
  energy INTEGER NOT NULL DEFAULT 0,
  health INTEGER NOT NULL DEFAULT 0,
  buffs TEXT NOT NULL DEFAULT '',
  buff_duration TEXT NOT NULL DEFAULT '',
  sell_price TEXT NOT NULL DEFAULT '0g'
);

-- Allow all authenticated users to read recipes
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recipes_read_all" ON public.recipes
  FOR SELECT USING (true);

-- 2. Add ingredients_checked column to recipe_progress
ALTER TABLE public.recipe_progress
  ADD COLUMN IF NOT EXISTS ingredients_checked JSONB NOT NULL DEFAULT '{}';

-- 3. Seed all 81 recipes
INSERT INTO public.recipes (name, ingredients, season, item_type, source, object_id, energy, health, buffs, buff_duration, sell_price) VALUES
  ('Fried Egg', '["Egg"]', 'Any', 'Animal', 'Starter', '194', 50, 22, '', '', '35g'),
  ('Omelet', '["Egg","Milk"]', 'Any', 'Animal', 'QoS Y1 Spring', '195', 100, 45, '', '', '125g'),
  ('Salad', '["Leek","Dandelion","Vinegar"]', 'Spring', 'Foraging', 'Friendship', '196', 113, 50, '', '', '110g'),
  ('Cheese Cauliflower', '["Cauliflower","Cheese"]', 'Spring', 'Farming', 'Friendship', '197', 138, 62, '', '', '300g'),
  ('Baked Fish', '["Sunfish","Bream","Wheat Flour"]', 'Spring', 'Fishing', 'QoS Y1 Summer', '198', 75, 33, '', '', '100g'),
  ('Parsnip Soup', '["Parsnip","Milk","Vinegar"]', 'Spring', 'Farming', 'Friendship', '199', 85, 38, '', '', '120g'),
  ('Vegetable Medley', '["Tomato","Beet"]', 'Fall', 'Farming', 'Friendship', '200', 165, 74, '', '', '120g'),
  ('Complete Breakfast', '["Fried Egg","Milk","Hashbrowns","Pancakes"]', 'Any', 'Mixed', 'QoS Y2 Spring', '201', 200, 90, 'Farming +2, Max Energy +50', '7m', '350g'),
  ('Fried Calamari', '["Squid","Wheat Flour","Oil"]', 'Winter', 'Fishing', 'Friendship', '202', 80, 36, '', '', '150g'),
  ('Strange Bun', '["Wheat Flour","Periwinkle","Void Mayonnaise"]', 'Any', 'Mixed', 'Friendship', '203', 100, 45, '', '', '225g'),
  ('Lucky Lunch', '["Sea Cucumber","Tortilla","Blue Jazz"]', 'Spring', 'Mixed', 'QoS Y2 Spring', '204', 100, 45, 'Luck +3', '11m 11s', '250g'),
  ('Fried Mushroom', '["Common Mushroom","Morel","Oil"]', 'Spring', 'Foraging', 'Friendship', '205', 135, 60, 'Attack +2', '7m', '200g'),
  ('Pizza', '["Wheat Flour","Tomato","Cheese"]', 'Summer', 'Mixed', 'QoS Y2 Spring', '206', 150, 67, '', '', '300g'),
  ('Bean Hotpot', '["Green Bean x2"]', 'Spring', 'Farming', 'Friendship', '207', 125, 56, 'Max Energy +30, Magnetism +32', '7m', '100g'),
  ('Glazed Yams', '["Yam","Sugar"]', 'Fall', 'Farming', 'QoS Y1 Fall', '208', 200, 90, '', '', '200g'),
  ('Carp Surprise', '["Carp x4"]', 'Any', 'Fishing', 'QoS Y2 Summer', '209', 90, 40, '', '', '150g'),
  ('Hashbrowns', '["Potato","Oil"]', 'Spring', 'Farming', 'QoS Y2 Spring', '210', 90, 40, 'Farming +1', '5m 35s', '120g'),
  ('Pancakes', '["Wheat Flour","Egg"]', 'Any', 'Mixed', 'QoS Y1 Summer', '211', 90, 40, 'Foraging +2', '11m 11s', '80g'),
  ('Salmon Dinner', '["Salmon","Amaranth","Kale"]', 'Fall', 'Fishing', 'Friendship', '212', 125, 56, '', '', '300g'),
  ('Fish Taco', '["Tuna","Tortilla","Red Cabbage","Mayonnaise"]', 'Summer', 'Fishing', 'Friendship', '213', 165, 74, 'Fishing +2', '7m', '500g'),
  ('Crispy Bass', '["Largemouth Bass","Wheat Flour","Oil"]', 'Any', 'Fishing', 'Friendship', '214', 90, 40, 'Magnetism +64', '7m', '150g'),
  ('Pepper Poppers', '["Hot Pepper","Cheese"]', 'Summer', 'Farming', 'Friendship', '215', 130, 58, 'Farming +2, Speed +1', '7m', '200g'),
  ('Bread', '["Wheat Flour"]', 'Any', 'Store-Bought', 'QoS Y1 Summer', '216', 50, 22, '', '', '60g'),
  ('Tom Kha Soup', '["Coconut","Shrimp","Common Mushroom"]', 'Any', 'Mixed', 'Friendship', '218', 175, 78, 'Farming +2, Max Energy +30', '7m', '250g'),
  ('Trout Soup', '["Rainbow Trout","Green Algae"]', 'Summer', 'Fishing', 'QoS Y1 Fall', '219', 100, 45, 'Fishing +1', '4m 39s', '100g'),
  ('Chocolate Cake', '["Wheat Flour","Sugar","Egg"]', 'Any', 'Mixed', 'QoS Y1 Winter', '220', 150, 67, '', '', '200g'),
  ('Pink Cake', '["Melon","Wheat Flour","Sugar","Egg"]', 'Summer', 'Farming', 'QoS Y2 Summer', '221', 250, 112, '', '', '480g'),
  ('Rhubarb Pie', '["Rhubarb","Wheat Flour","Sugar"]', 'Spring', 'Farming', 'Friendship', '222', 215, 96, '', '', '400g'),
  ('Cookie', '["Wheat Flour","Sugar","Egg"]', 'Any', 'Mixed', 'Friendship', '223', 90, 40, '', '', '140g'),
  ('Spaghetti', '["Wheat Flour","Tomato"]', 'Summer', 'Farming', 'Friendship', '224', 75, 33, '', '', '120g'),
  ('Fried Eel', '["Eel","Oil"]', 'Spring', 'Fishing', 'Friendship', '225', 75, 33, 'Luck +1', '7m', '120g'),
  ('Spicy Eel', '["Eel","Hot Pepper"]', 'Summer', 'Fishing', 'Friendship', '226', 115, 51, 'Luck +1, Speed +1', '7m', '175g'),
  ('Sashimi', '["Any Fish"]', 'Any', 'Fishing', 'Friendship', '227', 75, 33, '', '', '75g'),
  ('Maki Roll', '["Any Fish","Seaweed","Rice"]', 'Any', 'Fishing', 'QoS Y1 Summer', '228', 100, 45, '', '', '220g'),
  ('Tortilla', '["Corn"]', 'Summer', 'Farming', 'QoS Y1 Fall', '229', 50, 22, '', '', '50g'),
  ('Red Plate', '["Red Cabbage","Radish"]', 'Summer', 'Farming', 'Friendship', '230', 240, 108, 'Max Energy +50', '3m 30s', '400g'),
  ('Eggplant Parmesan', '["Eggplant","Tomato"]', 'Summer', 'Farming', 'Friendship', '231', 175, 78, 'Mining +1, Defense +3', '4m 39s', '200g'),
  ('Rice Pudding', '["Milk","Sugar","Rice"]', 'Any', 'Animal', 'Friendship', '232', 115, 51, '', '', '260g'),
  ('Ice Cream', '["Milk","Sugar"]', 'Any', 'Animal', 'Friendship', '233', 100, 45, '', '', '120g'),
  ('Blueberry Tart', '["Blueberry","Wheat Flour","Sugar","Egg"]', 'Summer', 'Farming', 'Friendship', '234', 125, 56, '', '', '150g'),
  ('Autumn''s Bounty', '["Yam","Pumpkin"]', 'Fall', 'Farming', 'Friendship', '235', 220, 99, 'Foraging +2, Defense +2', '7m 41s', '350g'),
  ('Pumpkin Soup', '["Pumpkin","Milk"]', 'Fall', 'Farming', 'Friendship', '236', 200, 90, 'Defense +2, Luck +2', '7m 41s', '300g'),
  ('Super Meal', '["Bok Choy","Cranberries","Artichoke"]', 'Fall', 'Farming', 'Friendship', '237', 160, 72, 'Max Energy +40, Speed +1', '3m 30s', '220g'),
  ('Cranberry Sauce', '["Cranberries","Sugar"]', 'Fall', 'Farming', 'Friendship', '238', 125, 56, 'Mining +2', '3m 30s', '120g'),
  ('Stuffing', '["Bread","Cranberries","Hazelnut"]', 'Fall', 'Mixed', 'Friendship', '239', 170, 76, 'Defense +2', '5m 35s', '165g'),
  ('Farmer''s Lunch', '["Omelet","Parsnip"]', 'Spring', 'Mixed', 'Skill', '240', 200, 90, 'Farming +3', '5m 35s', '150g'),
  ('Survival Burger', '["Bread","Cave Carrot","Eggplant"]', 'Fall', 'Mixed', 'Skill', '241', 125, 56, 'Foraging +3', '5m 35s', '180g'),
  ('Dish O'' The Sea', '["Sardine x2","Hashbrowns"]', 'Any', 'Fishing', 'Skill', '242', 150, 67, 'Fishing +3', '5m 35s', '220g'),
  ('Miner''s Treat', '["Cave Carrot x2","Sugar","Milk"]', 'Any', 'Foraging', 'Skill', '243', 125, 56, 'Mining +3, Magnetism +32', '5m 35s', '200g'),
  ('Roots Platter', '["Cave Carrot","Winter Root"]', 'Winter', 'Foraging', 'Skill', '244', 125, 56, 'Attack +3', '5m 35s', '100g'),
  ('Triple Shot Espresso', '["Coffee x3"]', 'Any', 'Artisan', 'Shop', '253', 8, 3, 'Speed +1', '4m 12s', '450g'),
  ('Seafoam Pudding', '["Flounder","Midnight Carp","Squid Ink"]', 'Fall', 'Fishing', 'Skill', '265', 175, 78, 'Fishing +4', '3m 30s', '300g'),
  ('Algae Soup', '["Green Algae x4"]', 'Any', 'Fishing', 'Friendship', '456', 75, 33, '', '', '100g'),
  ('Pale Broth', '["White Algae x2"]', 'Any', 'Fishing', 'Friendship', '457', 125, 56, '', '', '150g'),
  ('Plum Pudding', '["Wild Plum x2","Wheat Flour","Sugar"]', 'Fall', 'Foraging', 'QoS Y1 Winter', '604', 175, 78, '', '', '260g'),
  ('Artichoke Dip', '["Artichoke","Milk"]', 'Fall', 'Farming', 'QoS Y1 Fall', '605', 100, 45, '', '', '210g'),
  ('Stir Fry', '["Cave Carrot","Common Mushroom","Kale","Oil"]', 'Any', 'Mixed', 'QoS Y1 Spring', '606', 200, 90, '', '', '335g'),
  ('Roasted Hazelnuts', '["Hazelnut x3"]', 'Fall', 'Foraging', 'QoS Y2 Summer', '607', 175, 78, '', '', '270g'),
  ('Pumpkin Pie', '["Pumpkin","Wheat Flour","Milk","Sugar"]', 'Fall', 'Farming', 'QoS Y1 Winter', '608', 225, 101, '', '', '385g'),
  ('Radish Salad', '["Oil","Vinegar","Radish"]', 'Summer', 'Farming', 'QoS Y1 Spring', '609', 200, 90, '', '', '300g'),
  ('Fruit Salad', '["Blueberry","Melon","Apricot"]', 'Summer', 'Farming', 'QoS Y2 Fall', '610', 263, 118, '', '', '450g'),
  ('Blackberry Cobbler', '["Blackberry x2","Sugar","Wheat Flour"]', 'Fall', 'Foraging', 'QoS Y2 Fall', '611', 175, 78, '', '', '260g'),
  ('Cranberry Candy', '["Cranberries","Apple","Sugar"]', 'Fall', 'Farming', 'QoS Y1 Winter', '612', 125, 56, '', '', '175g'),
  ('Bruschetta', '["Bread","Oil","Tomato"]', 'Summer', 'Mixed', 'QoS Y2 Winter', '618', 113, 50, '', '', '210g'),
  ('Coleslaw', '["Red Cabbage","Vinegar","Mayonnaise"]', 'Summer', 'Farming', 'QoS Y1 Spring', '648', 213, 95, '', '', '345g'),
  ('Fiddlehead Risotto', '["Oil","Fiddlehead Fern","Garlic"]', 'Summer', 'Foraging', 'QoS Y2 Fall', '649', 225, 101, '', '', '350g'),
  ('Poppyseed Muffin', '["Poppy","Wheat Flour","Sugar"]', 'Summer', 'Farming', 'QoS Y2 Winter', '651', 150, 67, '', '', '250g'),
  ('Chowder', '["Clam","Milk"]', 'Any', 'Crab Pot', 'Friendship', '727', 225, 101, 'Fishing +1', '16m 47s', '135g'),
  ('Fish Stew', '["Crayfish","Mussel","Periwinkle","Tomato"]', 'Summer', 'Crab Pot', 'Friendship', '728', 225, 101, 'Fishing +3', '16m 47s', '175g'),
  ('Escargot', '["Snail","Garlic"]', 'Any', 'Crab Pot', 'Friendship', '729', 225, 101, 'Fishing +2', '16m 47s', '125g'),
  ('Lobster Bisque', '["Lobster","Milk"]', 'Any', 'Crab Pot', 'QoS Y2 Winter', '730', 225, 101, 'Fishing +3, Max Energy +50', '16m 47s', '205g'),
  ('Maple Bar', '["Maple Syrup","Sugar","Wheat Flour"]', 'Any', 'Artisan', 'QoS Y2 Summer', '731', 225, 101, 'Farming +1, Fishing +1, Mining +1', '16m 47s', '300g'),
  ('Crab Cakes', '["Crab","Wheat Flour","Egg","Oil"]', 'Any', 'Crab Pot', 'QoS Y2 Fall', '732', 225, 101, 'Speed +1, Defense +1', '16m 47s', '275g'),
  ('Shrimp Cocktail', '["Tomato","Shrimp","Wild Horseradish"]', 'Spring', 'Crab Pot', 'QoS Y2 Winter', '733', 225, 101, 'Fishing +1, Luck +1', '10m 2s', '160g'),
  ('Ginger Ale', '["Ginger x3","Sugar"]', 'Island', 'Island', 'Shop', '903', 63, 28, 'Luck +1', '5m', '200g'),
  ('Banana Pudding', '["Banana","Milk","Sugar"]', 'Island', 'Island', 'Shop', '904', 125, 56, 'Mining +1, Luck +1, Defense +1', '5m 1s', '260g'),
  ('Mango Sticky Rice', '["Mango","Coconut","Rice"]', 'Island', 'Island', 'Friendship', '905', 113, 50, 'Defense +3', '5m 1s', '250g'),
  ('Poi', '["Taro Root x4"]', 'Island', 'Island', 'Friendship', '906', 75, 33, '', '', '400g'),
  ('Tropical Curry', '["Coconut","Pineapple","Hot Pepper"]', 'Island', 'Island', 'Shop', '907', 150, 67, 'Foraging +4', '5m 1s', '500g'),
  ('Squid Ink Ravioli', '["Squid Ink","Wheat Flour","Tomato"]', 'Summer', 'Monster Drop', 'Skill', '921', 125, 56, 'Mining +1, Debuff Immunity', '4m 39s', '150g'),
  ('Moss Soup', '["Moss x20"]', 'Any', 'Foraging', 'Skill', 'MossSoup', 70, 31, '', '', '100g')
ON CONFLICT (name) DO NOTHING;

-- 4. Updated RPC: save progress with ingredients
CREATE OR REPLACE FUNCTION public.save_progress(p_checked JSONB, p_ingredients_checked JSONB DEFAULT '{}'::JSONB)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO recipe_progress (user_id, checked, ingredients_checked, updated_at)
  VALUES (auth.uid(), p_checked, p_ingredients_checked, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    checked = EXCLUDED.checked,
    ingredients_checked = EXCLUDED.ingredients_checked,
    updated_at = EXCLUDED.updated_at;
$$;

-- 5. Updated RPC: get progress (now includes ingredients)
CREATE OR REPLACE FUNCTION public.get_progress()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'checked', COALESCE((SELECT checked FROM recipe_progress WHERE user_id = auth.uid()), '{}'::jsonb),
    'ingredients_checked', COALESCE((SELECT ingredients_checked FROM recipe_progress WHERE user_id = auth.uid()), '{}'::jsonb)
  );
$$;

-- 6. RPC to fetch all recipes (lightweight, cacheable)
CREATE OR REPLACE FUNCTION public.get_recipes()
RETURNS SETOF public.recipes
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM recipes ORDER BY id;
$$;
