import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Products({ products }) {
  return (
    <div style={{
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      paddingTop: 'var(--space-xl)',
      paddingLeft: 'var(--container-padding)',
      paddingRight: 'var(--container-padding)'
    }}>
      {/* Page Header */}
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
          All Products
        </h1>
        <p style={{
          fontSize: 'var(--font-md)',
          color: 'var(--color-text-muted)',
          maxWidth: '600px',
        }}>
          Explore our full collection of thoughtfully designed products.
        </p>
      </div>

      {/* Product Grid */}
      <div className="responsive-grid" style={{ 
        width: '100%',
        marginBottom: 'var(--space-lg)',
      }}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            priority={false}
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
                availableForSale
                quantityAvailable
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

  const products = response.data.data.products.edges.map(edge => ({
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
  }));

  return { props: { products } };
}
