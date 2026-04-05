import { useRecipeStore } from '../hooks/useRecipeStore';

const TABS = [
  { key: 'recipes', label: 'Recipes' },
  { key: 'ingredients', label: 'Ingredients' },
  { key: 'wiki', label: 'Wiki Reference' },
];

export default function TabBar() {
  const currentTab = useRecipeStore((s) => s.currentTab);
  const setTab = useRecipeStore((s) => s.setTab);

  return (
    <div className="tab-bar">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={`tab-btn${currentTab === t.key ? ' active' : ''}`}
          onClick={() => setTab(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
