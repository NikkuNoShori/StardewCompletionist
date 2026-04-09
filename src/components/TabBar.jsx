import { useRecipeStore } from '../hooks/useRecipeStore';

const TABS = [
  {
    key: 'recipes',
    label: 'Recipes',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6 2 10c0 2.5 1.5 4.5 3 6v4a1 1 0 001 1h12a1 1 0 001-1v-4c1.5-1.5 3-3.5 3-6 0-4-4.48-8-10-8z" />
        <path d="M8 21v-2h8v2" />
      </svg>
    ),
  },
  {
    key: 'ingredients',
    label: 'Ingredients',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="4" cy="6" r="1.5" fill="currentColor" /><circle cx="4" cy="12" r="1.5" fill="currentColor" /><circle cx="4" cy="18" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
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
          <span className="tab-icon">{t.icon}</span>
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
