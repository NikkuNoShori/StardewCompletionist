import { useMemo } from 'react';
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
  { value: 'category', label: 'By Category' },
  { value: 'season', label: 'By Season' },
  { value: 'location', label: 'By Location' },
  { value: 'difficulty', label: 'By Difficulty' },
];

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
  const sort = sortModes['fish'] || 'category';
  const { selection, priceFilterMode } = useProfession();
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
    if (sort === 'alpha') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'difficulty') sorted.sort((a, b) => b.difficulty - a.difficulty);
    else if (sort === 'location') sorted.sort((a, b) => a.location.localeCompare(b.location));

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
  }, [filtered, sort]);

  return (
    <div className="container">
      <CollectionHeader title="Fish Collection" done={done} total={total} colorClass="fish-progress" />
      <CollectionControls page="fish" sortOptions={SORT_OPTIONS} done={done} total={total} />
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
              />
            </div>
          );
        })}
        {grouped.length === 0 && <div className="empty">No fish match your filters</div>}
      </div>
    </div>
  );
}

function SectionItems({ items, fishChecked, toggleItem, sectionKey, professionSelection }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  return (
    <table className="fish-grid-tbl">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Source</th>
          <th>Season</th>
          <th>Time</th>
          <th>Weather</th>
          <th>Difficulty</th>
          <th>Sell</th>
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
