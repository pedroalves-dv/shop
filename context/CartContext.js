import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

// Custom toast functions for cart - all cart notifications will use these positions
// These use absolute positioning to place toasts at the true viewport edge
const cartToast = {
  success: (message) => toast.success(message, {
    position: 'top-center',
    style: {
                  height: 'calc(var(--header-height) - 13px)',
                }
    

  }),
  error: (message) => toast.error(message, {
    position: 'top-center',
        style: {
                  height: 'calc(var(--header-height) - 13px)',
                }

  })
};

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
            console.log('⚠️ Cart not found, clearing localStorage');
            localStorage.removeItem('cartId');
            setCheckout(null);
          }
        } catch (err) {
          console.error('❌ CartProvider init error', err && err.message ? err.message : err);
          console.log('🔄 Clearing stale cart from localStorage');
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
      cartToast.error(apiError);
      return null;
    } catch (err) {
      console.error('❌ addToCart error', err);
      console.error('❌ Response data:', err?.response?.data);
      
      // Extract detailed error message from backend
      const errorData = err?.response?.data;
      let errorMsg = 'Failed to add to cart';
      
      // Handle specific error types
      if (errorData?.clearCart || err?.response?.status === 410) {
        // Cart is in bad state, clear it and retry automatically
        console.log('🔄 Cart expired, creating new cart...');
        clearCart();
        
        // Retry with new cart (no checkoutId)
        try {
          const retryResp = await axios.post('/api/checkout/add', { checkoutId: null, variantId, quantity });
          if (retryResp.data?.checkout) {
            setCheckout(retryResp.data.checkout);
            if (typeof window !== 'undefined') localStorage.setItem('cartId', retryResp.data.checkout.id);
            setIsCartOpen(true);
            cartToast.success('Added to cart!');
            return retryResp.data.checkout;
          }
        } catch (retryErr) {
          console.error('❌ Retry failed:', retryErr);
          errorMsg = 'Failed to create new cart. Please refresh the page.';
        }
      } else if (err?.response?.status === 429 || errorData?.code === 'THROTTLED') {
        errorMsg = 'Too many requests. Please wait a moment and try again.';
      } else if (errorData?.details) {
        // Backend provided detailed explanation
        errorMsg = `${errorData.error || 'Product unavailable'}\n${errorData.details}`;
      } else if (errorData?.error) {
        errorMsg = typeof errorData.error === 'string' 
          ? errorData.error 
          : JSON.stringify(errorData.error);
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      cartToast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(lineId, quantity) {
    if (!checkout?.id || !lineId || quantity < 1) {
      cartToast.error('Invalid update request');
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
        cartToast.success('Quantity updated!');
        return resp.data.checkout;
      }

      const apiError = resp.data?.error || 'Failed to update quantity';
      setError(apiError);
      cartToast.error(apiError);
      return null;
    } catch (err) {
      console.error('❌ updateQuantity error', err);
      
      // Better error handling with specific messages
      const errorData = err?.response?.data;
      const errorMessage = errorData?.error || err.message || 'Failed to update quantity';
      
      // If it's a 500 error, the item might be out of stock or invalid
      if (err?.response?.status === 500) {
        cartToast.error('Unable to update. Item may be out of stock or no longer available.');
        // Optionally refetch cart to sync with Shopify's state
        try {
          const refetch = await axios.post('/api/checkout/get', { checkoutId: checkout.id });
          if (refetch.data?.checkout) {
            setCheckout(refetch.data.checkout);
          }
        } catch (refetchErr) {
          console.error('Failed to refetch cart:', refetchErr);
        }
      } else {
        cartToast.error(errorMessage);
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(lineId) {
    if (!checkout?.id || !lineId) {
      cartToast.error('Invalid remove request');
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
      cartToast.error(apiError);
      return null;
    } catch (err) {
      console.error('❌ removeFromCart error', err);
      setError(err?.response?.data || err.message || 'unknown error');
      cartToast.error('Failed to remove item');
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
