import "@/styles/globals.css";
import { CartProvider, useCart } from '../context/CartContext';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import CartDrawer from '../components/CartDrawer';

function Header() {
  const { checkout, openCart } = useCart();
  const count = checkout?.lineItems?.edges?.reduce((s, e) => s + (e.node?.quantity || 0), 0) || 0;
  
  return (
    <header style={{
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
        /* header left and right padding */
        padding: '0 var(--space-xs)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo/Brand - Minimal wordmark */}
        <Link href="/" style={{
          fontSize: 'var(--font-base)',
          fontWeight: 500,
          color: 'var(--color-primary)',
          letterSpacing: '-0.01em',
          transition: 'opacity var(--transition-fast)'
        }}>
          Proto
        </Link>

        {/* Cart Button - Understated */}
        <button 
          onClick={openCart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.8rem',
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            fontSize: 'var(--font-sm)',
            fontWeight: 400,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            transition: 'all var(--transition-fast)'
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

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <CartContent Component={Component} pageProps={pageProps} />
    </CartProvider>
  );
}

function CartContent({ Component, pageProps }) {
  const { isCartOpen, closeCart } = useCart();
  
  return (
    <>
      <Toaster 
        position="top-right"
        containerStyle={{
          top: 'var(--header-height)',
          right: 'calc(50% - var(--max-width) / 2 + var(--space-xs))',
          marginTop: 'var(--space-sm)'
        }}
        toastOptions={{
          duration: 2000,
          style: {
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: 'calc(var(--font-xs) * 0.9)',
            padding: 'calc(var(--space-xs) * 0.8) var(--space-sm)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-primary)',
            fontWeight: 400,
            maxWidth: '250px',
            minHeight: 'auto'
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: 'var(--color-primary)'
            }
          }
        }}
      />
      <Header />
      <Component {...pageProps} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
