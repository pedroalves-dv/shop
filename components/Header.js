import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Image from 'next/image';

export default function Header() {
  const { checkout, openCart } = useCart();
  const count = checkout?.lineItems?.edges?.reduce((s, e) => s + (e.node?.quantity || 0), 0) || 0;
  
  return (
    <header className="site-header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--header-height)',
      backgroundColor: 'var(--color-bg)',
      borderBottom: '1px solid var(--color-primary)',
      zIndex: 100,
      backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)'
    }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        height: '100%',
        padding: '0 var(--container-padding)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo/Brand - Minimal wordmark */}
        <Link href="/" style={{
          fontSize: 'var(--font-lg)',
          fontWeight: 500,
          color: 'var(--color-primary)',
        //   letterSpacing: '-0.01em',
          transition: 'opacity var(--transition-fast)',
          width: '5em',
        }}>
          Atelier 3
        </Link>

        {/* Navigation - Center */}
        <nav style={{
          display: 'flex',
          gap: 'var(--space-xl)',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          paddingLeft: 'var(--space-2xl)',
          fontSize: 'var(--font-base)',
          color: 'var(--color-text-primary)',
          textDecoration: 'none',
          transition: 'color var(--transition-fast)',
        }}>
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
            href="/contact"
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          >
            Contact
          </Link>
        </nav>

        {/* Cart Button - Responsive sizing */}
        <button 
          onClick={openCart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0 .8rem',
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            fontSize: 'var(--font-sm)',
            fontWeight: 400,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            transition: 'all var(--transition-fast)',
            minHeight: '40px',
            minWidth: '44px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span> <Image src="/cart.png" alt="Cart" width={30} height={30} /> </span>
          {count > 0 && (
            <span style={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
             padding: '2px 8px',
              borderRadius: '50%',
              fontSize: 'var(--font-sm)',
              fontWeight: 500,
              minWidth: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
