import React from 'react';

export default function FilterBar({
  inStock,
  onToggleInStock,
  onReset,
  collections = [],
  activeCollections = new Set(),
  onToggleCollection,
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
    </div>
  );
}
