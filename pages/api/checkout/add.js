import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const { checkoutId, variantId, quantity = 1 } = req.body || {};

  try {
    if (!variantId) return res.status(400).json({ error: 'variantId is required' });
    if (!checkoutId) {
      // create a new cart directly via Shopify (new Cart API for 2024+)
      const createMutation = `
        mutation cartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart { 
              id 
              checkoutUrl
              cost {
                totalAmount { amount currencyCode }
                subtotalAmount { amount currencyCode }
              }
              lines(first:25){ 
                edges{ 
                  node{ 
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
            userErrors { message field }
          }
        }
      `;

      const variables = { input: { lines: [{ merchandiseId: variantId, quantity }] } };
      console.log('📤 Sending to Shopify cartCreate - variantId:', variantId, 'quantity:', quantity);
      console.log('📤 Variables:', JSON.stringify(variables, null, 2));
      
      const response = await axios.post(
        `https://${domain}/api/2025-01/graphql.json`,
        { query: createMutation, variables },
        { headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' } }
      );

      if (!response?.data) {
        console.error('No response.data from Shopify (create in add)', response);
        return res.status(500).json({ error: 'No response from Shopify' });
      }

      if (response.data.errors) {
        console.error('Shopify GraphQL errors (create in add):', response.data.errors);
        
        // Check if it's a throttling error
        const isThrottled = response.data.errors.some(err => err.extensions?.code === 'THROTTLED');
        if (isThrottled) {
          return res.status(429).json({ 
            error: 'Too many requests. Please wait a moment and try again.',
            code: 'THROTTLED' 
          });
        }
        
        return res.status(500).json({ error: response.data.errors });
      }

      const payload = response.data.data?.cartCreate;
      if (!payload) {
        console.error('Unexpected Shopify response (create in add):', response.data);
        return res.status(500).json({ error: 'Unexpected Shopify response', raw: response.data });
      }

      console.log('✅ Shopify cartCreate response:', JSON.stringify(payload, null, 2));

      if (payload.userErrors?.length) {
        console.error('Shopify userErrors (create in add):', payload.userErrors);
        return res.status(400).json({ error: payload.userErrors });
      }

      // Check if Shopify returned quantity 0 (likely inventory issue)
      let cart = payload.cart;
      const firstLine = cart?.lines?.edges?.[0]?.node;
      if (firstLine && firstLine.quantity === 0) {
        console.error('⚠️ Shopify returned quantity 0 - likely inventory tracking issue!');
        console.error('⚠️ Check Shopify admin: Product may have 0 inventory or inventory tracking enabled');
        return res.status(400).json({ 
          error: 'Product unavailable - likely out of stock. Check Shopify product inventory settings.',
          details: 'Shopify returned quantity 0. Enable inventory or add stock in Shopify admin.'
        });
      }

      // Map cart response to checkout-like format for backwards compatibility
      console.log('🔍 Raw cart.lines from Shopify:', JSON.stringify(cart.lines, null, 2));
      
      const checkout = {
        id: cart.id,
        webUrl: cart.checkoutUrl,
        lineItems: cart.lines,
        cost: cart.cost
      };
      
      console.log('📤 Sending checkout response:', JSON.stringify(checkout, null, 2));
      
      return res.status(200).json({ checkout });
    }

    // Add lines to existing cart (new Cart API)
    const mutation = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { 
            id 
            checkoutUrl
            cost {
              totalAmount { amount currencyCode }
              subtotalAmount { amount currencyCode }
            }
            lines(first:25){ 
              edges{ 
                node{ 
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
          userErrors { message field }
        }
      }
    `;

    const variables = { cartId: checkoutId, lines: [{ merchandiseId: variantId, quantity }] };

    const response = await axios.post(
      `https://${domain}/api/2025-01/graphql.json`,
      { query: mutation, variables },
      { headers: { 'X-Shopify-Storefront-Access-Token': token, 'Content-Type': 'application/json' } }
    );

    if (!response?.data) {
      console.error('No response.data from Shopify (add lines)', response);
      return res.status(500).json({ error: 'No response from Shopify' });
    }

    if (response.data.errors) {
      console.error('Shopify GraphQL errors (add lines):', response.data.errors);
      
      // Check if it's a throttling error
      const isThrottled = response.data.errors.some(err => err.extensions?.code === 'THROTTLED');
      if (isThrottled) {
        // Tell frontend to clear cart and retry
        return res.status(410).json({ 
          error: 'Cart expired. Please try again.',
          code: 'CART_EXPIRED',
          clearCart: true
        });
      }
      
      return res.status(500).json({ error: response.data.errors });
    }

    const payload = response.data.data?.cartLinesAdd;
    if (!payload) {
      console.error('Unexpected Shopify response (add lines):', response.data);
      return res.status(500).json({ error: 'Unexpected Shopify response', raw: response.data });
    }

    if (payload.userErrors?.length) {
      console.error('Shopify userErrors (add lines):', payload.userErrors);
      return res.status(400).json({ error: payload.userErrors });
    }

    // Map cart response to checkout-like format for backwards compatibility
    const cart = payload.cart;
    return res.status(200).json({ 
      checkout: {
        id: cart.id,
        webUrl: cart.checkoutUrl,
        lineItems: cart.lines,
        cost: cart.cost
      }
    });
  } catch (err) {
    console.error('❌❌❌ API /checkout/add FATAL ERROR ❌❌❌');
    console.error('Error message:', err.message);
    console.error('Error response data:', JSON.stringify(err?.response?.data, null, 2));
    console.error('Full error:', err);
    
    const shopifyError = err?.response?.data?.errors || err?.response?.data;
    const message = shopifyError || err?.message || 'Unknown error occurred while adding to cart';
    
    return res.status(500).json({ 
      error: 'Unable to add item to cart', 
      details: typeof message === 'string' ? message : JSON.stringify(message),
      debug: {
        message: err.message,
        responseData: err?.response?.data
      }
    });
  }
}
