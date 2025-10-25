import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Home({ products }) {
  return (
    <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
      {/* Minimal intro - no fluff, just info */}
      <div style={{ 
        maxWidth: '720px',
        marginBottom: 'var(--space-2xl)'
      }}>
        <h1 style={{ 
          fontSize: 'var(--font-2xl)',
          marginBottom: 'var(--space-md)',
          fontWeight: 500
        }}>
          Precision 3D Prints
        </h1>
        <p style={{ 
          fontSize: 'var(--font-md)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          marginBottom: 0
        }}>
          Designer-crafted objects made with precision. All items are ready to ship.
        </p>
      </div>

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
            priority={index < 2}
          />
        ))}
      </div>
    </div>
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
