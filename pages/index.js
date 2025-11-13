import axios from "axios";
import Link from "next/link";
import CollectionCard from "../components/CollectionCard";

export default function Home({ collections }) {
  const heroImage =
    collections && collections.length > 0 ? collections[3].image : null;

  return (
    <>
      {/* Full-viewport hero section */}
      <section aria-label="Homepage hero" className="hero-banner">
        {/* Background image or gradient fallback */}
        <div
          className="hero-banner-bg"
          style={{
            backgroundImage: heroImage
              ? `url(${heroImage})`
              : "linear-gradient(180deg, #111 0%, #222 100%)",
          }}
        />

        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">
              Thoughtful <br /> and functional <br /> design.
            </h1>
          </div>
        </div>
      </section>

      {/* Main content with collections grid underneath the hero */}
      <div className="container home-container">
        {/* Collections Grid - 2 columns max on desktop */}
        <div className="responsive-grid collections-grid home-collections-grid">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              priority={index === 0}
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
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": token,
        "Content-Type": "application/json",
      },
    }
  );

  console.log(JSON.stringify(response.data, null, 2));

  const collections = response.data.data.collections.edges.map((edge) => {
    let imageUrl = edge.node.image?.url || null;
    // Append Shopify image transformation for better quality (2x for retina)
    if (imageUrl) {
      imageUrl = imageUrl.includes("?")
        ? `${imageUrl}&width=1200`
        : `${imageUrl}?width=1200`;
    }

    return {
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      description: edge.node.description,
      image: imageUrl,
      imageAlt: edge.node.image?.altText || edge.node.title,
      productCount: edge.node.products.edges.length,
    };
  });

  return { props: { collections } };
}
