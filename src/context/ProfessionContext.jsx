import { createContext, useContext, useMemo, useState } from 'react';
import {
  DEFAULT_PROFESSION_SELECTION,
  normalizeProfessionSelection,
  validateProfessionSelection,
  getActiveProfessionIds,
} from '../data/professions';
import { PROFESSION_PRICE_FILTERS } from '../utils/professionPricing';

const STORAGE_KEY = 'sdv-profession-context-v1';
const ProfessionContext = createContext(null);

function readStoredSelection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFESSION_SELECTION;
    const parsed = JSON.parse(raw);
    const checked = validateProfessionSelection(parsed);
    return checked.valid ? checked.normalized : DEFAULT_PROFESSION_SELECTION;
  } catch {
    return DEFAULT_PROFESSION_SELECTION;
  }
}

export function ProfessionProvider({ children }) {
  const [selection, setSelection] = useState(() => readStoredSelection());
  const [priceFilterMode, setPriceFilterMode] = useState(PROFESSION_PRICE_FILTERS.all);

  const setSkillSelection = (skill, level5, level10 = null) => {
    setSelection((prev) => {
      const next = normalizeProfessionSelection(prev);
      next[skill] = { level5: level5 ?? null, level10: level10 ?? null };
      const validation = validateProfessionSelection(next);
      if (!validation.valid) return prev;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validation.normalized));
      return validation.normalized;
    });
  };

  const resetSelection = () => {
    setSelection(DEFAULT_PROFESSION_SELECTION);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFESSION_SELECTION));
  };

  const value = useMemo(() => ({
    selection,
    activeProfessionIds: getActiveProfessionIds(selection),
    priceFilterMode,
    setPriceFilterMode,
    setSkillSelection,
    resetSelection,
  }), [selection, priceFilterMode]);

  return (
    <ProfessionContext.Provider value={value}>
      {children}
    </ProfessionContext.Provider>
  );
}

export function useProfession() {
  const value = useContext(ProfessionContext);
  if (!value) throw new Error('useProfession must be used within ProfessionProvider');
  return value;
}
