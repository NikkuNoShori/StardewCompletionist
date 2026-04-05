import { useRecipeStore } from '../hooks/useRecipeStore';

export default function ControlsBar() {
  const searchQuery = useRecipeStore((s) => s.searchQuery);
  const setSearch = useRecipeStore((s) => s.setSearch);
  const sortMode = useRecipeStore((s) => s.sortMode);
  const setSort = useRecipeStore((s) => s.setSort);

  return (
    <div className="controls-bar">
      <div className="search-wrap">
        <input
          type="text"
          placeholder="Search recipes or ingredients..."
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
            &times;
          </button>
        )}
      </div>
      <div className="sort-wrap">
        <select value={sortMode} onChange={(e) => setSort(e.target.value)}>
          <option value="alpha">A–Z</option>
          <option value="harvest">Ingredient Season</option>
          <option value="type">Item Type</option>
          <option value="source">Recipe Source</option>
        </select>
      </div>
    </div>
  );
}
