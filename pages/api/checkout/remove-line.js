import axios from 'axios';

const STOREFRONT_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`;
const STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cartId, lineId } = req.body;

  if (!cartId || !lineId) {
    return res.status(400).json({ error: 'Missing required fields: cartId, lineId' });
  }

  const mutation = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    image {
                      url
                      altText
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      STOREFRONT_API_URL,
      {
        query: mutation,
        variables: {
          cartId,
          lineIds: [lineId]
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN
        }
      }
    );

    if (response.data.errors) {
      console.error('GraphQL errors:', response.data.errors);
      return res.status(500).json({ error: 'GraphQL errors', details: response.data.errors });
    }

    const { cart, userErrors } = response.data.data.cartLinesRemove;

    if (userErrors && userErrors.length > 0) {
      console.error('User errors:', userErrors);
      return res.status(400).json({ error: 'User errors', details: userErrors });
    }

    if (!cart) {
      return res.status(500).json({ error: 'No cart returned from Shopify' });
    }

    // Map to checkout-like format for compatibility
    const checkout = {
      id: cart.id,
      webUrl: cart.checkoutUrl,
      lineItems: cart.lines,
      cost: cart.cost
    };

    return res.status(200).json({ checkout });
  } catch (error) {
    console.error('Remove line error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to remove item', details: error.message });
  }
}
