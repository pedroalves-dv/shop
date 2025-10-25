import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const price = product?.variants?.[0]?.price ?? 'N/A';
  const { addToCart, loading } = useCart();

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', width: '220px', borderRadius: 8 }}>
      {product.image && (
        <img 
          src={product.image} 
          alt={product.imageAlt || product.title} 
          style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} 
        />
      )}
      <h2 style={{ fontSize: 16, margin: '8px 0' }}>{product.title}</h2>
      <p style={{ margin: '4px 0', fontWeight: 'bold' }}>${price}</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Link href={`/product/${encodeURIComponent(product.handle ?? product.id)}`}>
          <span style={{ display: 'inline-block', padding: '0.5rem 0.75rem', background: '#0070f3', color: '#fff', borderRadius: 6, cursor: 'pointer', textDecoration: 'none', fontSize: 14 }}>
            View
          </span>
        </Link>

        <button
          onClick={async () => {
            if (!product.variants || product.variants.length === 0) return;
            await addToCart(product.variants[0].id, 1);
          }}
          disabled={loading}
          style={{ padding: '0.5rem 0.75rem', flex: 1, cursor: 'pointer', fontSize: 14 }}
        >
          {loading ? 'Adding…' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}