/*
  ProductCard component
  - What it is: a reusable product tile used in listing grids and small product lists.
  - What it controls (CSS classes): .product-card, .product-image-wrap, .product-image-box,
    .extrusion-right, .extrusion-bottom, .product-info, .product-action, .product-button
  - Notes: purely presentational; Add-to-cart behavior is triggered via CartContext.
*/
// Import Next.js components for navigation and optimized images
import Link from 'next/link';
import Image from 'next/image';
// Import our custom cart context to add items to cart
import { useCart } from '../context/CartContext';
// Import React's useState hook to track hover state
// no local state required for hover (handled by CSS)

// Main ProductCard component - displays a single product with image, title, price, and add to cart button
// Props:
// - product: object containing product data (title, image, variants, etc.)
// - priority: boolean for image loading priority (used for above-the-fold images)
export default function ProductCard({ product, priority = false }) {
  // Extract the price from the first variant, or show 'N/A' if not available
  // The "?." is optional chaining - it safely accesses nested properties
  const price = product?.variants?.[0]?.price ?? 'N/A';
  
  // Check if product is available for sale and has stock
  const firstVariant = product?.variants?.[0];
  const isOutOfStock = !firstVariant?.availableForSale || firstVariant?.quantityAvailable === 0;
  
  // Get the addToCart function and loading state from our CartContext
  const { addToCart, loading } = useCart();
  
  // Hover state is handled in CSS (product-image-wrap :hover) so no local state needed

  return (
    // Main card container with flexbox layout (stacks children vertically)
    <div className="product-card">
  
      {/* Image Section - Creates a clickable product image with 3D hover effect */}
      <Link
        href={`/product/${encodeURIComponent(product.handle ?? product.id)}`} // Navigate to product detail page
      >
        {/* Only render image if product has one */}
        {product.image && (
          // OUTER CONTAINER: Holds all 3 layers
          // - Main image box (the actual product photo)
          // - Right shadow strip (3D extrusion)
          // - Bottom shadow strip (3D extrusion)
          <div
            className="product-image-wrap"
          >
            {/* ========================================
                LAYER 1: MAIN IMAGE BOX (zIndex: 3)
                This is the actual product image you see
                ======================================== */}
            <div className="product-image-box">
              {/* Next.js Image component - automatically optimizes images */}
              <Image 
                src={product.image} // Image URL
                alt={product.imageAlt || product.title} // Alt text for accessibility
                width={600} // Increased from 240 for better quality on all screen sizes
                height={600}
                priority={priority} // Load immediately if above the fold
                className="product-img"
              />
            </div>
            
            {/* Right and bottom extrusion layers */}
            <div className="extrusion-right" />
            <div className="extrusion-bottom" />
          </div>
        )}
      </Link>

      {/* Product Information Section - Title and Price */}
      <div className="product-info">
        {/* Clickable product title - links to product detail page */}
        <Link href={`/product/${encodeURIComponent(product.handle ?? product.id)}`}>
          <h3>{product.title}</h3>
        </Link>
        
        {/* Price display */}
        <p>${price}</p>
      </div>

      {/* Action Button Section */}
      <div className="product-action"> {/* Padding around button */}
      <button
        // When clicked, add the first variant of this product to the cart
        // BUT only if the product is in stock!
        onClick={async () => {
          // Don't do anything if out of stock
          if (isOutOfStock) return;
          
          // Check if product has variants available
          if (!product.variants || product.variants.length === 0) return;
          // Add first variant with quantity of 1 to cart (async operation)
          await addToCart(product.variants[0].id, 1);
        }}
        disabled={loading || isOutOfStock} // Disable button while adding to cart OR if out of stock
        className={`product-button ${isOutOfStock ? 'out-of-stock' : ''} ${loading ? 'loading' : ''}`}
      >
        {/* Show different text based on stock status and loading state */}
        {isOutOfStock ? 'Out of Stock' : (loading ? 'Adding…' : 'Add to Cart')}
      </button>
      </div>
    </div>
  );
}