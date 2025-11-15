import React from 'react';

export default function FilterBar({
  inStock,
  onToggleInStock,
  onReset,
  collections = [],
  activeCollections = new Set(),
  onToggleCollection,
  sortOrder = 'none',
  onToggleSort,
}) {
  return (
    <div className="filter-bar">
      <button
        type="button"
        className={`filter-button ${!inStock && activeCollections.size === 0 ? 'active' : ''}`}
        onClick={() => onReset()}
      >
        All
      </button>

      <button
        type="button"
        className={`filter-button ${inStock ? 'active' : ''}`}
        onClick={() => onToggleInStock((prev) => !prev)}
      >
        In stock
      </button>

      {/* Price sort toggle: cycles none -> asc -> desc -> none */}
      <button
        type="button"
        className={`filter-button ${sortOrder !== 'none' ? 'active' : ''}`}
        onClick={() => onToggleSort && onToggleSort()}
        aria-pressed={sortOrder !== 'none'}
        title={sortOrder === 'none' ? 'Sort by price' : sortOrder === 'asc' ? 'Sorted: low → high (click to reverse)' : 'Sorted: high → low (click to reverse)'}
      >
        {sortOrder === 'none' ? 'Sort by price' : sortOrder === 'asc' ? 'Price: Low → High' : 'Price: High → Low'}
      </button>

      {/* Collection toggles (multi-select) */}
      {collections.map((c) => (
        <button
          key={c.handle}
          type="button"
          className={`filter-button ${activeCollections.has(c.handle) ? 'active' : ''}`}
          onClick={() => onToggleCollection(c.handle)}
        >
          {c.title}
        </button>
      ))}

      {/* Clear all filters (aligned to the far right) */}
      <button
        type="button"
        className={`filter-button clear`}
        onClick={() => onReset()}
      >
        Clear filters
      </button>
    </div>
  );
}
