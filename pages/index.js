import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Home({ products }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>My 3D Print Shop</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
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
