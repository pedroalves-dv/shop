import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { checkout, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();

  if (loading) return <div className="cart-loading">Loading cart…</div>;

  if (!checkout) {
    return (
      <div className="cart-empty-page">
        <h2>Your cart is empty</h2>
        <Link href="/">← Back to home</Link>
      </div>
    );
  }

  const items = checkout.lineItems?.edges?.map(e => e.node) || [];
  const totalAmount = checkout.cost?.totalAmount;

  return (
    <div className="cart-page">
      <h2>Your cart</h2>
      {items.length === 0 && <p>No items in your cart.</p>}
      
  <div className="cart-items">
        {items.map((it) => {
          const title = it.merchandise?.product?.title || it.title || 'Product';
          const price = it.merchandise?.priceV2?.amount || it.cost?.totalAmount?.amount || '0';
          const currency = it.merchandise?.priceV2?.currencyCode || it.cost?.totalAmount?.currencyCode || 'EUR';
          const image = it.merchandise?.image?.url;
          const lineTotal = it.cost?.totalAmount?.amount || (parseFloat(price) * it.quantity).toFixed(2);

          return (
            <div key={it.id} className="cart-row">
              {image && (
                <Image 
                  src={image} 
                  alt={title}
                  width={80}
                  height={80}
                  className="cart-thumb"
                />
              )}
              <div className="cart-row-body">
                <h3 className="cart-page-item-title">{title}</h3>
                <p className="cart-page-item-meta">
                  {price} {currency} each
                </p>
              </div>
              <div className="cart-qty-controls">
                <button 
                  onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))} 
                  disabled={loading || it.quantity <= 1}
                  className="qty-btn"
                >
                  −
                </button>
                <span className="qty-value">{it.quantity}</span>
                <button 
                  onClick={() => updateQuantity(it.id, it.quantity + 1)} 
                  disabled={loading}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
              <div className="cart-line-total">
                <strong>{lineTotal} {currency}</strong>
              </div>
              <button 
                onClick={() => removeFromCart(it.id)}
                disabled={loading}
                className="cart-remove-btn"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
          <div className="cart-summary">
          <h3 className="cart-summary-total">
            Total: {totalAmount?.amount || '0'} {totalAmount?.currencyCode || 'EUR'}
          </h3>
          <div className="cart-actions cart-actions--end">
            <button 
              onClick={clearCart} 
              className="page-clear-btn"
            >
              Clear cart
            </button>
            <a 
              href={checkout.webUrl} 
              target="_blank" 
              rel="noreferrer"
              className="link-no-decoration"
            >
              <button className="page-checkout-btn">
                Checkout
              </button>
            </a>
          </div>
        </div>
      )}

      <div className="cart-continue">
        <Link href="/">← Continue shopping</Link>
      </div>
    </div>
  );
}
