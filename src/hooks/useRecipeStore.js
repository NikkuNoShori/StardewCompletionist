import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RECIPES, DEFAULT_REMAINING } from '../data/recipes';

function buildDefaultChecked() {
  const checked = {};
  RECIPES.forEach((r, i) => {
    if (!DEFAULT_REMAINING.has(r[0])) checked[i] = true;
  });
  return checked;
}

export const useRecipeStore = create(
  persist(
    (set, get) => ({
      // Recipe completion state
      checked: buildDefaultChecked(),

      // UI state
      currentTab: 'recipes',    // 'recipes' | 'ingredients' | 'wiki'
      currentFilter: 'all',     // 'all' | 'remaining' | 'completed'
      searchQuery: '',
      sortMode: 'alpha',        // 'alpha' | 'harvest' | 'type' | 'source'
      ingredientSort: { column: 'name', direction: 'asc' },
      wikiSort: { column: 'name', direction: 'asc' },
      collapsedGroups: {},       // keyed by "sortMode:groupKey" -> boolean

      // Actions
      toggle: (idx) => set((state) => {
        const next = { ...state.checked };
        if (next[idx]) {
          delete next[idx];
        } else {
          next[idx] = true;
        }
        return { checked: next };
      }),

      setTab: (tab) => set({ currentTab: tab }),
      setFilter: (filter) => set({ currentFilter: filter }),
      setSearch: (query) => set({ searchQuery: query }),
      setSort: (mode) => set({ sortMode: mode }),
      setIngredientSort: (column) => set((state) => {
        const prev = state.ingredientSort;
        if (prev.column === column) {
          return { ingredientSort: { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' } };
        }
        return { ingredientSort: { column, direction: column === 'qty' ? 'desc' : 'asc' } };
      }),
      setWikiSort: (column) => set((state) => {
        const prev = state.wikiSort;
        if (prev.column === column) {
          return { wikiSort: { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' } };
        }
        return { wikiSort: { column, direction: column === 'energy' || column === 'health' || column === 'sell' ? 'desc' : 'asc' } };
      }),
      toggleGroup: (groupKey) => set((state) => {
        const key = `${state.sortMode}:${groupKey}`;
        return { collapsedGroups: { ...state.collapsedGroups, [key]: !state.collapsedGroups[key] } };
      }),

      resetAll: () => set({ checked: {} }),
      checkAll: () => {
        const checked = {};
        RECIPES.forEach((_, i) => { checked[i] = true; });
        set({ checked });
      },

      // Supabase sync
      loadFromSupabase: (data) => set({ checked: data }),
      getCheckedObject: () => get().checked,

      // Derived counts
      doneCount: () => Object.values(get().checked).filter(Boolean).length,
      totalCount: () => RECIPES.length,
    }),
    {
      name: 'sdv-recipes-store',
      partialize: (state) => ({
        checked: state.checked,
        currentTab: state.currentTab,
        currentFilter: state.currentFilter,
        sortMode: state.sortMode,
        ingredientSort: state.ingredientSort,
        wikiSort: state.wikiSort,
        collapsedGroups: state.collapsedGroups,
      }),
    }
  )
);
