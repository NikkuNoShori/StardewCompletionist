import { useMemo } from 'react';
import { useRecipeStore } from '../hooks/useRecipeStore';
import { RECIPES, SEASON_ORDER, TYPE_ORDER, SOURCE_ORDER, SOURCE_LABELS, seasonLabel } from '../data/recipes';
import { ICONS } from '../data/icons';
import { useIsMobile } from '../hooks/useMediaQuery';

function getIcon(id) {
  return ICONS[String(id)] || '';
}

function dotClass(key, mode) {
  if (mode === 'harvest') {
    return { Spring: 'dot-spring', Summer: 'dot-summer', Fall: 'dot-fall', Winter: 'dot-winter', Any: 'dot-any', Island: 'dot-island' }[key] || 'dot-any';
  }
  if (mode === 'type') {
    return { Farming: 'dot-crop', Fishing: 'dot-fish', 'Crab Pot': 'dot-crabpot', Foraging: 'dot-forage', Animal: 'dot-animal', Artisan: 'dot-artisan', 'Store-Bought': 'dot-store', 'Monster Drop': 'dot-monster', Island: 'dot-island', Mixed: 'dot-other' }[key] || 'dot-other';
  }
  return 'dot-any';
}

export default function RecipeList() {
  const checked = useRecipeStore((s) => s.checked);
  const currentFilter = useRecipeStore((s) => s.currentFilter);
  const searchQuery = useRecipeStore((s) => s.searchQuery);
  const sortMode = useRecipeStore((s) => s.sortMode);
  const toggle = useRecipeStore((s) => s.toggle);
  const collapsedGroups = useRecipeStore((s) => s.collapsedGroups);
  const toggleGroup = useRecipeStore((s) => s.toggleGroup);
  const isMobile = useIsMobile();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return RECIPES.map((_, i) => i).filter((i) => {
      const isChecked = !!checked[i];
      if (currentFilter === 'remaining' && isChecked) return false;
      if (currentFilter === 'completed' && !isChecked) return false;
      if (q) {
        const r = RECIPES[i];
        const txt = (r[0] + ' ' + r[1].join(' ') + ' ' + r[2] + ' ' + r[3] + ' ' + r[4] + ' ' + r[8]).toLowerCase();
        if (!txt.includes(q)) return false;
      }
      return true;
    });
  }, [checked, currentFilter, searchQuery]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    const cmp = (a, b) => RECIPES[a][0].localeCompare(RECIPES[b][0]);
    switch (sortMode) {
      case 'alpha': copy.sort(cmp); break;
      case 'harvest': copy.sort((a, b) => (SEASON_ORDER[RECIPES[a][2]] ?? 5) - (SEASON_ORDER[RECIPES[b][2]] ?? 5) || cmp(a, b)); break;
      case 'type': copy.sort((a, b) => (TYPE_ORDER[RECIPES[a][3]] ?? 9) - (TYPE_ORDER[RECIPES[b][3]] ?? 9) || cmp(a, b)); break;
      case 'source': copy.sort((a, b) => (SOURCE_ORDER[RECIPES[a][4]] ?? 12) - (SOURCE_ORDER[RECIPES[b][4]] ?? 12) || cmp(a, b)); break;
    }
    return copy;
  }, [filtered, sortMode]);

  // Group recipes by current sort mode
  const groups = useMemo(() => {
    if (sortMode === 'alpha') return null;

    const groupMap = new Map();
    sorted.forEach((i) => {
      let gk;
      if (sortMode === 'harvest') gk = RECIPES[i][2];
      else if (sortMode === 'type') gk = RECIPES[i][3];
      else if (sortMode === 'source') gk = RECIPES[i][4];
      if (!groupMap.has(gk)) groupMap.set(gk, []);
      groupMap.get(gk).push(i);
    });
    return groupMap;
  }, [sorted, sortMode]);

  if (sorted.length === 0) {
    return <div className="empty">No recipes found</div>;
  }

  const renderRecipe = (i) => {
    const r = RECIPES[i];
    const isChecked = !!checked[i];
    const ic = getIcon(r[5]);
    const meta = sortMode === 'alpha' ? `${seasonLabel(r[2])} · ${r[3]}${r[8] ? ` · ${r[8]}` : ''}` : '';

    return (
      <div key={i} className={`rc${isChecked ? ' chk' : ''}`} onClick={() => toggle(i)}>
        <div className="cb">
          <svg className="ck" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {ic && <img className="ricon" src={ic} alt="" />}
        <div className="ri">
          <div className="rn">{r[0]}</div>
          {meta && <div className="rm">{meta}</div>}
          <div className="rg">
            {r[1].map((ing, j) => <span key={j}>{ing}</span>)}
          </div>
        </div>
      </div>
    );
  };

  // Flat list for alphabetical
  if (!groups) {
    return <>{sorted.map(renderRecipe)}</>;
  }

  // Grouped list with collapsible sections
  return (
    <>
      {Array.from(groups.entries()).map(([gk, indices]) => {
        const key = `${sortMode}:${gk}`;
        const isCollapsed = collapsedGroups[key] ?? isMobile;
        const label = sortMode === 'source' ? (SOURCE_LABELS[gk] || gk) : seasonLabel(gk);
        const doneInGroup = indices.filter((i) => !!checked[i]).length;

        return (
          <div key={key} className="collapsible-group">
            <div
              className="group-hdr"
              onClick={() => toggleGroup(gk)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGroup(gk); } }}
            >
              <span className={`chevron ${isCollapsed ? '' : 'chevron-open'}`}>&#9654;</span>
              <span className={`sdot ${dotClass(gk, sortMode)}`} />
              <span className="group-label">{label}</span>
              <span className="group-count">{doneInGroup}/{indices.length}</span>
            </div>
            {!isCollapsed && (
              <div className="group-items">
                {indices.map(renderRecipe)}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
