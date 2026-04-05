import { useMemo } from 'react';
import { useRecipeStore } from '../hooks/useRecipeStore';
import { RECIPES, parseIngredient } from '../data/recipes';

export default function IngredientTable() {
  const checked = useRecipeStore((s) => s.checked);
  const currentFilter = useRecipeStore((s) => s.currentFilter);
  const searchQuery = useRecipeStore((s) => s.searchQuery);
  const ingredientSort = useRecipeStore((s) => s.ingredientSort);
  const setIngredientSort = useRecipeStore((s) => s.setIngredientSort);

  const data = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // Get filtered recipe indices
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

    // Aggregate ingredients
    const map = {};
    indices.forEach((i) => {
      RECIPES[i][1].forEach((raw) => {
        const { name, qty } = parseIngredient(raw);
        if (!map[name]) map[name] = { total: 0, recipes: [] };
        map[name].total += qty;
        map[name].recipes.push(RECIPES[i][0]);
      });
    });

    let entries = Object.entries(map).map(([name, d]) => ({
      name,
      qty: d.total,
      recipes: d.recipes,
      recipesStr: d.recipes.join(', '),
    }));

    // Filter by search in ingredient names too
    if (q) {
      entries = entries.filter((e) =>
        e.name.toLowerCase().includes(q) ||
        e.recipes.some((r) => r.toLowerCase().includes(q))
      );
    }

    // Sort
    const { column, direction } = ingredientSort;
    const dir = direction === 'asc' ? 1 : -1;
    entries.sort((a, b) => {
      if (column === 'name') return dir * a.name.localeCompare(b.name);
      if (column === 'qty') return dir * (a.qty - b.qty);
      if (column === 'recipes') return dir * a.recipesStr.localeCompare(b.recipesStr);
      return 0;
    });

    return entries;
  }, [checked, currentFilter, searchQuery, ingredientSort]);

  const sortArrow = (col) => {
    if (ingredientSort.column !== col) return ' ↕';
    return ingredientSort.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (data.length === 0) {
    return <div className="empty">No ingredients to show</div>;
  }

  return (
    <>
      {currentFilter === 'remaining' && (
        <div className="note">
          <b>Shopping List:</b> Total ingredients for remaining unchecked recipes.
        </div>
      )}
      <table className="ing-table">
        <thead>
          <tr>
            <th className="ing-th clickable" onClick={() => setIngredientSort('name')}>
              Ingredient{sortArrow('name')}
            </th>
            <th className="ing-th ing-th-qty clickable" onClick={() => setIngredientSort('qty')}>
              Qty{sortArrow('qty')}
            </th>
            <th className="ing-th ing-th-recipes clickable" onClick={() => setIngredientSort('recipes')}>
              Used In{sortArrow('recipes')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.name} className="ig-row-tr">
              <td className="iname">{entry.name}</td>
              <td className="iqty-cell"><span className="iqty">{entry.qty}</span></td>
              <td className="irec">{entry.recipesStr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
