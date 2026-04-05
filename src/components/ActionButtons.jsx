import { useRecipeStore } from '../hooks/useRecipeStore';

export default function ActionButtons() {
  const resetAll = useRecipeStore((s) => s.resetAll);
  const checkAll = useRecipeStore((s) => s.checkAll);

  return (
    <div className="btn-row">
      <button className="abtn" onClick={() => { if (confirm('Reset all recipes to unchecked?')) resetAll(); }}>
        Reset All
      </button>
      <button className="abtn dng" onClick={() => { if (confirm('Mark ALL recipes as completed?')) checkAll(); }}>
        Complete All
      </button>
    </div>
  );
}
