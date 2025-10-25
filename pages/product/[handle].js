import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

export default function ProductPage({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return <div style={{ padding: '2rem' }}>Product not found</div>;
  }

  const priceInfo = product.variants && product.variants[0]
    ? `${product.variants[0].price} ${product.variants[0].currency}`
    : 'N/A';


  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
        {product.image && (
          <div style={{ flex: '0 0 400px' }}>
            <Image 
              src={product.image} 
              alt={product.imageAlt || product.title}
              width={400}
              height={400}
              priority
              style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 8 }} 
            />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ marginTop: 0 }}>{product.title}</h1>
          <p style={{ fontSize: 24, fontWeight: 'bold', margin: '16px 0' }}>Price: {priceInfo}</p>
          <div style={{ marginTop: 24 }}>
            <button
              onClick={async () => {
                if (!product.variants || product.variants.length === 0) return;
                setAdding(true);
                const res = await addToCart(product.variants[0].id, 1);
                if (res) setAdded(true);
                setAdding(false);
              }}
              disabled={adding}
              style={{ padding: '0.75rem 1.5rem', marginRight: 12, fontSize: 16, cursor: 'pointer' }}
            >
              {adding ? 'Adding…' : 'Add to cart'}
            </button>

            {added && (
              <Link href="/cart">
                <span style={{ marginLeft: 8, color: '#0070f3' }}>Go to cart →</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #eee' }}>
        <Link href="/">← Continue shopping</Link>
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
