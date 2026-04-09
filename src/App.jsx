import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfessionProvider } from './context/ProfessionContext';
import ProfessionConfigurator from './components/ProfessionConfigurator';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import CommunityCenter from './pages/CommunityCenter';
import FishPage from './pages/FishPage';
import MuseumPage from './pages/MuseumPage';
import ShippingPage from './pages/ShippingPage';
import CraftingPage from './pages/CraftingPage';
import IslandPage from './pages/IslandPage';
import MiscPage from './pages/MiscPage';
import SpawnCodesPage from './pages/SpawnCodesPage';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Hamburger button */}
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <span /><span /><span />
      </button>

      <ProfessionConfigurator />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cooking" element={<Home />} />
          <Route path="/community-center" element={<CommunityCenter />} />
          <Route path="/fish" element={<FishPage />} />
          <Route path="/museum" element={<MuseumPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/crafting" element={<CraftingPage />} />
          <Route path="/island" element={<IslandPage />} />
          <Route path="/misc" element={<MiscPage />} />
          <Route path="/spawn-codes" element={<SpawnCodesPage />} />
        </Routes>
        <footer className="app-disclaimer">
          This fan-made app references data and community content from the
          {' '}
          <a href="https://stardewvalleywiki.com" target="_blank" rel="noreferrer">Stardew Valley Wiki</a>
          {' '}
          (licensed under
          {' '}
          <a href="https://stardewvalleywiki.com/Stardew_Valley_Wiki:Copyrights" target="_blank" rel="noreferrer">CC BY-NC-SA 3.0</a>
          ).
          Stardew Valley names, images, and game assets are property of ConcernedApe and respective licensors.
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProfessionProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </ProfessionProvider>
    </AuthProvider>
  );
}
