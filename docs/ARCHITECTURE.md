# Stardew Valley Recipes — Architecture Document

## Overview
A comprehensive Stardew Valley cooking recipe tracker built with Vite + React. Users can track which recipes they've cooked, view ingredient shopping lists, browse a wiki-style reference table, and sort/filter recipes by season, item type, and recipe source.

## Tech Stack
- **Framework**: Vite + React 18
- **State Management**: Zustand (global store with persistence)
- **Auth**: Supabase Auth (Email/Password + Google OAuth)
- **Database**: Supabase PostgreSQL (recipe completion state per user)
- **Routing**: React Router DOM v6
- **Styling**: CSS Modules + CSS Custom Properties (Stardew pixel-art aesthetic)
- **Icons**: Base64-embedded webp sprites from stardew.app CDN

## Directory Structure
```
src/
├── main.jsx                # Entry point, wraps app in providers
├── App.jsx                 # Router + layout shell
├── components/
│   ├── Header.jsx          # Title, progress bar, subtitle
│   ├── TabBar.jsx          # Recipes / Ingredients / Wiki Reference tabs
│   ├── FilterBar.jsx       # All / Remaining / Completed filters
│   ├── ControlsBar.jsx     # Search input + sort dropdown
│   ├── RecipeList.jsx      # Checklist view of recipes with icons
│   ├── RecipeCard.jsx      # Individual recipe row (checkbox, icon, name, tags)
│   ├── IngredientTable.jsx # Sortable 3-column ingredient aggregation
│   ├── WikiTable.jsx       # Full data table (icon, name, ings, energy, hp, buffs, sell, source)
│   ├── AuthModal.jsx       # Login/signup modal (email + Google OAuth)
│   ├── UserMenu.jsx        # Logged-in user dropdown (email, sign out)
│   └── ActionButtons.jsx   # Reset All / Complete All buttons
├── context/
│   └── AuthContext.jsx     # React context for Supabase auth session
├── data/
│   ├── recipes.js          # All 81 recipes with full metadata
│   └── icons.js            # Base64-embedded recipe icon sprites
├── hooks/
│   ├── useRecipeStore.js   # Zustand store: checked state, filter, sort, tab, search
│   └── useSupabaseSync.js  # Hook to sync Zustand state ↔ Supabase on auth changes
├── lib/
│   └── supabase.js         # Supabase client initialization
├── pages/
│   └── Home.jsx            # Main page composing all components
├── styles/
│   └── index.css           # Global styles, CSS variables, Stardew theme
docs/
└── ARCHITECTURE.md         # This file
```

## State Management (Zustand)
The `useRecipeStore` is the single source of truth for UI + data state:
- `checked: Record<number, boolean>` — which recipe indices are completed
- `currentTab: 'recipes' | 'ingredients' | 'wiki'`
- `currentFilter: 'all' | 'remaining' | 'completed'`
- `searchQuery: string`
- `sortMode: 'alpha' | 'harvest' | 'type' | 'source'`
- `ingredientSort: { column: string, direction: 'asc' | 'desc' }`

Actions: `toggle(idx)`, `setTab()`, `setFilter()`, `setSearch()`, `setSort()`, `setIngredientSort()`, `resetAll()`, `checkAll()`, `loadFromSupabase(data)`, `getCheckedArray()`

## Auth Flow
1. User opens app → anonymous (localStorage-only) state
2. User clicks "Sign In" → AuthModal with email/password or Google OAuth
3. On successful auth → `useSupabaseSync` loads saved state from `recipe_progress` table
4. Every `toggle/reset/checkAll` → debounced sync to Supabase
5. On sign out → state preserved locally, Supabase sync paused

## Supabase Schema
```sql
-- Table: recipe_progress
CREATE TABLE recipe_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  checked JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS Policies
ALTER TABLE recipe_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own progress" ON recipe_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON recipe_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON recipe_progress FOR UPDATE USING (auth.uid() = user_id);
```

## Data Model (per recipe)
Each recipe in `recipes.js` is an array:
```
[name, [ingredients], harvestSeason, itemType, recipeSource, objectId, energy, health, buffs, buffDuration, sellPrice]
```
- `harvestSeason`: Spring | Summer | Fall | Winter | Any | Island
- `itemType`: Farming | Fishing | Crab Pot | Foraging | Animal | Artisan | Store-Bought | Monster Drop | Island | Mixed
- `recipeSource`: Starter | QoS Y1/Y2 Season | Friendship | Skill | Shop

## Sort Logic
- **A–Z**: Alphabetical by recipe name
- **Ingredient Season**: Grouped by earliest season all ingredients are available
- **Item Type**: Grouped by primary ingredient category
- **Recipe Source**: Grouped by how the recipe is learned (QoS schedule, friendship, skill, shop)

## Ingredient Table Sort
Sortable by clicking column headers:
- **Ingredient** (A–Z / Z–A)
- **Qty** (High–Low / Low–High)
- **Used In** (A–Z / Z–A by first recipe name)
