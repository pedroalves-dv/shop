import axios from 'axios';
import Link from 'next/link';
import CollectionCard from '../components/CollectionCard';

export default function Home({ collections }) {
  return (
    <>
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: '0' }}>
        {/* Hero Section */}
        <div style={{
          marginBottom: 'var(--space-xl)',
          textAlign: 'start',
        }}>
          <h1 style={{
            fontSize: 'var(--font-2xl)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-sm)',
            color: 'var(--color-text)'
          }}>
            Thoughtful and functional design.
          </h1>
          <p style={{
            fontSize: 'var(--font-md)',
            color: 'var(--color-text-muted)',
            maxWidth: '600px',
          }}>
            Discover products that blend form and function.
          </p>
        </div>

        {/* Collections Grid - 2 columns max on desktop */}
        <div className="responsive-grid collections-grid" style={{ 
          width: '100%',
          marginBottom: 'var(--space-lg)',
        }}>
          {collections.map((collection) => (
            <CollectionCard 
              key={collection.id} 
              collection={collection}
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
    collections(first: 20) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
          }
          products(first: 250) {
            edges {
              node {
                id
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

  const collections = response.data.data.collections.edges.map(edge => ({
    id: edge.node.id,
    handle: edge.node.handle,
    title: edge.node.title,
    description: edge.node.description,
    image: edge.node.image?.url || null,
    imageAlt: edge.node.image?.altText || edge.node.title,
    productCount: edge.node.products.edges.length
  }));

  return { props: { collections } };
}
