import axios from 'axios';
import CollectionCard from '../components/CollectionCard';

export default function CollectionsPage({ collections, errorMessage = null }) {
  return (
    <div className="collections-page">
      <div className="collections-header">
        <h1 className="collections-title">Collections</h1>
        <p className="collections-subtitle">Browse collections curated from our catalog.</p>
      </div>

      {collections.length > 0 ? (
        <div className="responsive-grid collections-grid">
          {collections.map((c) => (
            <CollectionCard key={c.handle} collection={c} priority={false} />
          ))}
        </div>
      ) : (
        <div className="collection-empty">
          <p>No collections found.</p>
          {errorMessage && (
            <div style={{ marginTop: '12px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              <p><strong>Debug:</strong> {errorMessage}</p>
              <p>If this is unexpected, check your Shopify credentials and server logs.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const query = `
  {
    collections(first: 50) {
      edges {
        node {
          id
          handle
          title
          image {
            url
            altText
          }
          products(first: 250) {
            edges {
              node { id }
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

  // Defensive: prefer the data payload if present; GraphQL may return non-fatal
  // errors alongside partial data. Use whatever collections are available.
  const data = response?.data;
  if (!data || !data.data || !data.data.collections) {
    // log errors server-side for debugging
    console.error('Collections query failed', data?.errors || data);
    const message = data?.errors ? JSON.stringify(data.errors) : 'No collections in response';
    return {
      props: { collections: [], errorMessage: message },
      revalidate: 60,
    };
  }

  if (data.errors) {
    // keep a server-side warning but continue with whatever data is present
    console.warn('Collections query returned errors but includes data:', data.errors);
  }

  const cols = (data.data.collections.edges || []).map(edge => ({
    handle: edge.node.handle,
    title: edge.node.title,
    image: edge.node.image?.url || null,
    imageAlt: edge.node.image?.altText || edge.node.title,
    productCount: edge.node.products?.edges?.length ?? 0,
  }));

  return {
    props: { collections: cols },
    revalidate: 60,
  };
}
