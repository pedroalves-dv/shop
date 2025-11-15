import "@/styles/variables.css";
import "@/styles/reset.css";
import "@/styles/base.css";
import "@/styles/utilities.css";
import "@/styles/layout.css";
import "@/styles/components/cart.css";
import "@/styles/components/filter-bar.css";
import "@/styles/components/product-card.css";
import "@/styles/components/collection-card.css";
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
      <div className="app-root">
        <Header />
        
        {/* Main content - grows to push footer down */}
        <main className="app-main">
          <Component {...pageProps} />
        </main>
        
        <Footer />
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
