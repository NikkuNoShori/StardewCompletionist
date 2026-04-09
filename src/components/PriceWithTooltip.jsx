import { getPriceDisplay } from '../utils/professionPricing';

function formatMultiplier(multiplier) {
  return `x${multiplier.toFixed(2)}`;
}

export default function PriceWithTooltip({ value, item, selection, className = 'fish-price' }) {
  const priceMeta = getPriceDisplay(value, item, selection);
  if (priceMeta.basePrice <= 0) return <span className={className}>—</span>;

  const delta = priceMeta.adjustedPrice - priceMeta.basePrice;
  const deltaPrefix = delta >= 0 ? '+' : '';

  return (
    <span className={`price-tip-wrap ${className}`}>
      {priceMeta.adjustedLabel}
      <span className="price-tip">
        <strong>Price breakdown</strong>
        <span>Base: {priceMeta.baseLabel}</span>
        {priceMeta.reasons.length > 0 ? (
          priceMeta.reasons.map((reason) => (
            <span key={reason}>{reason}</span>
          ))
        ) : (
          <span>No active profession bonus</span>
        )}
        <span>Multiplier: {formatMultiplier(priceMeta.multiplier)}</span>
        <span className="price-tip-delta">Final: {priceMeta.adjustedLabel} ({deltaPrefix}{delta}g)</span>
      </span>
    </span>
  );
}
