import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, priority = false }) {
  const price = product?.variants?.[0]?.price ?? 'N/A';
  const { addToCart, loading } = useCart();

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 'var(--space-md)'
    }}>
      {/* Image - Clean, no border */}
      <Link href={`/product/${encodeURIComponent(product.handle ?? product.id)}`}>
        {product.image && (
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-secondary)',
            aspectRatio: '1 / 1',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
          }}
          >
            <Image 
              src={product.image} 
              alt={product.imageAlt || product.title} 
              width={240}
              height={240}
              priority={priority}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.4s ease'
              }} 
            />
          </div>
        )}
      </Link>

      {/* Info - Minimal spacing */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xs)',
        flex: 1
      }}>
        <Link href={`/product/${encodeURIComponent(product.handle ?? product.id)}`}>
          <h3 style={{ 
            fontSize: 'var(--font-base)',
            fontWeight: 400,
            margin: 0,
            color: 'var(--color-primary)',
            letterSpacing: '-0.01em'
          }}>
            {product.title}
          </h3>
        </Link>
        
        <p style={{ 
          margin: 0,
          fontSize: 'var(--font-sm)',
          color: 'var(--color-text-muted)',
          fontWeight: 400
        }}>
          ${price}
        </p>
      </div>

      {/* Actions - Single button, no clutter */}
      <button
        onClick={async () => {
          if (!product.variants || product.variants.length === 0) return;
          await addToCart(product.variants[0].id, 1);
        }}
        disabled={loading}
        style={{ 
          padding: 'var(--space-sm) var(--space-md)',
          fontSize: 'var(--font-sm)',
          fontWeight: 400,
          border: '1px solid var(--color-border)',
          backgroundColor: 'transparent',
          color: 'var(--color-text)',
          borderRadius: 'var(--border-radius)',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all var(--transition-fast)',
          width: '100%'
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--color-text)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        {loading ? 'Adding…' : 'Add to Cart'}
      </button>
    </div>
  );
}