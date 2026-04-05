import { useMemo } from 'react';
import { useRecipeStore } from '../hooks/useRecipeStore';
import { RECIPES, SEASON_ORDER, TYPE_ORDER, SOURCE_ORDER, SOURCE_LABELS } from '../data/recipes';
import { ICONS } from '../data/icons';

function getIcon(id) { return ICONS[String(id)] || ''; }

export default function WikiTable() {
  const checked = useRecipeStore((s) => s.checked);
  const currentFilter = useRecipeStore((s) => s.currentFilter);
  const searchQuery = useRecipeStore((s) => s.searchQuery);
  const sortMode = useRecipeStore((s) => s.sortMode);
  const toggle = useRecipeStore((s) => s.toggle);

  const sorted = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const indices = RECIPES.map((_, i) => i).filter((i) => {
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

    const copy = [...indices];
    const cmp = (a, b) => RECIPES[a][0].localeCompare(RECIPES[b][0]);
    switch (sortMode) {
      case 'alpha': copy.sort(cmp); break;
      case 'harvest': copy.sort((a, b) => (SEASON_ORDER[RECIPES[a][2]] ?? 5) - (SEASON_ORDER[RECIPES[b][2]] ?? 5) || cmp(a, b)); break;
      case 'type': copy.sort((a, b) => (TYPE_ORDER[RECIPES[a][3]] ?? 9) - (TYPE_ORDER[RECIPES[b][3]] ?? 9) || cmp(a, b)); break;
      case 'source': copy.sort((a, b) => (SOURCE_ORDER[RECIPES[a][4]] ?? 12) - (SOURCE_ORDER[RECIPES[b][4]] ?? 12) || cmp(a, b)); break;
    }
    return copy;
  }, [checked, currentFilter, searchQuery, sortMode]);

  if (sorted.length === 0) return <div className="empty">No recipes found</div>;

  return (
    <table className="wiki-tbl">
      <thead>
        <tr>
          <th></th><th>Name</th><th className="wings">Ingredients</th>
          <th>Energy</th><th>HP</th><th>Buffs</th><th>Sell</th><th className="wsrc">Source</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((i) => {
          const r = RECIPES[i];
          const ic = getIcon(r[5]);
          return (
            <tr key={i} className={checked[i] ? 'chk' : ''} onClick={() => toggle(i)} style={{ cursor: 'pointer' }}>
              <td>{ic && <img className="wicon" src={ic} alt="" />}</td>
              <td className="wname">{r[0]}</td>
              <td className="wings">{r[1].join(', ')}</td>
              <td className="wenergy">{r[6]}</td>
              <td className="whealth">{r[7]}</td>
              <td className="wbuff">{r[8] || '—'}</td>
              <td className="wsell">{r[10]}</td>
              <td className="wsrc">{SOURCE_LABELS[r[4]] || r[4]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
