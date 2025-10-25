import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;
    if (id) {
      // fetch checkout details
      (async () => {
        try {
          setLoading(true);
          const resp = await axios.post('/api/checkout/get', { checkoutId: id });
          if (resp.data?.checkout) {
            setCheckout(resp.data.checkout);
          } else {
            localStorage.removeItem('cartId');
            setCheckout(null);
          }
        } catch (err) {
          console.error('CartProvider init error', err && err.message ? err.message : err);
          localStorage.removeItem('cartId');
          setCheckout(null);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  async function addToCart(variantId, quantity = 1) {
    try {
      setLoading(true);
      setError(null);
      const resp = await axios.post('/api/checkout/add', { checkoutId: checkout?.id, variantId, quantity });

      if (resp.data?.checkout) {
        setCheckout(resp.data.checkout);
        if (typeof window !== 'undefined') localStorage.setItem('cartId', resp.data.checkout.id);
        setIsCartOpen(true); // Auto-open cart drawer (visual feedback)
        return resp.data.checkout;
      }

      const apiError = resp.data?.error || 'Failed to add to cart';
      setError(apiError);
      toast.error(apiError);
      return null;
    } catch (err) {
      console.error('❌ addToCart error', err);
      const errorMsg = err?.response?.data?.error || err.message || 'Failed to add to cart';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(lineId, quantity) {
    if (!checkout?.id || !lineId || quantity < 1) {
      toast.error('Invalid update request');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const resp = await axios.post('/api/checkout/update-quantity', {
        cartId: checkout.id,
        lineId,
        quantity
      });

      if (resp.data?.checkout) {
        setCheckout(resp.data.checkout);
        toast.success('Quantity updated!');
        return resp.data.checkout;
      }

      const apiError = resp.data?.error || 'Failed to update quantity';
      setError(apiError);
      toast.error(apiError);
      return null;
    } catch (err) {
      console.error('❌ updateQuantity error', err);
      setError(err?.response?.data || err.message || 'unknown error');
      toast.error('Failed to update quantity');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(lineId) {
    if (!checkout?.id || !lineId) {
      toast.error('Invalid remove request');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const resp = await axios.post('/api/checkout/remove-line', {
        cartId: checkout.id,
        lineId
      });

      if (resp.data?.checkout) {
        setCheckout(resp.data.checkout);
        return resp.data.checkout;
      }

      const apiError = resp.data?.error || 'Failed to remove item';
      setError(apiError);
      toast.error(apiError);
      return null;
    } catch (err) {
      console.error('❌ removeFromCart error', err);
      setError(err?.response?.data || err.message || 'unknown error');
      toast.error('Failed to remove item');
      return null;
    } finally {
      setLoading(false);
    }
  }

  function clearCart() {
    setCheckout(null);
    if (typeof window !== 'undefined') localStorage.removeItem('cartId');
  }

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  return (
    <CartContext.Provider value={{ 
      checkout, 
      loading, 
      error, 
      isCartOpen,
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
