import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CollectionCard({ collection }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid var(--color-border)',
      borderTop: isHovered ? '1px solid transparent' : '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius)',
      overflow: 'visible',
      backgroundColor: '#fff'
    }}>
      <Link 
        href={`/collections/${encodeURIComponent(collection.handle)}`}
        style={{ opacity: 1 }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
      >
        {/* Collection Image with 3D hover effect */}
        <div 
          style={{
            position: 'relative',
            overflow: 'visible',
            aspectRatio: '4 / 3', // Landscape rectangle instead of square
            cursor: 'pointer',
            borderBottom: '1px solid var(--color-border)',
            transform: isHovered ? 'translate(-4px, -4px)' : 'translate(0, 0)',
            transition: 'transform var(--transition-fast)',
            borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Image Box */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--color-bg-secondary)',
            border: isHovered ? '1px solid var(--color-primary)' : 'none',
            transition: 'border var(--transition-fast)',
            zIndex: 3,
            marginBottom: '-1px',
            borderRadius: '0 0 0 0',
            overflow: 'hidden'
          }}>
            {collection.image ? (
              <Image
                src={collection.image}
                alt={collection.imageAlt || collection.title}
                width={1200}
                height={900}
                style={{ 
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
                quality={95}
                priority={false}
                unoptimized={true}
              />
            ) : (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--font-2xl)',
                color: 'var(--color-text-muted)'
              }}>
                {collection.title.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Right Extrusion */}
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
          
          {/* Bottom Extrusion */}
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
      </Link>

      {/* Collection Info */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        flex: 1,
        padding: 'var(--space-sm)',
      }}>
        <Link href={`/collections/${encodeURIComponent(collection.handle)}`}>
          <h3 style={{ 
            fontSize: 'var(--font-base)',
            fontWeight: 400,
            margin: 0,
            color: 'var(--color-primary)',
            letterSpacing: '-0.01em'
          }}>
            {collection.title}
          </h3>
        </Link>
        
        {collection.productCount !== undefined && (
          <p style={{
            margin: 0,
            fontSize: 'var(--font-sm)',
            color: 'var(--color-text-muted)',
            fontWeight: 400
          }}>
            {collection.productCount} {collection.productCount === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>
    </div>
  );
}
