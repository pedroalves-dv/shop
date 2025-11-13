import axios from "axios";
import Link from "next/link";
import CollectionCard from "../components/CollectionCard";

export default function Home({ collections }) {
  const heroImage =
    collections && collections.length > 0 ? collections[0].image : null;

  return (
    <>
      {/* Full-viewport hero section */}
      <section
        aria-label="Homepage hero"
        style={{
          // height: "calc(100vh - var(--header-height))",
          marginTop: "var(--header-height)",
          height: "calc(100vh - var(--header-height))",
          minHeight: "560px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          color: "#fff",
          backgroundColor: "var(--color-bg)",
        }}
      >
        {/* Background image or gradient fallback */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: heroImage
              ? `url(${heroImage})`
              : "linear-gradient(180deg, #111 0%, #222 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          }}
        />

        {/* Dark overlay to improve text contrast */}
        {/* <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)",
            zIndex: 1,
          }}
        /> */}

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "var(--max-width)",
            margin: "0 auto",
            padding: "0 var(--container-padding)",
          }}
        >
          <div
            style={{
              paddingTop: "var(--space-xl)",
              paddingBottom: "var(--space-xl)",
              maxWidth: "860px",
            }}
          >
            <h1
              style={{
                fontSize: "8rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 0.9,
                marginBottom: "var(--space-xl)",
                color: "#fff",
              }}
            >
              Thoughtful <br /> and functional design.
            </h1>
            {/* <p
              style={{
                fontSize: "var(--font-xl)",
                color: "rgba(255,255,255,0.85)",
                maxWidth: "60%",
              }}
            >
              Discover products that blend form and function.
            </p> */}
          </div>
        </div>
      </section>

      {/* Main content with collections grid underneath the hero */}
      <div
        className="container"
        style={{ paddingTop: "var(--space-xl)", paddingBottom: "0" }}
      >
        {/* Collections Grid - 2 columns max on desktop */}
        <div
          className="responsive-grid collections-grid"
          style={{
            width: "100%",
            marginBottom: "var(--space-lg)",
          }}
        >
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
