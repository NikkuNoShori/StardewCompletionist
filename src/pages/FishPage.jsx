import { useMemo, useCallback, useEffect } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { FISH, FISH_CATEGORIES } from '../data/fish';
import { useProfession } from '../context/ProfessionContext';
import {
  createProfessionPricePredicate,
  getPriceDisplay,
} from '../utils/professionPricing';
import PriceWithTooltip from '../components/PriceWithTooltip';
import {
  CollectionHeader, CollectionControls, SectionHeader,
  Checkmark, useFilteredItems,
} from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'alpha', label: 'A-Z' },
  { value: 'alpha_desc', label: 'Z-A' },
  { value: 'category', label: 'By Category' },
  { value: 'season', label: 'By Season' },
  { value: 'location', label: 'By Location' },
  { value: 'location_desc', label: 'By Location (Z-A)' },
  { value: 'weather', label: 'By Weather' },
  { value: 'weather_desc', label: 'By Weather (Z-A)' },
  { value: 'price', label: 'By Sell Price' },
  { value: 'price_asc', label: 'By Sell Price (Low-High)' },
  { value: 'difficulty', label: 'By Difficulty' },
  { value: 'difficulty_asc', label: 'By Difficulty (Easy-Hard)' },
];
const VALID_SORT_VALUES = new Set(SORT_OPTIONS.map((o) => o.value));

function DifficultyBadge({ difficulty }) {
  if (difficulty === 0) return null;
  let cls = 'diff-easy';
  if (difficulty > 85) cls = 'diff-extreme';
  else if (difficulty > 65) cls = 'diff-hard';
  else if (difficulty > 40) cls = 'diff-medium';
  return <span className={`fish-diff ${cls}`}>{difficulty}</span>;
}

function SeasonTags({ seasons }) {
  if (!seasons) return null;
  return (
    <span className="cc-item-seasons">
      {seasons.map((s) => (
        <span key={s} className={`cc-season cc-season-${s.toLowerCase()}`}>{s}</span>
      ))}
    </span>
  );
}

export default function FishPage() {
  useCollectionSync();
  const fishChecked = useCollectionStore((s) => s.fishChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const viewModes = useCollectionStore((s) => s.viewModes);
  const setSort = useCollectionStore((s) => s.setSort);
  const rawSort = sortModes['fish'] || 'category';
  const sort = VALID_SORT_VALUES.has(rawSort) ? rawSort : 'category';
  const viewMode = viewModes['fish'] || 'table';
  const { selection, priceFilterMode } = useProfession();

  useEffect(() => {
    if (rawSort !== sort) {
      setSort('fish', sort);
    }
  }, [rawSort, setSort, sort]);
  const professionPredicate = useMemo(
    () => createProfessionPricePredicate(
      priceFilterMode,
      (item) => getPriceDisplay(item.price, { ...item, priceTags: ['fish'] }, selection),
    ),
    [priceFilterMode, selection],
  );

  const done = Object.keys(fishChecked).length;
  const total = FISH.length;

  const filtered = useFilteredItems(
    FISH, 'fish', 'fishChecked',
    (f) => f.name,
    (f) => `${f.name} ${f.location} ${f.category} ${f.season?.join(' ') || ''}`,
    { extraPredicate: professionPredicate },
  );

  const grouped = useMemo(() => {
    let sorted = [...filtered];
    if (sort === 'alpha' || sort === 'alpha_desc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === 'alpha_desc') sorted.reverse();
    } else if (sort === 'difficulty' || sort === 'difficulty_asc') {
      sorted.sort((a, b) => a.difficulty - b.difficulty);
      if (sort === 'difficulty') sorted.reverse();
    } else if (sort === 'location' || sort === 'location_desc') {
      sorted.sort((a, b) => a.location.localeCompare(b.location));
      if (sort === 'location_desc') sorted.reverse();
    } else if (sort === 'weather' || sort === 'weather_desc') {
      sorted.sort((a, b) => a.weather.localeCompare(b.weather));
      if (sort === 'weather_desc') sorted.reverse();
    } else if (sort === 'price' || sort === 'price_asc') {
      sorted.sort((a, b) => {
        const pa = getPriceDisplay(a.price, { ...a, priceTags: ['fish'] }, selection);
        const pb = getPriceDisplay(b.price, { ...b, priceTags: ['fish'] }, selection);
        return pa.adjustedPrice - pb.adjustedPrice;
      });
      if (sort === 'price') sorted.reverse();
    }

    if (sort === 'category') {
      const groups = {};
      FISH_CATEGORIES.forEach((cat) => { groups[cat] = []; });
      sorted.forEach((f) => {
        if (groups[f.category]) groups[f.category].push(f);
      });
      return Object.entries(groups).filter(([, items]) => items.length > 0);
    }

    if (sort === 'season') {
      const groups = { Spring: [], Summer: [], Fall: [], Winter: [], Any: [] };
      sorted.forEach((f) => {
        const seasons = f.season || ['Any'];
        seasons.forEach((s) => {
          if (groups[s]) groups[s].push(f);
          else if (groups['Any']) groups['Any'].push(f);
        });
      });
      return Object.entries(groups).filter(([, items]) => items.length > 0);
    }

    return [['All Fish', sorted]];
  }, [filtered, sort, selection]);

  const toggleSortMode = useCallback((ascMode, descMode = null) => {
    const nextDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) {
      setSort('fish', nextDescMode);
      return;
    }
    if (sort === nextDescMode) {
      setSort('fish', ascMode);
      return;
    }
    setSort('fish', ascMode);
  }, [setSort, sort]);

  const sortArrow = useCallback((ascMode, descMode = null) => {
    const activeDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) return ' \u2191';
    if (sort === activeDescMode) return ' \u2193';
    return ' \u21D5';
  }, [sort]);

  return (
    <div className="container">
      <CollectionHeader title="Fish Collection" done={done} total={total} colorClass="fish-progress" />
      <CollectionControls
        page="fish"
        sortOptions={SORT_OPTIONS}
        done={done}
        total={total}
        enableViewToggle={true}
        defaultViewMode="table"
        showExpandCollapse={true}
        collapsePrefix="fish:"
      />
      <div className="panel">
        {grouped.map(([group, items]) => {
          const groupDone = items.filter((f) => fishChecked[f.name]).length;
          return (
            <div key={group}>
              <SectionHeader
                sectionKey={`fish:${group}`}
                label={group}
                done={groupDone}
                total={items.length}
                defaultOpen={true}
              />
              <SectionItems
                items={items}
                fishChecked={fishChecked}
                toggleItem={toggleItem}
                sectionKey={`fish:${group}`}
                professionSelection={selection}
                onSortClick={toggleSortMode}
                sortArrow={sortArrow}
                viewMode={viewMode}
              />
            </div>
          );
        })}
        {grouped.length === 0 && <div className="empty">No fish match your filters</div>}
      </div>
    </div>
  );
}

function SectionItems({
  items,
  fishChecked,
  toggleItem,
  sectionKey,
  professionSelection,
  onSortClick,
  sortArrow,
  viewMode,
}) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  if (viewMode === 'list') {
    return items.map((fish) => (
      <div key={fish.name} className={`cc-item${fishChecked[fish.name] ? ' cc-item-done' : ''}`} onClick={() => toggleItem('fishChecked', fish.name)}>
        <div className="cc-item-check"><Checkmark /></div>
        <div className="cc-item-info">
          <div className="cc-item-top">
            <span className="cc-item-name">{fish.name}</span>
            <DifficultyBadge difficulty={fish.difficulty} />
          </div>
          <div className="cc-item-meta">
            <span className="cc-item-source">{fish.location}</span>
            <SeasonTags seasons={fish.season} />
            {fish.time !== 'Any' && <span className="cc-item-source">{fish.time}</span>}
            {fish.weather !== 'Any' ? <span className="fish-weather">{fish.weather}</span> : null}
            <PriceWithTooltip
              value={fish.price}
              item={{ ...fish, priceTags: ['fish'] }}
              selection={professionSelection}
              className="fish-price"
            />
          </div>
          {fish.note && <div className="cc-item-source" style={{ marginTop: 2 }}>{fish.note}</div>}
        </div>
      </div>
    ));
  }

  return (
    <table className="fish-grid-tbl">
      <thead>
        <tr>
          <th></th>
          <th className="fish-th-sort" onClick={() => onSortClick('alpha')}>
            Name{sortArrow('alpha')}
          </th>
          <th className="fish-th-sort" onClick={() => onSortClick('location')}>
            Source{sortArrow('location')}
          </th>
          <th>Season</th>
          <th>Time</th>
          <th className="fish-th-sort" onClick={() => onSortClick('weather')}>
            Weather{sortArrow('weather')}
          </th>
          <th className="fish-th-sort" onClick={() => onSortClick('difficulty', 'difficulty_asc')}>
            Difficulty{sortArrow('difficulty_asc', 'difficulty')}
          </th>
          <th className="fish-th-sort" onClick={() => onSortClick('price', 'price_asc')}>
            Sell{sortArrow('price_asc', 'price')}
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((fish) => (
          <tr
            key={fish.name}
            className={fishChecked[fish.name] ? 'chk' : ''}
            onClick={() => toggleItem('fishChecked', fish.name)}
            style={{ cursor: 'pointer' }}
          >
            <td>
              <div className={`fish-grid-check${fishChecked[fish.name] ? ' checked' : ''}`}>
                <Checkmark />
              </div>
            </td>
            <td className="fish-grid-name">{fish.name}</td>
            <td>{fish.location}</td>
            <td><SeasonTags seasons={fish.season} /></td>
            <td>{fish.time}</td>
            <td>{fish.weather !== 'Any' ? <span className="fish-weather">{fish.weather}</span> : 'Any'}</td>
            <td><DifficultyBadge difficulty={fish.difficulty} /></td>
            <td>
              <PriceWithTooltip
                value={fish.price}
                item={{ ...fish, priceTags: ['fish'] }}
                selection={professionSelection}
                className="fish-price"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
