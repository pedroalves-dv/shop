import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const { checkout, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [removingItemId, setRemovingItemId] = useState(null);

  const items = checkout?.lineItems?.edges?.map(e => e.node) || [];
  const totalAmount = checkout?.cost?.totalAmount;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            transition: 'opacity 0.3s ease',
            opacity: isOpen ? 1 : 0
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: 480,
        backgroundColor: '#fff',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
        borderLeft: '1px solid var(--color-primary)',
        zIndex: 1000,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          height: 'var(--header-height)',
          padding: '0 20px 2px 20px',
          borderBottom: '1px solid var(--color-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>
            Shopping Cart ({items.length})
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              padding: 4,
              lineHeight: 1
            }}
          >
            ✖
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px'
        }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 20px' }}>
              <p style={{ color: '#666', marginBottom: 30 }}>Your cart is empty</p>
              <button 
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  background: '#fff',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-primary)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 400,
                  transition: 'all var(--transition-fast)',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                Continue Shopping
              </button>
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
                  <div key={it.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--border-radius)',
                    overflow: 'hidden',
                    marginBottom: 'var(--space-md)',
                    minHeight: '140px'
                  }}>
                    {/* Image Section */}
                    {image && (
                      <div style={{ 
                        borderRight: '1px solid var(--color-primary)',
                        display: 'flex',
                        alignItems: 'stretch',
                        justifyContent: 'center',
                        backgroundColor: '#fafafa',
                        overflow: 'hidden'
                      }}>
                        <Image 
                          src={image} 
                          alt={title}
                          width={140}
                          height={140}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }} 
                        />
                      </div>
                    )}
                    
                    {/* Content Section */}
                    <div style={{ 
                      paddingTop: 'var(--space-sm)',
                      paddingLeft: 'var(--space-sm)',
                      paddingRight: 'var(--space-sm)',
                      paddingBottom: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start'
                    }}>
                      {/* Top: Title & Price */}
                      <div>
                        <h3 style={{ 
                          margin: '0 0 4px 0', 
                          fontSize: 'var(--font-sm)', 
                          fontWeight: 500,
                          color: 'var(--color-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {title}
                        </h3>
                        <p style={{ 
                          margin: 0, 
                          color: 'var(--color-text-secondary)', 
                          fontSize: 'var(--font-xs)'
                        }}>
                          {price} {currency}
                        </p>
                      </div>

                      {/* Middle: Quantity Controls */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--space-xs)',
                        paddingTop: 'var(--space-sm)',
                        marginTop: 'var(--space-sm)',
                        borderTop: '1px solid var(--color-primary)',
                        marginLeft: 'calc(var(--space-sm) * -1)',
                        marginRight: 'calc(var(--space-sm) * -1)',
                        paddingLeft: 'var(--space-sm)',
                        paddingRight: 'var(--space-sm)'
                      }}>
                        <button 
                          onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))} 
                          disabled={loading || it.quantity <= 1}
                          style={{ 
                            padding: '4px 8px',
                            border: '1px solid var(--color-primary)',
                            borderRadius: 'var(--border-radius)',
                            background: it.quantity <= 1 ? 'var(--color-bg-secondary)' : '#fff',
                            cursor: it.quantity <= 1 ? 'not-allowed' : 'pointer',
                            fontSize: 'var(--font-sm)',
                            color: 'var(--color-primary)',
                            lineHeight: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          −
                        </button>
                        <span style={{ 
                          minWidth: 30, 
                          textAlign: 'center', 
                          fontSize: 'var(--font-sm)',
                          fontWeight: 500
                        }}>
                          {it.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(it.id, it.quantity + 1)} 
                          disabled={loading}
                          style={{ 
                            padding: '4px 8px',
                            border: '1px solid var(--color-primary)',
                            borderRadius: 'var(--border-radius)',
                            background: '#fff',
                            cursor: 'pointer',
                            fontSize: 'var(--font-sm)',
                            color: 'var(--color-primary)',
                            lineHeight: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Bottom: Total & Remove */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--space-sm) var(--space-sm)',
                        marginTop: 'var(--space-sm)',
                        borderTop: '1px solid var(--color-primary)',
                        marginLeft: 'calc(var(--space-sm) * -1)',
                        marginRight: 'calc(var(--space-sm) * -1)'
                      }}>
                        <strong style={{ 
                          fontSize: 'var(--font-sm)'
                        }}>
                          {lineTotal} {currency}
                        </strong>
                        
                        {removingItemId === it.id ? (
                          <div style={{ 
                            display: 'flex', 
                            gap: 6, 
                            alignItems: 'center'
                          }}>
                            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-primary)' }}>Remove?</span>
                            <button 
                              onClick={() => {
                                removeFromCart(it.id);
                                setRemovingItemId(null);
                              }}
                              disabled={loading}
                              style={{ 
                                padding: '4px 8px',
                                background: 'var(--color-primary)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 'var(--border-radius)',
                                cursor: 'pointer',
                                fontSize: 'var(--font-xs)',
                                fontWeight: 500
                              }}
                            >
                              Yes
                            </button>
                            <button 
                              onClick={() => setRemovingItemId(null)}
                              style={{ 
                                padding: '4px 8px',
                                background: '#fff',
                                color: 'var(--color-primary)',
                                border: '1px solid var(--color-primary)',
                                borderRadius: 'var(--border-radius)',
                                cursor: 'pointer',
                                fontSize: 'var(--font-xs)'
                              }}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setRemovingItemId(it.id)}
                            disabled={loading}
                            style={{ 
                              padding: '4px 8px',
                              background: 'none',
                              color: 'var(--color-primary)',
                              border: '1px solid var(--color-primary)',
                              borderRadius: 'var(--border-radius)',
                              cursor: 'pointer',
                              fontSize: 14,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Remove item"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        )}
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
          <div style={{
            padding: '20px',
            borderTop: '1px solid var(--color-primary)',
            backgroundColor: '#fafafa'
          }}>
            {/* Clear Cart Confirmation */}
            {showClearConfirm && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                border: '1px solid var(--color-primary)',
                borderRadius: 2,
                backgroundColor: '#fff'
              }}>
                <p style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: 13, 
                  color: 'var(--color-primary)',
                  fontWeight: 500
                }}>
                  Clear all items from cart?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    onClick={() => {
                      clearCart();
                      setShowClearConfirm(false);
                      onClose();
                    }}
                    style={{ 
                      flex: 1,
                      padding: '8px',
                      background: 'var(--color-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 2,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500
                    }}
                  >
                    Yes, Clear
                  </button>
                  <button 
                    onClick={() => setShowClearConfirm(false)}
                    style={{ 
                      flex: 1,
                      padding: '8px',
                      background: '#fff',
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-primary)',
                      borderRadius: 2,
                      cursor: 'pointer',
                      fontSize: 13
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 16,
              fontSize: 18,
              fontWeight: 600
            }}>
              <span>Total:</span>
              <span>{totalAmount?.amount || '0'} {totalAmount?.currencyCode || 'EUR'}</span>
            </div>
            
            <a 
              href={checkout?.webUrl} 
              target="_blank" 
              rel="noreferrer"
              style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}
            >
              <button style={{ 
                width: '100%',
                padding: '14px',
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-base)',
                fontWeight: 500
              }}>
                Checkout
              </button>
            </a>

            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={onClose}
                style={{ 
                  flex: 1,
                  padding: '10px',
                  background: '#fff',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-primary)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-sm)'
                }}
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => setShowClearConfirm(true)}
                style={{ 
                  flex: 1,
                  padding: '10px',
                  background: '#fff',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-primary)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-sm)'
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
