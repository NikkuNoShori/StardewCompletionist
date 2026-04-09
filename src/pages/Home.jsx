import { useEffect } from 'react';
import { useRecipeStore } from '../hooks/useRecipeStore';
import { useSupabaseSync } from '../hooks/useSupabaseSync';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import FilterBar from '../components/FilterBar';
import ControlsBar from '../components/ControlsBar';
import RecipeList from '../components/RecipeList';
import IngredientTable from '../components/IngredientTable';
import ActionButtons from '../components/ActionButtons';

export default function Home() {
  useSupabaseSync();
  const currentTab = useRecipeStore((s) => s.currentTab);
  const setTab = useRecipeStore((s) => s.setTab);
  const setFilter = useRecipeStore((s) => s.setFilter);

  useEffect(() => {
    setFilter('all');
    if (currentTab === 'wiki') setTab('recipes');
  }, [setFilter, currentTab, setTab]);

  return (
    <>
      <div className="container">
        <Header />
        <div className="tab-bar-top">
          <TabBar />
        </div>
        <div className="controls-bar collection-controls-one-line">
          <FilterBar inline />
          <ControlsBar inline />
        </div>
        <div className="panel">
          {currentTab === 'recipes' && <RecipeList />}
          {currentTab === 'ingredients' && <IngredientTable />}
        </div>
        <ActionButtons />
      </div>
      {/* Mobile: fixed bottom tab bar — outside container to avoid clipping */}
      <div className="tab-bar-bottom">
        <TabBar />
      </div>
    </>
  );
}
