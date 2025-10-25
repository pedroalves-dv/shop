import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { checkout, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();

  if (loading) return <div style={{ padding: 20 }}>Loading cart…</div>;

  if (!checkout) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Your cart is empty</h2>
        <Link href="/">← Back to home</Link>
      </div>
    );
  }

  const items = checkout.lineItems?.edges?.map(e => e.node) || [];
  const totalAmount = checkout.cost?.totalAmount;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>Your cart</h2>
      {items.length === 0 && <p>No items in your cart.</p>}
      
      <div style={{ marginTop: 16 }}>
        {items.map((it) => {
          const title = it.merchandise?.product?.title || it.title || 'Product';
          const price = it.merchandise?.priceV2?.amount || it.cost?.totalAmount?.amount || '0';
          const currency = it.merchandise?.priceV2?.currencyCode || it.cost?.totalAmount?.currencyCode || 'EUR';
          const image = it.merchandise?.image?.url;
          const lineTotal = it.cost?.totalAmount?.amount || (parseFloat(price) * it.quantity).toFixed(2);

          return (
            <div key={it.id} style={{ 
              display: 'flex', 
              gap: 16, 
              padding: 16, 
              border: '1px solid #ddd', 
              borderRadius: 8, 
              marginBottom: 12,
              alignItems: 'center'
            }}>
              {image && (
                <Image 
                  src={image} 
                  alt={title}
                  width={80}
                  height={80}
                  style={{ width: 80, height: 'auto', objectFit: 'cover', borderRadius: 4 }} 
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>{title}</h3>
                <p style={{ margin: '4px 0', color: '#666' }}>
                  {price} {currency} each
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button 
                  onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))} 
                  disabled={loading || it.quantity <= 1}
                  style={{ padding: '4px 8px', cursor: it.quantity <= 1 ? 'not-allowed' : 'pointer' }}
                >
                  −
                </button>
                <span style={{ minWidth: 30, textAlign: 'center' }}>{it.quantity}</span>
                <button 
                  onClick={() => updateQuantity(it.id, it.quantity + 1)} 
                  disabled={loading}
                  style={{ padding: '4px 8px', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
              <div style={{ minWidth: 80, textAlign: 'right' }}>
                <strong>{lineTotal} {currency}</strong>
              </div>
              <button 
                onClick={() => removeFromCart(it.id)}
                disabled={loading}
                style={{ 
                  padding: '4px 8px', 
                  background: '#ff4444', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <div style={{ 
          marginTop: 24, 
          padding: 16, 
          border: '2px solid #0070f3', 
          borderRadius: 8,
          textAlign: 'right'
        }}>
          <h3 style={{ margin: '0 0 12px 0' }}>
            Total: {totalAmount?.amount || '0'} {totalAmount?.currencyCode || 'EUR'}
          </h3>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button 
              onClick={clearCart} 
              style={{ padding: '8px 16px', background: '#666', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              Clear cart
            </button>
            <a 
              href={checkout.webUrl} 
              target="_blank" 
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={{ padding: '8px 24px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }}>
                Checkout
              </button>
            </a>
          </div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <Link href="/">← Continue shopping</Link>
      </div>
    </div>
  );
}
