import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const { checkout, loading, updateQuantity, removeFromCart, clearCart } = useCart();

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
        zIndex: 1000,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee',
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
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px'
        }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#666', marginBottom: 16 }}>Your cart is empty</p>
              <button 
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  background: '#0070f3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14
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
                    display: 'flex',
                    gap: 12,
                    padding: 16,
                    border: '1px solid #eee',
                    borderRadius: 8,
                    marginBottom: 12,
                    alignItems: 'flex-start'
                  }}>
                    {image && (
                      <Image 
                        src={image} 
                        alt={title}
                        width={80}
                        height={80}
                        style={{ 
                          width: 80, 
                          height: 'auto', 
                          objectFit: 'cover', 
                          borderRadius: 6,
                          flexShrink: 0
                        }} 
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ 
                        margin: '0 0 4px 0', 
                        fontSize: 14, 
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {title}
                      </h3>
                      <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: 13 }}>
                        {price} {currency}
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <button 
                          onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))} 
                          disabled={loading || it.quantity <= 1}
                          style={{ 
                            padding: '4px 10px',
                            border: '1px solid #ddd',
                            borderRadius: 4,
                            background: it.quantity <= 1 ? '#f5f5f5' : '#fff',
                            cursor: it.quantity <= 1 ? 'not-allowed' : 'pointer',
                            fontSize: 14
                          }}
                        >
                          −
                        </button>
                        <span style={{ minWidth: 30, textAlign: 'center', fontSize: 14 }}>
                          {it.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(it.id, it.quantity + 1)} 
                          disabled={loading}
                          style={{ 
                            padding: '4px 10px',
                            border: '1px solid #ddd',
                            borderRadius: 4,
                            background: '#fff',
                            cursor: 'pointer',
                            fontSize: 14
                          }}
                        >
                          +
                        </button>
                        <div style={{ flex: 1, textAlign: 'right' }}>
                          <strong style={{ fontSize: 14 }}>
                            {lineTotal} {currency}
                          </strong>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeFromCart(it.id)}
                        disabled={loading}
                        style={{ 
                          padding: '4px 8px',
                          background: 'none',
                          color: '#ff4444',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 12,
                          textDecoration: 'underline'
                        }}
                      >
                        Remove
                      </button>
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
            borderTop: '2px solid #eee',
            backgroundColor: '#fafafa'
          }}>
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
                background: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 600
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
                  color: '#0070f3',
                  border: '1px solid #0070f3',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => {
                  if (confirm('Clear cart?')) {
                    clearCart();
                    onClose();
                  }
                }}
                style={{ 
                  flex: 1,
                  padding: '10px',
                  background: '#fff',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14
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
