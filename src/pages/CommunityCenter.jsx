import { useMemo } from 'react';
import { useBundleStore } from '../hooks/useBundleStore';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useBundleSync } from '../hooks/useBundleSync';
import { ROOMS, SEASONS, CATEGORIES, QUALITY_LABELS, QUALITY_COLORS } from '../data/bundles';
import { useIsMobile } from '../hooks/useMediaQuery';

const ROOM_COMPLETION_REWARDS = {
  crafts: 'Bridge Repair to the Quarry',
  pantry: 'Greenhouse',
  fish_tank: 'Glittering Boulder removed (Panning unlocked)',
  boiler: 'Minecarts repaired',
  bulletin: 'Friendship boost with all villagers',
  vault: 'Bus Repair (Calico Desert access)',
};

function RoomTabs() {
  const activeRoom = useBundleStore((s) => s.activeRoom);
  const setActiveRoom = useBundleStore((s) => s.setActiveRoom);
  const roomTabs = [{ key: 'all', name: 'All Rooms', color: '#8d6e63' }, ...ROOMS];

  return (
    <div className="cc-room-tabs">
      {roomTabs.map((room) => (
        <button
          key={room.key}
          className={`cc-room-tab${activeRoom === room.key ? ' active' : ''}`}
          onClick={() => setActiveRoom(room.key)}
          title={room.key === 'all' ? 'Show all Community Center rooms' : `Room reward: ${ROOM_COMPLETION_REWARDS[room.key] || 'Special unlock'}`}
          style={{
            '--room-color': room.color,
            '--room-color-bg': room.color + '18',
          }}
        >
          <span className="cc-room-name">{room.name}</span>
          <RoomBadge room={room} />
        </button>
      ))}
    </div>
  );
}

function RoomBadge({ room }) {
  const getRoomProgress = useBundleStore((s) => s.getRoomProgress);
  let completed = 0;
  let total = 0;
  if (room.key === 'all') {
    ROOMS.forEach((r) => {
      const p = getRoomProgress(r);
      completed += p.completed;
      total += p.total;
    });
  } else {
    const p = getRoomProgress(room);
    completed = p.completed;
    total = p.total;
  }
  const done = completed === total;
  return (
    <span className={`cc-badge${done ? ' cc-badge-done' : ''}`}>
      {completed}/{total}
    </span>
  );
}

function Filters({
  viewMode,
  setViewMode,
  handleSetAllCollapsed,
}) {
  const seasonFilter = useBundleStore((s) => s.seasonFilter);
  const categoryFilter = useBundleStore((s) => s.categoryFilter);
  const bundleSearch = useBundleStore((s) => s.bundleSearch);
  const setSeasonFilter = useBundleStore((s) => s.setSeasonFilter);
  const setCategoryFilter = useBundleStore((s) => s.setCategoryFilter);
  const setBundleSearch = useBundleStore((s) => s.setBundleSearch);

  return (
    <div className="cc-filters">
      <div className="cc-search-wrap">
        <input
          type="text"
          className="cc-search"
          placeholder="Search items..."
          value={bundleSearch}
          onChange={(e) => setBundleSearch(e.target.value)}
        />
      </div>
      <div className="cc-filter-row">
        <select
          className="cc-select"
          value={seasonFilter}
          onChange={(e) => setSeasonFilter(e.target.value)}
        >
          <option value="all">All Seasons</option>
          {SEASONS.filter((s) => s !== 'Any').map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="cc-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div className="view-wrap cc-view-wrap">
          <button className={`view-btn${viewMode === 'table' ? ' active' : ''}`} onClick={() => setViewMode('table')}>
            Table
          </button>
          <button className={`view-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')}>
            List
          </button>
          {viewMode === 'list' && (
            <>
              <button className="view-btn" onClick={() => handleSetAllCollapsed(false)}>Expand all</button>
              <button className="view-btn" onClick={() => handleSetAllCollapsed(true)}>Collapse all</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BundleCard({ room, bundle, viewMode }) {
  const bundleChecked = useCollectionStore((s) => s.bundleChecked);
  const toggleBundleItem = useBundleStore((s) => s.toggleBundleItem);
  const setBundleItemsChecked = useBundleStore((s) => s.setBundleItemsChecked);
  const collapsedBundles = useBundleStore((s) => s.collapsedBundles);
  const toggleBundleCollapse = useBundleStore((s) => s.toggleBundleCollapse);
  const seasonFilter = useBundleStore((s) => s.seasonFilter);
  const categoryFilter = useBundleStore((s) => s.categoryFilter);
  const bundleSearch = useBundleStore((s) => s.bundleSearch);
  const isMobile = useIsMobile();

  const collapseKey = `${room.key}:${bundle.name}`;
  const isCollapsed = collapsedBundles[collapseKey] ?? false;

  const needed = bundle.pick || bundle.slots;
  const doneCount = bundle.items.filter(
    (item) => !!bundleChecked[`${room.key}:${bundle.name}:${item[0]}`]
  ).length;
  const bundleComplete = doneCount >= needed;

  // Filter items
  const filteredItems = useMemo(() => {
    const q = bundleSearch.toLowerCase().trim();
    return bundle.items.filter((item) => {
      if (seasonFilter !== 'all' && !item[3].includes(seasonFilter) && !item[3].includes('Any')) {
        return false;
      }
      if (categoryFilter !== 'all' && item[5] !== categoryFilter) {
        return false;
      }
      if (q && !item[0].toLowerCase().includes(q) && !item[4].toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [bundle.items, seasonFilter, categoryFilter, bundleSearch]);

  // Hide bundle if no items match filters
  if (filteredItems.length === 0) return null;

  return (
    <div className={`cc-bundle${bundleComplete ? ' cc-bundle-done' : ''}`}>
      <div
        className={`cc-bundle-hdr${viewMode === 'table' ? ' cc-bundle-hdr-grid' : ''}`}
        onClick={() => toggleBundleCollapse(room.key, bundle.name, false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleBundleCollapse(room.key, bundle.name, false);
          }
        }}
      >
        <span className={`chevron ${isCollapsed ? '' : 'chevron-open'}`}>&#9654;</span>
        <button
          className={`cc-inline-check${bundleComplete ? ' active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setBundleItemsChecked(room.key, bundle.name, bundle.items, !bundleComplete);
          }}
          title={bundleComplete ? 'Uncheck entire bundle' : 'Check entire bundle'}
          aria-label={bundleComplete ? 'Uncheck entire bundle' : 'Check entire bundle'}
        >
          <span className={`fish-grid-check${bundleComplete ? ' checked' : ''}`}>
            <svg className="ck" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </button>
        <span className="cc-bundle-name">{bundle.name}</span>
        <span className="cc-bundle-meta">
          {bundle.reward && <span className="cc-bundle-reward-pill">{bundle.reward}</span>}
          <span className="cc-bundle-progress">
            {doneCount}/{needed}
            {bundle.pick && <span className="cc-pick-label"> (pick {bundle.pick})</span>}
          </span>
        </span>
      </div>
      {!isCollapsed && (
        <div className="cc-bundle-items">
          {viewMode === 'table' ? (
            <table className="fish-grid-tbl cc-grid-tbl">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Season</th>
                  <th>Qty</th>
                  <th>Quality</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, idx) => {
                  const itemKey = `${room.key}:${bundle.name}:${item[0]}`;
                  const checked = !!bundleChecked[itemKey];
                  return (
                    <tr
                      key={idx}
                      className={checked ? 'chk' : ''}
                      onClick={() => toggleBundleItem(room.key, bundle.name, item[0])}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className={`fish-grid-check${checked ? ' checked' : ''}`}>
                          <svg className="ck" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </td>
                      <td className="fish-grid-name">{item[0]}</td>
                      <td>{item[4]}</td>
                      <td>
                        <span className="cc-item-seasons">
                          {item[3].map((s) => (
                            <span key={s} className={`cc-season cc-season-${s.toLowerCase()}`}>{s}</span>
                          ))}
                        </span>
                      </td>
                      <td>{item[1]}</td>
                      <td>{item[2] > 0 ? <span style={{ color: QUALITY_COLORS[item[2]] }}>{QUALITY_LABELS[item[2]]}</span> : 'Any'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            filteredItems.map((item, idx) => {
              const itemKey = `${room.key}:${bundle.name}:${item[0]}`;
              const checked = !!bundleChecked[itemKey];
              return (
                <div
                  key={idx}
                  className={`cc-item${checked ? ' cc-item-done' : ''}`}
                  onClick={() => toggleBundleItem(room.key, bundle.name, item[0])}
                >
                  <div className="cc-item-check">
                    <svg className="ck" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="cc-item-info">
                    <div className="cc-item-top">
                      <span className="cc-item-name">{item[0]}</span>
                      {item[1] > 1 && <span className="cc-item-qty">x{item[1]}</span>}
                      {item[2] > 0 && (
                        <span className="cc-item-quality" style={{ color: QUALITY_COLORS[item[2]] }}>
                          {QUALITY_LABELS[item[2]]}
                        </span>
                      )}
                    </div>
                    <div className="cc-item-meta">
                      <span className="cc-item-source">{item[4]}</span>
                      <span className="cc-item-seasons">
                        {item[3].map((s) => (
                          <span key={s} className={`cc-season cc-season-${s.toLowerCase()}`}>{s}</span>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function OverallProgress() {
  const getRoomProgress = useBundleStore((s) => s.getRoomProgress);
  let totalBundles = 0;
  let completedBundles = 0;
  ROOMS.forEach((room) => {
    const p = getRoomProgress(room);
    totalBundles += p.total;
    completedBundles += p.completed;
  });
  const pct = totalBundles > 0 ? Math.round((completedBundles / totalBundles) * 100) : 0;

  return (
    <header className="header">
      <h1>Community Center</h1>
      <p className="subtitle">{completedBundles} of {totalBundles} bundles completed</p>
      <div className="progress-wrap">
        <div className="progress-bar cc-progress" style={{ width: `${pct}%` }} />
        <div className="progress-text">{completedBundles} / {totalBundles} — {pct}%</div>
      </div>
    </header>
  );
}

export default function CommunityCenter() {
  useBundleSync();
  const activeRoom = useBundleStore((s) => s.activeRoom);
  const viewMode = useBundleStore((s) => s.viewMode);
  const setViewMode = useBundleStore((s) => s.setViewMode);
  const setAllBundlesCollapsed = useBundleStore((s) => s.setAllBundlesCollapsed);
  const setBundleItemsChecked = useBundleStore((s) => s.setBundleItemsChecked);
  const getRoomProgress = useBundleStore((s) => s.getRoomProgress);
  const room = ROOMS.find((r) => r.key === activeRoom) || ROOMS[0];
  const showingAllRooms = activeRoom === 'all';
  const roomsToRender = showingAllRooms ? ROOMS : [room];
  const handleSetAllCollapsed = (collapsed) => {
    if (showingAllRooms) {
      ROOMS.forEach((r) => {
        setAllBundlesCollapsed(r.key, r.bundles.map((b) => b.name), collapsed);
      });
      return;
    }
    setAllBundlesCollapsed(room.key, room.bundles.map((b) => b.name), collapsed);
  };

  return (
    <div className="container">
      <OverallProgress />
      <RoomTabs />
      <Filters
        viewMode={viewMode}
        setViewMode={setViewMode}
        handleSetAllCollapsed={handleSetAllCollapsed}
      />
      <div className="panel cc-panel">
        {roomsToRender.map((r) => (
          <div key={r.key} className="cc-room-section">
            {showingAllRooms && (() => {
              const progress = getRoomProgress(r);
              const roomComplete = progress.completed === progress.total;
              return (
                <div className="cc-room-section-hdr" style={{ '--room-color': r.color }}>
                  <span className="cc-room-section-name-wrap">
                    <button
                      className={`cc-inline-check cc-room-inline-check${roomComplete ? ' active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const shouldCheck = !roomComplete;
                        r.bundles.forEach((bundle) => {
                          setBundleItemsChecked(r.key, bundle.name, bundle.items, shouldCheck);
                        });
                      }}
                      title={roomComplete ? 'Uncheck room' : 'Check room'}
                      aria-label={roomComplete ? 'Uncheck room' : 'Check room'}
                    >
                      <span className={`fish-grid-check${roomComplete ? ' checked' : ''}`}>
                        <svg className="ck" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </button>
                    <span className="cc-room-section-name">{r.name}</span>
                  </span>
                  <span className="cc-room-section-meta">
                    <span className="cc-room-section-reward">{ROOM_COMPLETION_REWARDS[r.key] || 'Special unlock'}</span>
                  </span>
                </div>
              );
            })()}
            {r.bundles.map((bundle) => (
              <BundleCard key={`${r.key}:${bundle.name}`} room={r} bundle={bundle} viewMode={viewMode} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
