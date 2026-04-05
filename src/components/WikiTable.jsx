import { useMemo } from 'react';
import { useRecipeStore } from '../hooks/useRecipeStore';
import { RECIPES, SEASON_ORDER, TYPE_ORDER, SOURCE_ORDER, SOURCE_LABELS } from '../data/recipes';
import { ICONS } from '../data/icons';
import { useIsMobile } from '../hooks/useMediaQuery';

function getIcon(id) { return ICONS[String(id)] || ''; }

function parseSellPrice(s) {
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

export default function WikiTable() {
  const checked = useRecipeStore((s) => s.checked);
  const currentFilter = useRecipeStore((s) => s.currentFilter);
  const searchQuery = useRecipeStore((s) => s.searchQuery);
  const sortMode = useRecipeStore((s) => s.sortMode);
  const toggle = useRecipeStore((s) => s.toggle);
  const wikiSort = useRecipeStore((s) => s.wikiSort);
  const setWikiSort = useRecipeStore((s) => s.setWikiSort);
  const isMobile = useIsMobile();

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
    const { column, direction } = wikiSort;
    const dir = direction === 'asc' ? 1 : -1;

    copy.sort((a, b) => {
      const ra = RECIPES[a], rb = RECIPES[b];
      switch (column) {
        case 'name': return dir * ra[0].localeCompare(rb[0]);
        case 'energy': return dir * (ra[6] - rb[6]);
        case 'health': return dir * (ra[7] - rb[7]);
        case 'sell': return dir * (parseSellPrice(ra[10]) - parseSellPrice(rb[10]));
        case 'source': return dir * ((SOURCE_ORDER[ra[4]] ?? 12) - (SOURCE_ORDER[rb[4]] ?? 12));
        default: return ra[0].localeCompare(rb[0]);
      }
    });
    return copy;
  }, [checked, currentFilter, searchQuery, wikiSort]);

  const sortArrow = (col) => {
    if (wikiSort.column !== col) return ' \u21D5';
    return wikiSort.direction === 'asc' ? ' \u2191' : ' \u2193';
  };

  if (sorted.length === 0) return <div className="empty">No recipes found</div>;

  if (isMobile) {
    return (
      <div className="wiki-cards">
        {sorted.map((i) => {
          const r = RECIPES[i];
          const ic = getIcon(r[5]);
          return (
            <div key={i} className={`wiki-card${checked[i] ? ' chk' : ''}`} onClick={() => toggle(i)}>
              <div className="wiki-card-top">
                {ic && <img className="wicon" src={ic} alt="" />}
                <span className="wname">{r[0]}</span>
              </div>
              <div className="wiki-card-ings">{r[1].join(', ')}</div>
              <div className="wiki-card-stats">
                <span className="wenergy">{r[6]}E</span>
                <span className="whealth">{r[7]}HP</span>
                <span className="wsell">{r[10]}</span>
              </div>
              {r[8] && <div className="wiki-card-buff">{r[8]}</div>}
              <div className="wiki-card-src">{SOURCE_LABELS[r[4]] || r[4]}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <table className="wiki-tbl">
      <thead>
        <tr>
          <th></th>
          <th className="wiki-th-sort" onClick={() => setWikiSort('name')}>Name{sortArrow('name')}</th>
          <th className="wings">Ingredients</th>
          <th className="wiki-th-sort" onClick={() => setWikiSort('energy')}>Energy{sortArrow('energy')}</th>
          <th className="wiki-th-sort" onClick={() => setWikiSort('health')}>HP{sortArrow('health')}</th>
          <th>Buffs</th>
          <th className="wiki-th-sort" onClick={() => setWikiSort('sell')}>Sell{sortArrow('sell')}</th>
          <th className="wsrc wiki-th-sort" onClick={() => setWikiSort('source')}>Source{sortArrow('source')}</th>
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
