import { getActiveProfessionIds } from '../data/professions';

export const PROFESSION_PRICE_FILTERS = {
  all: 'all',
  affected: 'affectedByProfession',
  bonus: 'hasPriceBonus',
  unchanged: 'unchanged',
};

export function parsePriceValue(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const match = value.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export function formatPrice(value) {
  if (!Number.isFinite(value)) return '—';
  return `${Math.round(value)}g`;
}

function inferTags(item = {}) {
  const tags = new Set(item.priceTags || []);
  const category = (item.category || '').toLowerCase();
  const name = (item.name || '').toLowerCase();

  if (category === 'fish') tags.add('fish');
  if (category === 'animal product') tags.add('animal_product');
  if (category === 'crop') tags.add('crop');
  if (category === 'artisan good') tags.add('artisan_good');
  if (category === 'mineral' || item.subCategory === 'Gem') tags.add('mineral');
  if (item.subCategory === 'Gem') tags.add('gem');
  if (name.includes('bar') || /bar$/i.test(item.name || '')) tags.add('bar');
  if (name.includes('syrup') || name.includes('resin') || name.includes('tar')) tags.add('syrup');
  if (name === 'oil') tags.add('oil_basic');

  return tags;
}

function hasTag(tags, tag) {
  return tags.has(tag);
}

export function getAdjustedPrice(basePrice, item, professionSelection) {
  const active = getActiveProfessionIds(professionSelection);
  const tags = inferTags(item);
  const reasons = [];
  let multiplier = 1;

  if (active.has('angler') && hasTag(tags, 'fish')) {
    multiplier *= 1.5;
    reasons.push('Angler +50% fish value');
  } else if (active.has('fisher') && hasTag(tags, 'fish')) {
    multiplier *= 1.25;
    reasons.push('Fisher +25% fish value');
  }

  if (active.has('artisan') && hasTag(tags, 'artisan_good') && !hasTag(tags, 'oil_basic')) {
    multiplier *= 1.4;
    reasons.push('Artisan +40% artisan good value');
  }

  if (active.has('rancher') && hasTag(tags, 'animal_product')) {
    multiplier *= 1.2;
    reasons.push('Rancher +20% animal product value');
  }

  if (active.has('tiller') && hasTag(tags, 'crop')) {
    multiplier *= 1.1;
    reasons.push('Tiller +10% crop value');
  }

  if (active.has('blacksmith') && hasTag(tags, 'bar')) {
    multiplier *= 1.5;
    reasons.push('Blacksmith +50% metal bar value');
  }

  if (active.has('gemologist') && (hasTag(tags, 'gem') || hasTag(tags, 'mineral'))) {
    multiplier *= 1.3;
    reasons.push('Gemologist +30% minerals and gems');
  }

  if (active.has('tapper') && hasTag(tags, 'syrup')) {
    multiplier *= 1.25;
    reasons.push('Tapper +25% syrups');
  }

  const adjustedPrice = Math.round(basePrice * multiplier);
  return {
    basePrice,
    adjustedPrice,
    multiplier,
    changed: adjustedPrice !== basePrice,
    reasons,
  };
}

export function getPriceDisplay(value, item, professionSelection) {
  const basePrice = parsePriceValue(value);
  const adjustment = getAdjustedPrice(basePrice, item, professionSelection);
  return {
    ...adjustment,
    baseLabel: formatPrice(adjustment.basePrice),
    adjustedLabel: formatPrice(adjustment.adjustedPrice),
  };
}

export function createProfessionPricePredicate(mode, getPriceMeta) {
  if (!mode || mode === PROFESSION_PRICE_FILTERS.all) return null;

  return (item) => {
    const priceMeta = getPriceMeta(item);
    if (!priceMeta) return true;
    if (mode === PROFESSION_PRICE_FILTERS.affected) return priceMeta.reasons.length > 0;
    if (mode === PROFESSION_PRICE_FILTERS.bonus) return priceMeta.changed;
    if (mode === PROFESSION_PRICE_FILTERS.unchanged) return !priceMeta.changed;
    return true;
  };
}
