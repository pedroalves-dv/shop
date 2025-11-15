/*
  Products listing page (pages/products.js)
  - What it is: displays all products in a responsive grid using ProductCard.
  - What it controls (CSS classes): .products-page, .products-header, .products-grid, .products-title
  - Notes: data is fetched in getStaticProps; change grid columns via --grid-columns or .products-grid.
*/
import axios from 'axios';
import { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';

export default function Products({ products }) {
  const [inStock, setInStock] = useState(false);
  const [activeCollections, setActiveCollections] = useState(new Set());
  const [sortOrder, setSortOrder] = useState('none'); // 'none' | 'asc' | 'desc'

  // derive list of collections present in products (unique)
  const collections = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      (p.collections || []).forEach((c) => {
        if (!map.has(c.handle)) map.set(c.handle, c);
      });
    });
    return Array.from(map.values());
  }, [products]);

  const filtered = useMemo(() => {
    let out = products;
    if (inStock) {
      out = out.filter((p) => p.variants.some((v) => v.quantityAvailable > 0));
    }
    if (activeCollections.size > 0) {
      out = out.filter((p) => (p.collections || []).some((c) => activeCollections.has(c.handle)));
    }

    // apply price sorting if requested
    if (sortOrder === 'none') return out;

    const withPrice = out.map((p) => {
      const prices = (p.variants || []).map((v) => {
        const n = parseFloat(v.price);
        return Number.isFinite(n) ? n : Infinity;
      });
      const price = prices.length ? Math.min(...prices) : Infinity;
      return { product: p, price };
    });

    withPrice.sort((a, b) => {
      if (a.price === b.price) return 0;
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });

    return withPrice.map((x) => x.product);
  }, [products, inStock, activeCollections, sortOrder]);

  function onToggleCollection(handle) {
    setActiveCollections((prev) => {
      const next = new Set(prev);
      if (next.has(handle)) next.delete(handle);
      else next.add(handle);
      return next;
    });
  }

  function onReset() {
    setInStock(false);
    setActiveCollections(new Set());
    setSortOrder('none');
  }


  function onToggleSort() {
    setSortOrder((prev) => (prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none'));
  }

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-header">
        <h1 className="products-title">All Products</h1>
        <p className="products-subtitle">Explore our full collection of thoughtfully designed products.</p>
      </div>

      {/* Filter bar */}
      <FilterBar
        inStock={inStock}
        onToggleInStock={setInStock}
        onReset={onReset}
        collections={collections}
        activeCollections={activeCollections}
        onToggleCollection={onToggleCollection}
        sortOrder={sortOrder}
        onToggleSort={onToggleSort}
      />

      {/* Product Grid */}
      <div className="responsive-grid products-grid">
        {filtered.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            priority={false}
          />
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const query = `
  {
    products(first: 20) {
      edges {
        node {
          id
          handle
          title
          collections(first: 10) {
            edges {
              node {
                id
                handle
                title
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                priceV2 {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
              }
            }
          }
        }
      }
    }
  }
  `;

  const response = await axios.post(
    `https://${domain}/api/2025-01/graphql.json`,
    { query },
    { headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' } }
  );

  const products = response.data.data.products.edges.map(edge => ({
    id: edge.node.id,
    handle: edge.node.handle,
    title: edge.node.title,
    image: edge.node.images?.edges?.[0]?.node?.url || null,
    imageAlt: edge.node.images?.edges?.[0]?.node?.altText || edge.node.title,
    collections: edge.node.collections?.edges?.map(c => ({ handle: c.node.handle, title: c.node.title })) || [],
    variants: edge.node.variants.edges.map(v => ({
      id: v.node.id,
      price: v.node.priceV2.amount,
      currency: v.node.priceV2.currencyCode,
      availableForSale: v.node.availableForSale,
      quantityAvailable: v.node.quantityAvailable
    }))
  }));

  return { props: { products } };
}
