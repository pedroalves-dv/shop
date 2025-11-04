import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductPage({ product }) {
  const router = useRouter();
  const { addToCart, loading } = useCart();
  const [added, setAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-xs)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Product not found</p>
        <Link href="/" style={{ fontSize: 'var(--font-sm)', marginTop: 'var(--space-xs)', display: 'inline-block' }}>
          ← Back to shop
        </Link>
      </div>
    );
  }

  const priceInfo = product.variants && product.variants[0]
    ? `${product.variants[0].price} ${product.variants[0].currency}`
    : 'N/A';

  // Check if product is out of stock
  const firstVariant = product?.variants?.[0];
  const isOutOfStock = !firstVariant?.availableForSale || firstVariant?.quantityAvailable === 0;

  // Get images array (fallback to single image for backwards compatibility)
  const images = product.images?.length > 0 ? product.images : (product.image ? [{url: product.image, altText: product.imageAlt}] : []);
  const currentImage = images[currentImageIndex];

  return (
    <div className="product-page-container" style={{ 
      paddingBottom: 'var(--space-2xl)',
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      paddingLeft: 'var(--space-xs)',
      paddingRight: 'var(--space-xs)'
    }}>
      {/* Product card - bordered nomenclature style */}
      <div className="product-card-wrapper" style={{ 
        border: '1px solid var(--color-primary)',
        overflow: 'hidden',
        marginTop: 'var(--space-xl)'
      }}>
        {/* Navigation section - full width at top */}
        <div style={{
          borderBottom: '1px solid var(--color-primary)',
          padding: 'var(--space-sm) var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => router.push('/')}
            style={{ 
              fontSize: 'var(--font-xs)',
              color: 'var(--color-text-muted)',
              display: 'inline-block',
              transition: 'color var(--transition-fast)',
              letterSpacing: '0.05em',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
          >
            ← Shop
          </button>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied!', {
                id: 'link-copied',
                duration: 2000,
                style: {
                  fontSize: 'calc(var(--font-xs) * 0.85)',
                  // padding: 'calc(var(--space-xs) * 0.7) var(--space-xs) var(--space-xs) var(--space-sm)',
                  minHeight: 'auto',
                  maxWidth: '200px',
                  height: 'calc(var(--header-height) - 13px)',
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

        {/* Main content - Stack on mobile, side by side on tablet+ */}
        <div className="product-layout" style={{
          display: 'grid',
          gridTemplateColumns: '1fr' // Stack on mobile
        }}>
          {/* Image Gallery - Left side (top on mobile) */}
          {images.length > 0 && (
            <div className="product-image" style={{ 
              position: 'relative',
              width: '100%',
              backgroundColor: 'var(--color-bg-secondary)',
              borderBottom: '1px solid var(--color-primary)' // Bottom border on mobile
            }}>
              {/* Main Image */}
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1'
              }}>
                <Image 
                  src={currentImage.url} 
                  alt={currentImage.altText || product.title}
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

              {/* Thumbnail Navigation - Only show if multiple images */}
              {images.length > 1 && (
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-xs)',
                  padding: 'var(--space-sm)',
                  backgroundColor: 'var(--color-bg)',
                  borderTop: '1px solid var(--color-primary)',
                  overflowX: 'auto'
                }}>
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      style={{
                        position: 'relative',
                        width: '60px',
                        height: '60px',
                        flexShrink: 0,
                        border: currentImageIndex === index 
                          ? '2px solid var(--color-primary)' 
                          : '1px solid var(--color-border)',
                        padding: 0,
                        cursor: 'pointer',
                        backgroundColor: 'var(--color-bg-secondary)',
                        opacity: currentImageIndex === index ? 1 : 0.6,
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        if (currentImageIndex !== index) {
                          e.currentTarget.style.opacity = '0.8';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentImageIndex !== index) {
                          e.currentTarget.style.opacity = '0.6';
                        }
                      }}
                    >
                      <Image 
                        src={img.url} 
                        alt={img.altText || `${product.title} - Image ${index + 1}`}
                        width={60}
                        height={60}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          display: 'block'
                        }} 
                      />
                    </button>
                  ))}
                </div>
              )}
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
            borderBottom: '1px solid var(--color-primary)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}>
            <button
              onClick={async () => {
                if (isOutOfStock) return; // Don't add if out of stock
                if (!product.variants || product.variants.length === 0) return;
                const res = await addToCart(product.variants[0].id, 1);
                if (res) setAdded(true);
              }}
              disabled={loading || isOutOfStock}
              style={{ 
                padding: 'var(--space-md) var(--space-2xl)',
                fontSize: 'var(--font-base)',
                fontWeight: 400,
                backgroundColor: isOutOfStock ? '#f5f5f5' : 'var(--color-primary)',
                color: isOutOfStock ? '#999' : '#fff',
                border: isOutOfStock ? '1px solid #ccc' : 'none',
                borderRadius: 'var(--border-radius)',
                cursor: (loading || isOutOfStock) ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-fast)',
                width: '100%',
                transform: 'none',
                opacity: isOutOfStock ? 0.6 : 1
              }}
            onMouseEnter={(e) => {
              if (!loading && !isOutOfStock) {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = 'var(--color-primary)';
                e.currentTarget.style.border = '1px solid var(--color-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isOutOfStock) {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.border = 'none';
              } else {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
                e.currentTarget.style.color = '#999';
                e.currentTarget.style.border = '1px solid #ccc';
              }
            }}
          >
            {isOutOfStock ? 'Out of Stock' : (loading ? 'Adding…' : 'Add to Cart')}
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

          {/* Description section */}
          {product.description && (
            <div style={{
              padding: 'var(--space-lg)'
            }}>
              <h2 style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 500,
                color: 'var(--color-primary)',
                marginBottom: 'var(--space-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Description
              </h2>
              <p style={{ 
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: 1.6,
                fontWeight: 400,
                whiteSpace: 'pre-line'
              }}>
                {product.description}
              </p>
            </div>
          )}
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
      description
      descriptionHtml
      images(first: 10) {
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
            availableForSale
            quantityAvailable
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
      description: productNode.description || '',
      descriptionHtml: productNode.descriptionHtml || '',
      image: productNode.images?.edges?.[0]?.node?.url || null,
      imageAlt: productNode.images?.edges?.[0]?.node?.altText || productNode.title,
      images: productNode.images?.edges?.map(edge => ({
        url: edge.node.url,
        altText: edge.node.altText || productNode.title
      })) || [],
      variants: productNode.variants.edges.map(v => ({
        id: v.node.id,
        price: v.node.priceV2.amount,
        currency: v.node.priceV2.currencyCode,
        availableForSale: v.node.availableForSale,
        quantityAvailable: v.node.quantityAvailable
      }))
    };

    return { props: { product } };
  } catch (err) {
    console.error('Error in getStaticProps (handle):', err && err.message ? err.message : err);
    return { notFound: true };
  }
}
