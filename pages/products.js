import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Products({ products }) {
  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-header">
        <h1 className="products-title">All Products</h1>
        <p className="products-subtitle">Explore our full collection of thoughtfully designed products.</p>
      </div>

      {/* Product Grid */}
      <div className="responsive-grid products-grid">
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
