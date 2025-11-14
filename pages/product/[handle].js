/*
  Product detail page (pages/product/[handle].js)
  - What it is: the product detail view — image gallery, title, price, add-to-cart and description.
  - What it controls (CSS classes): .product-page-container, .product-layout, .product-image--main,
    .product-thumbs, .product-title, .product-price, .product-add-button, .product-description-section
  - Notes: uses SSG (getStaticPaths/getStaticProps). Gallery state is local to this page.
*/
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
      <div className="container product-notfound-container">
        <p className="product-notfound-text">Product not found</p>
        <Link href="/" className="product-back-link">← Back to shop</Link>
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
    <div className="container product-page-container">
      {/* Product card - bordered nomenclature style */}
      <div className="product-card">
        {/* Navigation section - full width at top */}
        <div className="product-nav">
          <button
            onClick={() => router.push('/')}
            className="product-nav-button"
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
                  minHeight: 'auto',
                  maxWidth: '200px',
                  height: 'calc(var(--header-height) - 13px)'
                }
              });
            }}
            className="product-nav-button"
          >
            Share
          </button>
        </div>

        {/* Main content - Stack on mobile, side by side on tablet+ */}
        <div className="product-layout">
          {/* Image Gallery - Left side (top on mobile) */}
          {images.length > 0 && (
            <div className="product-image product-image--main">
              {/* Main Image */}
              <div className="product-image-inner">
                <Image 
                  src={currentImage.url} 
                  alt={currentImage.altText || product.title}
                  width={800}
                  height={800}
                  priority
                  className="product-main-img"
                />
              </div>

              {/* Thumbnail Navigation - Only show if multiple images */}
              {images.length > 1 && (
                <div className="product-thumbs">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`product-thumb-button ${currentImageIndex === index ? 'active' : ''}`}
                    >
                      <Image 
                        src={img.url} 
                        alt={img.altText || `${product.title} - Image ${index + 1}`}
                        width={60}
                        height={60}
                        className="product-thumb-img"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Product Info - Right side with internal borders */}
          <div className="product-info-right">
            {/* Title section */}
            <div className="product-title-section">
              <h1 className="product-title">{product.title}</h1>
            </div>

          {/* Price section */}
          <div className="product-price-section">
            <p className="product-price">{priceInfo.split(' ')[0]} <span className="product-price-currency">{priceInfo.split(' ')[1]}</span></p>
          </div>

          {/* Action section */}
          <div className="product-actions">
            <button
              onClick={async () => {
                if (isOutOfStock) return; // Don't add if out of stock
                if (!product.variants || product.variants.length === 0) return;
                const res = await addToCart(product.variants[0].id, 1);
                if (res) setAdded(true);
              }}
              disabled={loading || isOutOfStock}
              className={`product-add-button ${isOutOfStock ? 'out-of-stock' : ''} ${loading ? 'loading' : ''}`}
            >
              {isOutOfStock ? 'Out of Stock' : (loading ? 'Adding…' : 'Add to Cart')}
            </button>

            {/* Success message */}
            {added && (
              <p className="product-add-success">Added to cart</p>
            )}
          </div>

          {/* Description section */}
          {product.description && (
            <div className="product-description-section">
              <h2 className="product-description-title">Description</h2>
              <p className="product-description-text">{product.description}</p>
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
