-- ============================================
-- 004_source_details.sql
-- Add detailed unlock conditions for all recipes
-- ============================================

-- Add source_detail column
ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS source_detail TEXT NOT NULL DEFAULT '';

-- Update all recipes with specific unlock conditions
UPDATE recipes SET source_detail = 'Default Recipe' WHERE name = 'Fried Egg';
UPDATE recipes SET source_detail = 'Queen of Sauce, Spring 28, Year 1' WHERE name = 'Omelet';
UPDATE recipes SET source_detail = 'Emily 3 Hearts' WHERE name = 'Salad';
UPDATE recipes SET source_detail = 'Pam 3 Hearts' WHERE name = 'Cheese Cauliflower';
UPDATE recipes SET source_detail = 'Queen of Sauce, Summer 7, Year 1' WHERE name = 'Baked Fish';
UPDATE recipes SET source_detail = 'Caroline 3 Hearts' WHERE name = 'Parsnip Soup';
UPDATE recipes SET source_detail = 'Caroline 7 Hearts' WHERE name = 'Vegetable Medley';
UPDATE recipes SET source_detail = 'Queen of Sauce, Spring 21, Year 2' WHERE name = 'Complete Breakfast';
UPDATE recipes SET source_detail = 'Jodi 3 Hearts' WHERE name = 'Fried Calamari';
UPDATE recipes SET source_detail = 'Shane 7 Hearts' WHERE name = 'Strange Bun';
UPDATE recipes SET source_detail = 'Queen of Sauce, Spring 28, Year 2' WHERE name = 'Lucky Lunch';
UPDATE recipes SET source_detail = 'Demetrius 3 Hearts' WHERE name = 'Fried Mushroom';
UPDATE recipes SET source_detail = 'Queen of Sauce, Spring 7, Year 2' WHERE name = 'Pizza';
UPDATE recipes SET source_detail = 'Clint 7 Hearts' WHERE name = 'Bean Hotpot';
UPDATE recipes SET source_detail = 'Queen of Sauce, Fall 21, Year 1' WHERE name = 'Glazed Yams';
UPDATE recipes SET source_detail = 'Queen of Sauce, Summer 7, Year 2' WHERE name = 'Carp Surprise';
UPDATE recipes SET source_detail = 'Queen of Sauce, Spring 14, Year 2' WHERE name = 'Hashbrowns';
UPDATE recipes SET source_detail = 'Queen of Sauce, Summer 14, Year 1' WHERE name = 'Pancakes';
UPDATE recipes SET source_detail = 'Gus 3 Hearts' WHERE name = 'Salmon Dinner';
UPDATE recipes SET source_detail = 'Linus 7 Hearts' WHERE name = 'Fish Taco';
UPDATE recipes SET source_detail = 'Kent 3 Hearts' WHERE name = 'Crispy Bass';
UPDATE recipes SET source_detail = 'Shane 3 Hearts' WHERE name = 'Pepper Poppers';
UPDATE recipes SET source_detail = 'Queen of Sauce, Summer 28, Year 1' WHERE name = 'Bread';
UPDATE recipes SET source_detail = 'Sandy 7 Hearts' WHERE name = 'Tom Kha Soup';
UPDATE recipes SET source_detail = 'Queen of Sauce, Fall 14, Year 1' WHERE name = 'Trout Soup';
UPDATE recipes SET source_detail = 'Queen of Sauce, Winter 14, Year 1' WHERE name = 'Chocolate Cake';
UPDATE recipes SET source_detail = 'Queen of Sauce, Summer 21, Year 2' WHERE name = 'Pink Cake';
UPDATE recipes SET source_detail = 'Marnie 7 Hearts' WHERE name = 'Rhubarb Pie';
UPDATE recipes SET source_detail = 'Evelyn 4 Hearts' WHERE name = 'Cookie';
UPDATE recipes SET source_detail = 'Lewis 3 Hearts' WHERE name = 'Spaghetti';
UPDATE recipes SET source_detail = 'George 3 Hearts' WHERE name = 'Fried Eel';
UPDATE recipes SET source_detail = 'George 7 Hearts' WHERE name = 'Spicy Eel';
UPDATE recipes SET source_detail = 'Linus 3 Hearts' WHERE name = 'Sashimi';
UPDATE recipes SET source_detail = 'Queen of Sauce, Summer 21, Year 1' WHERE name = 'Maki Roll';
UPDATE recipes SET source_detail = 'Queen of Sauce, Fall 7, Year 1' WHERE name = 'Tortilla';
UPDATE recipes SET source_detail = 'Emily 7 Hearts' WHERE name = 'Red Plate';
UPDATE recipes SET source_detail = 'Lewis 7 Hearts' WHERE name = 'Eggplant Parmesan';
UPDATE recipes SET source_detail = 'Evelyn 7 Hearts' WHERE name = 'Rice Pudding';
UPDATE recipes SET source_detail = 'Jodi 7 Hearts' WHERE name = 'Ice Cream';
UPDATE recipes SET source_detail = 'Pierre 3 Hearts' WHERE name = 'Blueberry Tart';
UPDATE recipes SET source_detail = 'Demetrius 7 Hearts' WHERE name = 'Autumn''s Bounty';
UPDATE recipes SET source_detail = 'Robin 7 Hearts' WHERE name = 'Pumpkin Soup';
UPDATE recipes SET source_detail = 'Kent 7 Hearts' WHERE name = 'Super Meal';
UPDATE recipes SET source_detail = 'Gus 7 Hearts' WHERE name = 'Cranberry Sauce';
UPDATE recipes SET source_detail = 'Pam 7 Hearts' WHERE name = 'Stuffing';
UPDATE recipes SET source_detail = 'Farming Level 3' WHERE name = 'Farmer''s Lunch';
UPDATE recipes SET source_detail = 'Foraging Level 2' WHERE name = 'Survival Burger';
UPDATE recipes SET source_detail = 'Fishing Level 3' WHERE name = 'Dish O'' The Sea';
UPDATE recipes SET source_detail = 'Mining Level 7' WHERE name = 'Miner''s Treat';
UPDATE recipes SET source_detail = 'Combat Level 3' WHERE name = 'Roots Platter';
UPDATE recipes SET source_detail = 'Stardrop Saloon, 5,000g' WHERE name = 'Triple Shot Espresso';
UPDATE recipes SET source_detail = 'Fishing Level 9' WHERE name = 'Seafoam Pudding';
UPDATE recipes SET source_detail = 'Clint 3 Hearts' WHERE name = 'Algae Soup';
UPDATE recipes SET source_detail = 'Marnie 3 Hearts' WHERE name = 'Pale Broth';
UPDATE recipes SET source_detail = 'Queen of Sauce, Winter 7, Year 1' WHERE name = 'Plum Pudding';
UPDATE recipes SET source_detail = 'Queen of Sauce, Fall 28, Year 1' WHERE name = 'Artichoke Dip';
UPDATE recipes SET source_detail = 'Queen of Sauce, Spring 7, Year 1' WHERE name = 'Stir Fry';
UPDATE recipes SET source_detail = 'Queen of Sauce, Summer 28, Year 2' WHERE name = 'Roasted Hazelnuts';
UPDATE recipes SET source_detail = 'Queen of Sauce, Winter 21, Year 1' WHERE name = 'Pumpkin Pie';
UPDATE recipes SET source_detail = 'Queen of Sauce, Spring 21, Year 1' WHERE name = 'Radish Salad';
UPDATE recipes SET source_detail = 'Queen of Sauce, Fall 7, Year 2' WHERE name = 'Fruit Salad';
UPDATE recipes SET source_detail = 'Queen of Sauce, Fall 14, Year 2' WHERE name = 'Blackberry Cobbler';
UPDATE recipes SET source_detail = 'Queen of Sauce, Winter 28, Year 1' WHERE name = 'Cranberry Candy';
UPDATE recipes SET source_detail = 'Queen of Sauce, Winter 21, Year 2' WHERE name = 'Bruschetta';
UPDATE recipes SET source_detail = 'Queen of Sauce, Spring 14, Year 1' WHERE name = 'Coleslaw';
UPDATE recipes SET source_detail = 'Queen of Sauce, Fall 28, Year 2' WHERE name = 'Fiddlehead Risotto';
UPDATE recipes SET source_detail = 'Queen of Sauce, Winter 7, Year 2' WHERE name = 'Poppyseed Muffin';
UPDATE recipes SET source_detail = 'Willy 3 Hearts' WHERE name = 'Chowder';
UPDATE recipes SET source_detail = 'Willy 7 Hearts' WHERE name = 'Fish Stew';
UPDATE recipes SET source_detail = 'Willy 5 Hearts' WHERE name = 'Escargot';
UPDATE recipes SET source_detail = 'Queen of Sauce, Winter 14, Year 2' WHERE name = 'Lobster Bisque';
UPDATE recipes SET source_detail = 'Queen of Sauce, Summer 14, Year 2' WHERE name = 'Maple Bar';
UPDATE recipes SET source_detail = 'Queen of Sauce, Fall 21, Year 2' WHERE name = 'Crab Cakes';
UPDATE recipes SET source_detail = 'Queen of Sauce, Winter 28, Year 2' WHERE name = 'Shrimp Cocktail';
UPDATE recipes SET source_detail = 'Island Trader, 1,000g' WHERE name = 'Ginger Ale';
UPDATE recipes SET source_detail = 'Island Trader, 30 Bone Fragments' WHERE name = 'Banana Pudding';
UPDATE recipes SET source_detail = 'Leo 7 Hearts' WHERE name = 'Mango Sticky Rice';
UPDATE recipes SET source_detail = 'Leo 3 Hearts' WHERE name = 'Poi';
UPDATE recipes SET source_detail = 'Island Trader, 2,000g' WHERE name = 'Tropical Curry';
UPDATE recipes SET source_detail = 'Combat Level 9' WHERE name = 'Squid Ink Ravioli';
UPDATE recipes SET source_detail = 'Foraging Level 3' WHERE name = 'Moss Soup';

-- Update get_recipes RPC to include the new column (it returns SETOF so it auto-includes)
-- No change needed since get_recipes returns SETOF public.recipes
