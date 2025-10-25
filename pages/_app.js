import "@/styles/globals.css";
import { CartProvider, useCart } from '../context/CartContext';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import CartDrawer from '../components/CartDrawer';

function Header() {
  const { checkout, openCart } = useCart();
  const count = checkout?.lineItems?.edges?.reduce((s, e) => s + (e.node?.quantity || 0), 0) || 0;
  
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid #eee' }}>
      <div><Link href="/">My 3D Print Shop</Link></div>
      <div>
        <button 
          onClick={openCart}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            color: '#0070f3',
            textDecoration: 'underline'
          }}
        >
          Cart ({count})
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
      <Toaster position="top-right" />
      <Header />
      <Component {...pageProps} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
