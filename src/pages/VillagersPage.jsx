import { useMemo, useState, useCallback } from 'react';
import { VILLAGERS, UNIVERSAL_GIFTS } from '../data/villagers';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { CollectionHeader } from '../components/CollectionPage';

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
const SEASON_CLASS = {
  Spring: 'cc-season-spring',
  Summer: 'cc-season-summer',
  Fall: 'cc-season-fall',
  Winter: 'cc-season-winter',
};

// ─── Gift preference chips ───
function GiftList({ label, items, kind }) {
  if (!items.length) return null;
  return (
    <div className={`vil-gifts vil-gifts-${kind}`}>
      <span className="vil-gifts-label">{label}</span>
      <span className="vil-gifts-items">
        {items.map((g) => (
          <span key={g} className="vil-gift-chip">{g}</span>
        ))}
      </span>
    </div>
  );
}

// ─── Full gift breakdown: primary tiers always, the rest behind a toggle ───
function GiftSections({ villager }) {
  const [showAll, setShowAll] = useState(false);
  const { loved, liked, neutral, disliked, hated } = villager;
  const hasExtra = neutral.length > 0 || disliked.length > 0;
  return (
    <>
      <GiftList label="Loved" items={loved} kind="loved" />
      <GiftList label="Liked" items={liked} kind="liked" />
      <GiftList label="Hated" items={hated} kind="hated" />
      {showAll && (
        <>
          <GiftList label="Disliked" items={disliked} kind="disliked" />
          <GiftList label="Neutral" items={neutral} kind="neutral" />
        </>
      )}
      {hasExtra && (
        <button type="button" className="vil-showall" onClick={() => setShowAll((s) => !s)}>
          {showAll ? 'Show less' : 'Show neutral & disliked'}
        </button>
      )}
    </>
  );
}

// ─── Universal gift tastes reference (applies to everyone) ───
function UniversalsPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="vil-universals">
      <button
        type="button"
        className="vil-universals-hdr"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={`chevron ${open ? 'chevron-open' : ''}`}>&#9654;</span>
        Universal Gift Tastes
        <span className="vil-universals-note">apply to everyone unless a villager overrides them</span>
      </button>
      {open && (
        <div className="vil-universals-body">
          <GiftList label="Loved" items={UNIVERSAL_GIFTS.loved} kind="loved" />
          <GiftList label="Liked" items={UNIVERSAL_GIFTS.liked} kind="liked" />
          <GiftList label="Hated" items={UNIVERSAL_GIFTS.hated} kind="hated" />
          <GiftList label="Disliked" items={UNIVERSAL_GIFTS.disliked} kind="disliked" />
          <GiftList label="Neutral" items={UNIVERSAL_GIFTS.neutral} kind="neutral" />
        </div>
      )}
    </div>
  );
}

// ─── Single villager card ───
function VillagerCard({ villager, checked, onToggle }) {
  const [open, setOpen] = useState(false);
  const { name, birthday } = villager;
  return (
    <div className={`vil-card${checked ? ' vil-card-done' : ''}`}>
      <div className="vil-card-main">
        <label className="vil-check">
          <input type="checkbox" checked={checked} onChange={() => onToggle(name)} />
          <span className="vil-check-box" />
        </label>
        <div className="vil-card-info">
          <span className="vil-name">{name}</span>
          <span className={`cc-season ${SEASON_CLASS[birthday.season]} vil-bday`}>
            {birthday.season} {birthday.day}
          </span>
        </div>
        <button
          type="button"
          className="vil-gifts-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? 'Hide gifts' : 'Show gifts'}
        </button>
      </div>
      {open && (
        <div className="vil-card-gifts">
          <GiftSections villager={villager} />
        </div>
      )}
    </div>
  );
}

export default function VillagersPage() {
  useCollectionSync();
  const birthdayChecked = useCollectionStore((s) => s.birthdayChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);

  const [view, setView] = useState('list'); // 'list' | 'calendar'
  const [seasonFilter, setSeasonFilter] = useState('all'); // 'all' | season
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null); // villager shown in calendar popup

  const onToggle = useCallback((name) => toggleItem('birthdayChecked', name), [toggleItem]);

  const done = Object.keys(birthdayChecked).length;
  const total = VILLAGERS.length;

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return VILLAGERS.filter((v) => {
      if (seasonFilter !== 'all' && v.birthday.season !== seasonFilter) return false;
      if (q) {
        const hay = `${v.name} ${v.loved.join(' ')} ${v.liked.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, seasonFilter]);

  // Group by season for both views
  const bySeason = useMemo(() => {
    const groups = {};
    SEASONS.forEach((s) => { groups[s] = []; });
    filtered.forEach((v) => groups[v.birthday.season].push(v));
    SEASONS.forEach((s) => groups[s].sort((a, b) => a.birthday.day - b.birthday.day));
    return groups;
  }, [filtered]);

  return (
    <div className="container">
      <CollectionHeader title="Villagers" done={done} total={total} colorClass="villager-progress" icon="🎂" />

      <UniversalsPanel />

      {/* Controls */}
      <div className="vil-controls">
        <div className="vil-view-toggle">
          <button className={`view-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>List</button>
          <button className={`view-btn${view === 'calendar' ? ' active' : ''}`} onClick={() => setView('calendar')}>Calendar</button>
        </div>
        <div className="vil-season-filters">
          <button className={`vil-season-pill${seasonFilter === 'all' ? ' active' : ''}`} onClick={() => setSeasonFilter('all')}>All</button>
          {SEASONS.map((s) => (
            <button
              key={s}
              className={`vil-season-pill ${SEASON_CLASS[s]}${seasonFilter === s ? ' active' : ''}`}
              onClick={() => setSeasonFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="vil-search"
          placeholder="Search name or gift..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {view === 'list' ? (
        <div className="panel vil-panel">
          {SEASONS.filter((s) => bySeason[s].length > 0).map((s) => (
            <div key={s} className="vil-season-group">
              <div className={`vil-season-hdr ${SEASON_CLASS[s]}`}>
                {s}
                <span className="vil-season-count">
                  {bySeason[s].filter((v) => birthdayChecked[v.name]).length}/{bySeason[s].length}
                </span>
              </div>
              {bySeason[s].map((v) => (
                <VillagerCard key={v.name} villager={v} checked={!!birthdayChecked[v.name]} onToggle={onToggle} />
              ))}
            </div>
          ))}
          {filtered.length === 0 && <div className="empty">No villagers match your filters</div>}
        </div>
      ) : (
        <div className="vil-calendar">
          {SEASONS.filter((s) => seasonFilter === 'all' || seasonFilter === s).map((s) => (
            <div key={s} className={`vil-cal-season ${SEASON_CLASS[s]}`}>
              <div className="vil-cal-season-title">{s}</div>
              <div className="vil-cal-grid">
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
                  const here = bySeason[s].filter((v) => v.birthday.day === day);
                  return (
                    <div key={day} className={`vil-cal-day${here.length ? ' vil-cal-day-bday' : ''}`}>
                      <span className="vil-cal-daynum">{day}</span>
                      {here.map((v) => (
                        <button
                          key={v.name}
                          type="button"
                          className={`vil-cal-npc${birthdayChecked[v.name] ? ' done' : ''}`}
                          onClick={() => setSelected(v)}
                          title={`${v.name} — click to view gifts`}
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <VillagerGiftPopup
          villager={selected}
          checked={!!birthdayChecked[selected.name]}
          onToggle={onToggle}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

// ─── Calendar popup: gift list + mark-given ───
function VillagerGiftPopup({ villager, checked, onToggle, onClose }) {
  const { name, birthday } = villager;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box vil-popup" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="vil-popup-hdr">
          <span className="vil-name">{name}</span>
          <span className={`cc-season ${SEASON_CLASS[birthday.season]} vil-bday`}>
            {birthday.season} {birthday.day}
          </span>
        </div>
        <div className="vil-popup-gifts">
          <GiftSections villager={villager} />
        </div>
        <button
          type="button"
          className={`vil-popup-btn${checked ? ' done' : ''}`}
          onClick={() => onToggle(name)}
        >
          {checked ? '✓ Gift given — click to undo' : 'Mark gift given'}
        </button>
      </div>
    </div>
  );
}
