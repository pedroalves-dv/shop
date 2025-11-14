import axios from 'axios';
import ProductCard from '../../components/ProductCard';

export default function Collection({ collection }) {
  if (!collection) {
    return (
      <div className="collection-page">
        <div className="collection-header collection-header--center">
          <h1>Collection not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="collection-page">
      {/* Collection Header */}
      <div className="collection-header">
        <h1 className="collection-title">{collection.title}</h1>
        {collection.description && (
          <p className="collection-subtitle">{collection.description}</p>
        )}
      </div>

      {/* Products Grid */}
      {collection.products.length > 0 ? (
        <div className="responsive-grid products-grid">
          {collection.products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              priority={false}
            />
          ))}
        </div>
      ) : (
        <div className="collection-empty">
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
