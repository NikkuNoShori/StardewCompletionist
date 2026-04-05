import { useRecipeStore } from '../hooks/useRecipeStore';

export default function Header() {
  const checked = useRecipeStore((s) => s.checked);
  const done = Object.values(checked).filter(Boolean).length;
  const total = 81;
  const pct = Math.round((done / total) * 100);

  return (
    <header className="header">
      <h1>Stardew Valley Recipes</h1>
      <p className="subtitle">{done} of {total} recipes cooked</p>
      <div className="progress-wrap">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
        <div className="progress-text">{done} / {total} — {pct}%</div>
      </div>
    </header>
  );
}
