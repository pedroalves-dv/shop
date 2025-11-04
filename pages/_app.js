import "@/styles/globals.css";
import { CartProvider, useCart } from '../context/CartContext';
import { Toaster } from 'react-hot-toast';
import CartDrawer from '../components/CartDrawer';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
      {/* Single Toaster - centered at top */}
      <Toaster 
        position="top-center"
        containerStyle={{
          top: '6px',
        }}
        toastOptions={{
          duration: 2000,
          style: {
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: 'calc(var(--font-xs) * 0.9)',
            // padding: 'calc(var(--space-xs) * 0.8) var(--space-sm)',
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
      
      {/* Main layout wrapper - ensures footer stays at bottom */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header />
        
        {/* Main content - grows to push footer down */}
        <main style={{ flex: 1 }}>
          <Component {...pageProps} />
        </main>
        
        <Footer />
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
