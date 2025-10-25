import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product, priority = false }) {
  const price = product?.variants?.[0]?.price ?? 'N/A';
  const { addToCart, loading } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid var(--color-primary)',
      borderRadius: 'var(--border-radius)',
      overflow: 'visible',
      backgroundColor: '#fff'
    }}>
      {/* Image - True 3D extrusion effect */}
      <Link 
        href={`/product/${encodeURIComponent(product.handle ?? product.id)}`}
        style={{ opacity: 1 }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
      >
        {product.image && (
          <div 
            style={{
              position: 'relative',
              overflow: 'visible',
              aspectRatio: '1 / 1',
              cursor: 'pointer',
              borderBottom: '1px solid var(--color-primary)',
              transform: isHovered ? 'translate(-4px, -4px)' : 'translate(0, 0)',
              transition: 'transform var(--transition-fast)',
              borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
              clipPath: isHovered ? 'none' : 'inset(0 0 0 0 round var(--border-radius) var(--border-radius) 0 0)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Main image */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              backgroundColor: 'var(--color-bg-secondary)',
              border: isHovered ? '1px solid var(--color-primary)' : 'none',
              transition: 'border var(--transition-fast)',
              zIndex: 3,
              marginBottom: '-1px',
              borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
              overflow: 'hidden'
            }}>
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
                  display: 'block'
                }} 
              />
            </div>
            
            {/* Right face (skewed trapezoid) */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: '-4px',
              width: '4px',
              height: '100%',
              backgroundColor: 'var(--color-primary)',
              transform: isHovered ? 'skewY(45deg)' : 'scaleY(0)',
              transformOrigin: 'top left',
              transition: 'transform var(--transition-fast)',
              zIndex: 2
            }} />
            
            {/* Bottom face (skewed trapezoid) */}
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              left: 0,
              width: '100%',
              height: '4px',
              backgroundColor: 'var(--color-primary)',
              transform: isHovered ? 'skewX(45deg)' : 'scaleX(0)',
              transformOrigin: 'top left',
              transition: 'transform var(--transition-fast)',
              zIndex: 2
            }} />
          </div>
        )}
      </Link>

      {/* Info - Minimal spacing */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xs)',
        flex: 1,
        padding: 'var(--space-sm)',
        borderBottom: '1px solid var(--color-primary)'
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
      <div style={{ padding: 'var(--space-sm)' }}>
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
          border: '1px solid var(--color-primary)',
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
          e.currentTarget.style.borderColor = 'var(--color-primary)';
        }}
      >
        {loading ? 'Adding…' : 'Add to Cart'}
      </button>
      </div>
    </div>
  );
}