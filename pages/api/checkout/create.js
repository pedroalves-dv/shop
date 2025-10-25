import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const { variantId, quantity = 1 } = req.body || {};

  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 25) {
            edges { 
              node { 
                id 
                quantity 
                merchandise { 
                  ... on ProductVariant { 
                    id 
                    product { title } 
                  } 
                } 
              } 
            }
          }
        }
        userErrors { message field }
      }
    }
  `;

  try {
    const variables = {
      input: variantId ? { lines: [{ merchandiseId: variantId, quantity }] } : { lines: [] }
    };

    const response = await axios.post(
      `https://${domain}/api/2025-01/graphql.json`,
      { query: mutation, variables },
      { headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' } }
    );
    // Defensive checks: Shopify may return `errors` or a missing `data` key on auth failure
    if (!response?.data) {
      console.error('No response.data from Shopify', response);
      return res.status(500).json({ error: 'No response from Shopify' });
    }

    if (response.data.errors) {
      console.error('Shopify GraphQL errors:', response.data.errors);
      return res.status(500).json({ error: response.data.errors });
    }

    const payload = response.data.data?.cartCreate;
    if (!payload) {
      console.error('Unexpected Shopify response shape:', response.data);
      return res.status(500).json({ error: 'Unexpected Shopify response', raw: response.data });
    }

    if (payload.userErrors?.length) {
      console.error('Shopify userErrors:', payload.userErrors);
      return res.status(400).json({ error: payload.userErrors });
    }

    // Map cart response to checkout-like format for backwards compatibility
    const cart = payload.cart;
    return res.status(200).json({ 
      checkout: {
        id: cart.id,
        webUrl: cart.checkoutUrl,
        lineItems: cart.lines
      }
    });
  } catch (err) {
    console.error('API /checkout/create error', err && err.message ? err.message : err, err?.response?.data || '');
    const message = err?.response?.data || err?.message || 'unknown error';
    return res.status(500).json({ error: message });
  }
}
