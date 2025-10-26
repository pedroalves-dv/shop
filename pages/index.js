import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';

export default function Home({ products }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProducts = products.slice(0, 3); // First 3 products as featured

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <>
      {/* Hero Banner - Full Width Split Layout */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0,
        marginBottom: 'var(--space-lg)',
        borderBottom: '1px solid var(--color-primary)',
        minHeight: '407px'
      }}>
        {/* Left: Slogan */}
        <div style={{
          padding: 'var(--space-2xl)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#fff',
          borderRight: '1px solid var(--color-primary)',
          width: '100%'
        }}>
          <h1 style={{ 
            fontSize: '4.8rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textAlign: 'left',
            margin: 0,
            maxWidth: '500px',
            width: '100%'
          }}>
            Thoughtful <br /> and functional design.
          </h1>
        </div>

        {/* Right: Featured Product Carousel */}
        <div style={{
          position: 'relative',
          backgroundColor: 'var(--color-bg-secondary)',
          overflow: 'hidden'
        }}>
          {featuredProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${encodeURIComponent(product.handle)}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: currentSlide === index ? 'auto' : 'none'
              }}
            >
              {product.image && (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={product.image}
                    alt={product.imageAlt || product.title}
                    fill
                    sizes="50vw"
                    style={{ objectFit: 'cover' }}
                    priority={index === 0}
                  />
                </div>
              )}
            </Link>
          ))}

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            style={{
              position: 'absolute',
              left: 'var(--space-md)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid var(--color-primary)',
              borderRadius: 'var(--border-radius)',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              color: 'var(--color-primary)',
              transition: 'all var(--transition-fast)',
              zIndex: 2
            }}
          >
            <span style={{ display: 'block', marginTop: '-2px' }}>←</span>
          </button>
          <button
            onClick={nextSlide}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            style={{
              position: 'absolute',
              right: 'var(--space-md)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid var(--color-primary)',
              borderRadius: 'var(--border-radius)',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              color: 'var(--color-primary)',
              transition: 'all var(--transition-fast)',
              zIndex: 2
            }}
          >
            <span style={{ display: 'block', marginTop: '-2px' }}>→</span>
          </button>

          {/* Slide Indicators */}
          <div style={{
            position: 'absolute',
            bottom: 'var(--space-md)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 'var(--space-xs)',
            zIndex: 2
          }}>
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: currentSlide === index ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: '1px solid #fff',
                  background: currentSlide === index ? '#fff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '0', paddingBottom: '0' }}>

      {/* Product Grid */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 'var(--space-xl)',
        width: '100%'
      }}>
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            priority={false}
          />
        ))}
      </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const query = `
{
  products(first: 20) {
    edges {
      node {
        id
        handle
        title
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
`;


  const response = await axios.post(
    `https://${domain}/api/2025-01/graphql.json`,
    { query },
    { headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' } }
  );

  console.log(JSON.stringify(response.data, null, 2));

const products = response.data.data.products.edges.map(edge => ({
  id: edge.node.id,
  handle: edge.node.handle,
  title: edge.node.title,
  image: edge.node.images?.edges?.[0]?.node?.url || null,
  imageAlt: edge.node.images?.edges?.[0]?.node?.altText || edge.node.title,
  variants: edge.node.variants.edges.map(v => ({
    id: v.node.id,
    price: v.node.priceV2.amount,
    currency: v.node.priceV2.currencyCode
  }))
}));

  return { props: { products } };
}
