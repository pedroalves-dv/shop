import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { checkout, openCart } = useCart();
  const count = checkout?.lineItems?.edges?.reduce((s, e) => s + (e.node?.quantity || 0), 0) || 0;
  
  return (
    <header className="site-header" style={{
      position: 'sticky',
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
        padding: '0 var(--container-padding)', // Now uses responsive padding
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo/Brand - Minimal wordmark */}
        <Link href="/" style={{
          fontSize: 'var(--font-md)', // Slightly larger, scales with viewport
          fontWeight: 500,
          color: 'var(--color-primary)',
          letterSpacing: '-0.01em',
          transition: 'opacity var(--transition-fast)'
        }}>
          Proto
        </Link>

        {/* Cart Button - Responsive sizing */}
        <button 
          onClick={openCart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0 0.8rem',
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            fontSize: 'var(--font-sm)',
            fontWeight: 400,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            transition: 'all var(--transition-fast)',
            minHeight: '40px', // Touch-friendly size for mobile
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
          <span>Cart</span>
          {count > 0 && (
            <span style={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: 'var(--font-xs)',
              fontWeight: 500,
              minWidth: '18px',
              textAlign: 'center'
            }}>
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
