import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useCollectionsContext } from '../context/CollectionsContext';
import { useRouter } from 'next/router';

export default function Header() {
  const { checkout, openCart } = useCart();
  const count = checkout?.lineItems?.edges?.reduce((s, e) => s + (e.node?.quantity || 0), 0) || 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  // Collections dropdown state (desktop)
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [collections, setCollections] = useState(null);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const collectionsRef = useRef(null);
  const collectionsToggleRef = useRef(null);
  const router = useRouter();

  // If pageProps provided collections via SSG, the CollectionsProvider will
  // expose them through context so the header can render instantly.
  const ctxCollections = useCollectionsContext();

  useEffect(() => {
    if (!collections && Array.isArray(ctxCollections) && ctxCollections.length > 0) {
      setCollections(ctxCollections);
      setCollectionsLoading(false);
    }
  }, [ctxCollections, collections]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleOutside(e) {
      const target = e.target;
      if (menuRef.current && !menuRef.current.contains(target) && toggleRef.current && !toggleRef.current.contains(target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [menuOpen]);

  // Close collections dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!collectionsOpen) return;

    function handleOutside(e) {
      const target = e.target;
      if (collectionsRef.current && !collectionsRef.current.contains(target) && collectionsToggleRef.current && !collectionsToggleRef.current.contains(target)) {
        setCollectionsOpen(false);
      }
    }

    function handleEsc(e) {
      if (e.key === 'Escape') setCollectionsOpen(false);
    }

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [collectionsOpen]);

  // Fetch collections lazily when the dropdown is opened for the first time
  async function fetchCollections() {
    if (collections || collectionsLoading) return;
    setCollectionsLoading(true);
    try {
      const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
      const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
      const query = `
      {
        collections(first: 20) {
          edges {
            node {
              handle
              title
              image { url altText }
            }
          }
        }
      }
      `;

      const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({ query }),
      });

      const payload = await res.json();
      const edges = payload?.data?.collections?.edges || [];
      const cols = edges.map(e => ({ handle: e.node.handle, title: e.node.title }));
      setCollections(cols);
    } catch (err) {
      console.error('Failed to fetch collections for header dropdown', err);
    } finally {
      setCollectionsLoading(false);
    }
  }
  
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Logo/Brand - Minimal wordmark */}
        {/* Desktop: normal link */}
        <Link href="/" className="hide-mobile brand-link">
          Atelier 3
        </Link>

        {/* Mobile: logo acts as a menu toggle (does not navigate) */}
        <button
          ref={toggleRef}
          className="hide-desktop mobile-logo-button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Atelier 3
        </button>

        {/* Mobile dropdown anchored to the left (logo) */}
        {menuOpen && (
          <div ref={menuRef} role="menu" aria-label="Site menu" className="mobile-menu">
            <Link href="/" role="menuitem" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/products" role="menuitem" onClick={() => setMenuOpen(false)}>All Products</Link>
            <Link href="/collections" role="menuitem" onClick={() => setMenuOpen(false)}>Collections</Link>
            <Link href="/contact" role="menuitem" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        )}

        {/* Navigation - Center */}
        <nav className="header-nav hide-mobile">
          <Link 
            href="/"
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          >
            Home
          </Link>
          <Link 
            href="/products"
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          >
            All Products
          </Link>
          {/* Collections: click once to open dropdown, second click closes it. */}
          <div className="collections-wrapper">
            <button
              type="button"
              ref={collectionsToggleRef}
              className="collections-toggle header-nav-link"
              aria-expanded={collectionsOpen}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onClick={async (e) => {
                e.preventDefault();
                if (!collectionsOpen) {
                  setCollectionsOpen(true);
                  await fetchCollections();
                } else {
                  setCollectionsOpen(false);
                }
              }}
            >
              Collections
            </button>

            {collectionsOpen && (
              <div ref={collectionsRef} className="collections-dropdown" role="menu" aria-label="Collections">
                {collectionsLoading && <div className="collections-loading">Loading...</div>}
                {!collectionsLoading && collections && (
                  <ul className="collections-dropdown-list">
                    <li role="none" className='all-collections-option'>
                      <Link href={`/collections`} role="menuitem" onClick={() => setCollectionsOpen(false)}>All collections</Link>
                    </li>
                    {collections.map((c) => (
                      <li key={c.handle} role="none">
                        <Link href={`/collections/${encodeURIComponent(c.handle)}`} role="menuitem" onClick={() => setCollectionsOpen(false)}>
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <Link 
            href="/contact"
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          >
            Contact
          </Link>
        </nav>

        {/* Cart Button - Responsive sizing. Wrapped in a container that reserves space to avoid layout shift when the count appears. */}
        <div className="cart-button-container">
          <button onClick={openCart} className="cart-button">
            <span> <Image src="/cart.png" alt="Cart" width={30} height={30} /> </span>
            {count > 0 && (
              <span className="cart-count">{count}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
