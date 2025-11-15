import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const { checkout, openCart } = useCart();
  const count = checkout?.lineItems?.edges?.reduce((s, e) => s + (e.node?.quantity || 0), 0) || 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

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
          <Link 
            href="/collections"
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          >
            Collections
          </Link>
          <Link 
            href="/contact"
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          >
            Contact
          </Link>
        </nav>

        {/* Cart Button - Responsive sizing */}
        <button onClick={openCart} className="cart-button">
          <span> <Image src="/cart.png" alt="Cart" width={30} height={30} /> </span>
          {count > 0 && (
            <span className="cart-count">{count}</span>
          )}
        </button>
      </div>
    </header>
  );
}
