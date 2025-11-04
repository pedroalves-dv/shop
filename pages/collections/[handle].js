import axios from 'axios';
import ProductCard from '../../components/ProductCard';

export default function Collection({ collection }) {
  if (!collection) {
    return (
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: 'var(--space-xl) var(--container-padding)',
        textAlign: 'center'
      }}>
        <h1>Collection not found</h1>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      paddingTop: 'var(--space-xl)',
      paddingLeft: 'var(--container-padding)',
      paddingRight: 'var(--container-padding)'
    }}>
      {/* Collection Header */}
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
          {collection.title}
        </h1>
        {collection.description && (
          <p style={{
            fontSize: 'var(--font-md)',
            color: 'var(--color-text-muted)',
            maxWidth: '600px',
          }}>
            {collection.description}
          </p>
        )}
      </div>

      {/* Products Grid */}
      {collection.products.length > 0 ? (
        <div className="responsive-grid" style={{ 
          width: '100%',
          marginBottom: 'var(--space-lg)',
        }}>
          {collection.products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              priority={false}
            />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-2xl)',
          color: 'var(--color-text-muted)'
        }}>
          <p>No products in this collection yet.</p>
        </div>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const query = `
  {
    collections(first: 20) {
      edges {
        node {
          handle
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

  const paths = response.data.data.collections.edges.map(edge => ({
    params: { handle: edge.node.handle }
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const query = `
  {
    collection(handle: "${params.handle}") {
      id
      handle
      title
      description
      products(first: 50) {
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
                  availableForSale
                  quantityAvailable
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

  const collectionData = response.data.data.collection;

  if (!collectionData) {
    return { notFound: true };
  }

  const collection = {
    id: collectionData.id,
    handle: collectionData.handle,
    title: collectionData.title,
    description: collectionData.description,
    products: collectionData.products.edges.map(edge => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      image: edge.node.images?.edges?.[0]?.node?.url || null,
      imageAlt: edge.node.images?.edges?.[0]?.node?.altText || edge.node.title,
      variants: edge.node.variants.edges.map(v => ({
        id: v.node.id,
        price: v.node.priceV2.amount,
        currency: v.node.priceV2.currencyCode,
        availableForSale: v.node.availableForSale,
        quantityAvailable: v.node.quantityAvailable
      }))
    }))
  };

  return { 
    props: { collection },
    revalidate: 60 // Revalidate every 60 seconds
  };
}
