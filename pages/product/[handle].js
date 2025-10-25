import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductPage({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-2xl)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Product not found</p>
        <Link href="/" style={{ fontSize: 'var(--font-sm)', marginTop: 'var(--space-md)', display: 'inline-block' }}>
          ← Back to shop
        </Link>
      </div>
    );
  }

  const priceInfo = product.variants && product.variants[0]
    ? `${product.variants[0].price} ${product.variants[0].currency}`
    : 'N/A';

  return (
    <div style={{ 
      paddingTop: 'var(--space-2xl)', 
      paddingBottom: 'var(--space-2xl)',
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      padding: '0 var(--space-xl)'
    }}>
      {/* Product card - bordered nomenclature style */}
      <div style={{ 
        border: '1px solid var(--color-primary)',
        overflow: 'hidden',
        marginTop: 'var(--space-2xl)'
      }}>
        {/* Navigation section - full width at top */}
        <div style={{
          borderBottom: '1px solid var(--color-primary)',
          padding: 'var(--space-xs) var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link 
            href="/" 
            style={{ 
              fontSize: 'var(--font-xs)',
              color: 'var(--color-text-muted)',
              display: 'inline-block',
              transition: 'color var(--transition-fast)',
              letterSpacing: '0.05em'
            }}
          >
            ← Shop
          </Link>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied!', {
                duration: 2000,
                style: {
                  fontSize: 'calc(var(--font-xs) * 0.85)',
                  padding: 'calc(var(--space-xs) * 0.7) var(--space-sm)',
                  minHeight: 'auto',
                  maxWidth: '200px'
                }
              });
            }}
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--color-text-muted)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
          >
            Share
          </button>
        </div>

        {/* Main content - image and info side by side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr'
        }}>
          {/* Image - Left side */}
          {product.image && (
            <div style={{ 
              position: 'relative',
              width: '100%',
              backgroundColor: 'var(--color-bg-secondary)',
              aspectRatio: '1 / 1',
              borderRight: '1px solid var(--color-primary)'
            }}>
              <Image 
                src={product.image} 
                alt={product.imageAlt || product.title}
                width={500}
                height={500}
                priority
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block'
                }} 
              />
            </div>
          )}

          {/* Product Info - Right side with internal borders */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Title section */}
            <div style={{
              borderBottom: '1px solid var(--color-primary)',
              padding: 'var(--space-lg)'
            }}>
              <h1 style={{ 
                fontSize: 'var(--font-2xl)',
                fontWeight: 500,
                margin: 0,
                letterSpacing: '-0.02em',
                color: 'var(--color-primary)'
              }}>
                {product.title}
              </h1>
            </div>

          {/* Price section */}
          <div style={{
            borderBottom: '1px solid var(--color-primary)',
            padding: 'var(--space-lg)'
          }}>
            <p style={{ 
              fontSize: 'var(--font-xl)',
              color: 'var(--color-text-secondary)',
              margin: 0,
              fontWeight: 400
            }}>
              {priceInfo.split(' ')[0]} <span style={{ fontSize: 'var(--font-base)' }}>{priceInfo.split(' ')[1]}</span>
            </p>
          </div>

          {/* Action section */}
          <div style={{
            padding: 'var(--space-lg)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}>
            <button
              onClick={async () => {
                if (!product.variants || product.variants.length === 0) return;
                setAdding(true);
                const res = await addToCart(product.variants[0].id, 1);
                if (res) setAdded(true);
                setAdding(false);
              }}
              disabled={adding}
              style={{ 
                padding: 'var(--space-md) var(--space-2xl)',
                fontSize: 'var(--font-base)',
                fontWeight: 400,
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: adding ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-fast)',
                width: '100%'
              }}
            onMouseEnter={(e) => {
              if (!adding) {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = 'var(--color-primary)';
                e.currentTarget.style.border = '1px solid var(--color-primary)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.border = 'none';
            }}
          >
            {adding ? 'Adding…' : 'Add to Cart'}
          </button>

          {/* Success message */}
          {added && (
            <p style={{ 
              marginTop: 'var(--space-md)',
              fontSize: 'var(--font-sm)',
              color: 'var(--color-text-muted)'
            }}>
              Added to cart
            </p>
          )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const query = `
  {
    products(first: 50) {
      edges {
        node {
          handle
        }
      }
    }
  }
  `;

  try {
    const response = await axios.post(
      `https://${domain}/api/2025-01/graphql.json`,
      { query },
      { headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' } }
    );

    const handles = response.data.data.products.edges.map(e => e.node.handle).filter(Boolean);

    return {
      paths: handles.map(handle => ({ params: { handle } })),
      fallback: 'blocking'
    };
  } catch (err) {
    console.error('Error in getStaticPaths (handle):', err && err.message ? err.message : err);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const query = `
  {
    productByHandle(handle: "${params.handle}") {
      id
      title
      handle
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
  `;

  try {
    const response = await axios.post(
      `https://${domain}/api/2025-01/graphql.json`,
      { query },
      { headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' } }
    );

    const productNode = response.data.data.productByHandle;

    if (!productNode) {
      return { notFound: true };
    }

    const product = {
      id: productNode.id,
      title: productNode.title,
      handle: productNode.handle,
      image: productNode.images?.edges?.[0]?.node?.url || null,
      imageAlt: productNode.images?.edges?.[0]?.node?.altText || productNode.title,
      variants: productNode.variants.edges.map(v => ({
        id: v.node.id,
        price: v.node.priceV2.amount,
        currency: v.node.priceV2.currencyCode
      }))
    };

    return { props: { product } };
  } catch (err) {
    console.error('Error in getStaticProps (handle):', err && err.message ? err.message : err);
    return { notFound: true };
  }
}
