/*
  CartDrawer component
  - What it is: slide-in cart drawer shown from the header/cart button.
  - What it controls (CSS classes): .cart-drawer-overlay, .cart-drawer, .cart-drawer-header,
    .cart-drawer-content, .cart-item, .cart-qty, .cart-checkout-button, .cart-drawer-footer
  - Notes: reads/writes cart via CartContext; confirmation and quantity controls live here.
*/
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { redirect } from 'next/dist/server/api-utils';

export default function CartDrawer({ isOpen, onClose }) {
  const { checkout, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const items = checkout?.lineItems?.edges?.map(e => e.node) || [];
  const totalAmount = checkout?.cost?.totalAmount;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`}
        />
      )}

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Shopping Cart ({items.length})</h2>
          <button onClick={onClose} className="cart-drawer-close">✖</button>
        </div>

        {/* Content */}
        <div className="cart-drawer-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <button onClick={onClose} className="cart-continue-button">Continue Shopping</button>
            </div>
          ) : (
            <>
              {items.map((it) => {
                const title = it.merchandise?.product?.title || it.title || 'Product';
                const price = it.merchandise?.priceV2?.amount || '0';
                const currency = it.merchandise?.priceV2?.currencyCode || 'EUR';
                const image = it.merchandise?.image?.url;
                const lineTotal = it.cost?.totalAmount?.amount || (parseFloat(price) * it.quantity).toFixed(2);

                return (
                  <div key={it.id} className="cart-item">
                    {/* Image Section */}
                    {image && (
                      <div className="cart-item-image">
                        <Image src={image} alt={title} width={140} height={140} className="cart-item-img" />
                      </div>
                    )}
                    
                    {/* Content Section */}
                    <div className="cart-item-info">
                      {/* Top: Title & Price */}
                      <div className="cart-item-meta">
                        <h3 className="cart-item-title">{title}</h3>
                        <p className="cart-item-price">{price} {currency}</p>
                      </div>

                      {/* Middle: Quantity Controls */}
                      <div className="cart-qty">
                        <button
                          onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))}
                          disabled={loading || it.quantity <= 1}
                          className="cart-qty-button"
                        >
                          –
                        </button>
                        <span className="cart-qty-value">{it.quantity}</span>
                        <button
                          onClick={() => updateQuantity(it.id, it.quantity + 1)}
                          disabled={loading}
                          className="cart-qty-button"
                        >
                          +
                        </button>
                      </div>

                      {/* Bottom: Total & Remove */}
                      <div className="cart-item-bottom">
                        <strong className="cart-item-total">{lineTotal} {currency}</strong>
                        <button onClick={() => removeFromCart(it.id)} disabled={loading} className="cart-remove-button" title="Remove item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Clear Cart Confirmation */}
              {showClearConfirm && (
              <div className="cart-clear-confirm">
                <p>Clear all items from cart?</p>
                <div className="cart-clear-actions">
                  <button
                    onClick={() => {
                      clearCart();
                      setShowClearConfirm(false);
                      onClose();
                    }}
                    className="cart-btn primary"
                  >
                    Yes, Clear
                  </button>
                  <button onClick={() => setShowClearConfirm(false)} className="cart-btn secondary">Cancel</button>
                </div>
              </div>
            )}

            <div className="cart-total">
              <span>Total:</span>
              <span>{totalAmount?.amount || '0'} {totalAmount?.currencyCode || 'EUR'}</span>
            </div>

            <a href={checkout?.webUrl} target="_blank" rel="noreferrer">
              <button className="cart-checkout-button">Checkout</button>
            </a>

            <div className="cart-actions">
              <button onClick={onClose} className="cart-btn secondary">Continue Shopping</button>
              <button onClick={() => setShowClearConfirm(true)} className="cart-btn secondary">Clear Cart</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
