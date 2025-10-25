import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const { checkoutId } = req.body || {};
  if (!checkoutId) return res.status(400).json({ error: 'checkoutId is required' });

  const query = `
    query cartQuery($id: ID!) {
      cart(id: $id) {
        id
        checkoutUrl
        cost {
          totalAmount { amount currencyCode }
          subtotalAmount { amount currencyCode }
        }
        lines(first: 25) { 
          edges { 
            node { 
              id 
              quantity
              cost {
                totalAmount { amount currencyCode }
              }
              merchandise { 
                ... on ProductVariant { 
                  id
                  title
                  image { url altText }
                  priceV2 { amount currencyCode }
                  product { title handle }
                } 
              } 
            } 
          } 
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      `https://${domain}/api/2025-01/graphql.json`,
      { query, variables: { id: checkoutId } },
      { headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' } }
    );

    const cart = response.data.data.cart;
    if (!cart) return res.status(404).json({ error: 'cart not found' });

    // Map cart response to checkout-like format for backwards compatibility
    return res.status(200).json({ 
      checkout: {
        id: cart.id,
        webUrl: cart.checkoutUrl,
        lineItems: cart.lines,
        cost: cart.cost
      }
    });
  } catch (err) {
    console.error('API /checkout/get error', err && err.message ? err.message : err);
    return res.status(500).json({ error: err.message || 'unknown error' });
  }
}
