import { useMemo } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { MUSEUM_ITEMS } from '../data/museum';
import { useProfession } from '../context/ProfessionContext';
import {
  createProfessionPricePredicate,
  getPriceDisplay,
} from '../utils/professionPricing';
import PriceWithTooltip from '../components/PriceWithTooltip';
import {
  CollectionHeader, CollectionControls, SectionHeader,
  CollectionItem, Checkmark, useFilteredItems,
} from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'type', label: 'By Type' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'alpha_desc', label: 'Z-A' },
  { value: 'source', label: 'By Source' },
];


export default function MuseumPage() {
  useCollectionSync();
  const museumChecked = useCollectionStore((s) => s.museumChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const viewModes = useCollectionStore((s) => s.viewModes);
  const sort = sortModes['museum'] || 'type';
  const viewMode = viewModes['museum'] || 'list';
  const { selection, priceFilterMode } = useProfession();
  const professionPredicate = useMemo(
    () => createProfessionPricePredicate(
      priceFilterMode,
      (item) => getPriceDisplay(item.price ?? 0, item, selection),
    ),
    [priceFilterMode, selection],
  );

  const done = Object.keys(museumChecked).length;
  const total = MUSEUM_ITEMS.length;

  const filtered = useFilteredItems(
    MUSEUM_ITEMS, 'museum', 'museumChecked',
    (m) => m.name,
    (m) => `${m.name} ${m.source} ${m.altSources || ''} ${m.category}`,
    { extraPredicate: professionPredicate },
  );

  const grouped = useMemo(() => {
    let sorted = [...filtered];
    if (sort === 'alpha' || sort === 'alpha_desc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === 'alpha_desc') sorted.reverse();
      return [['All Items', sorted]];
    }
    if (sort === 'source') {
      sorted.sort((a, b) => a.source.localeCompare(b.source));
      return [['All Items', sorted]];
    }
    // By type
    const artifacts = sorted.filter((m) => m.category === 'Artifact');
    const minerals = sorted.filter((m) => m.category === 'Mineral');
    const groups = [];
    if (artifacts.length > 0) groups.push(['Artifacts', artifacts]);
    if (minerals.length > 0) groups.push(['Minerals', minerals]);
    return groups;
  }, [filtered, sort]);

  return (
    <div className="container">
      <CollectionHeader title="Museum Collection" done={done} total={total} colorClass="museum-progress" icon="🏛️" />
      <CollectionControls
        page="museum"
        sortOptions={SORT_OPTIONS}
        done={done}
        total={total}
        enableViewToggle={true}
        defaultViewMode="list"
        showExpandCollapse={true}
        collapsePrefix="museum:"
      />
      <div className="panel">
        {grouped.map(([group, items]) => {
          const groupDone = items.filter((m) => museumChecked[m.name]).length;
          return (
            <div key={group}>
              <SectionHeader
                sectionKey={`museum:${group}`}
                label={group}
                done={groupDone}
                total={items.length}
                defaultOpen={true}
              />
              <SectionItems
                items={items}
                museumChecked={museumChecked}
                toggleItem={toggleItem}
                sectionKey={`museum:${group}`}
                professionSelection={selection}
                viewMode={viewMode}
              />
            </div>
          );
        })}
        {grouped.length === 0 && <div className="empty">No items match your filters</div>}
      </div>
    </div>
  );
}

function SectionItems({ items, museumChecked, toggleItem, sectionKey, professionSelection, viewMode }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  if (viewMode === 'table') {
    return (
      <table className="fish-grid-tbl">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Source</th>
            <th>Category</th>
            <th>Sell</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.name}
              className={museumChecked[item.name] ? 'chk' : ''}
              onClick={() => toggleItem('museumChecked', item.name)}
              style={{ cursor: 'pointer' }}
            >
              <td><div className={`fish-grid-check${museumChecked[item.name] ? ' checked' : ''}`}><Checkmark /></div></td>
              <td className="fish-grid-name">{item.name}</td>
              <td>{item.source}</td>
              <td>{item.category}</td>
              <td>{item.price ? <PriceWithTooltip value={item.price} item={item} selection={professionSelection} className="fish-price" /> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return items.map((item) => {
    return (
    <CollectionItem
      key={item.name}
      checked={!!museumChecked[item.name]}
      onClick={() => toggleItem('museumChecked', item.name)}
      name={item.name}
      extra={
        item.price ? (
          <PriceWithTooltip
            value={item.price}
            item={item}
            selection={professionSelection}
            className="fish-price"
          />
        ) : null
      }
      meta={
        <>
          <span className="cc-item-source">{item.source}</span>
          {item.altSources && <span className="cc-item-source">Also: {item.altSources}</span>}
        </>
      }
      detail={item.tip}
    />
    );
  });
}
