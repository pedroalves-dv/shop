// Import Next.js components for navigation and optimized images
import Link from 'next/link';
import Image from 'next/image';
// Import our custom cart context to add items to cart
import { useCart } from '../context/CartContext';
// Import React's useState hook to track hover state
import { useState } from 'react';

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
  
  // Track whether the user is hovering over the product image (for 3D effect)
  // NOTE: This state is defined at the card level so BOTH the card wrapper AND
  // the image can react to the hover. When isHovered=true, we can style both:
  // - The card wrapper (parent) - removes top border
  // - The image container (child) - adds border and translates position
  const [isHovered, setIsHovered] = useState(false);

  return (
    // Main card container with flexbox layout (stacks children vertically)
    <div style={{ 
      display: 'flex',
      flexDirection: 'column', // Stack children top to bottom
      height: '100%', // Take full height available
      border: '1px solid var(--color-border)', // Border using CSS custom property
      // Make top and right borders transparent when image is hovered - keeps same size, hides borders
      borderTop: isHovered ? '1px solid transparent' : '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius)', // Rounded corners
      overflow: 'visible', // Allow 3D effect to extend beyond card
      backgroundColor: '#fff' // White background
    }}>
  
      {/* Image Section - Creates a clickable product image with 3D hover effect */}
      <Link 
        href={`/product/${encodeURIComponent(product.handle ?? product.id)}`} // Navigate to product detail page
        style={{ opacity: 1 }} // Keep link fully visible
        // These mouse events keep opacity at 1 (disabled the default link hover effect)
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
      >
        {/* Only render image if product has one */}
        {product.image && (
          // OUTER CONTAINER: Holds all 3 layers
          // - Main image box (the actual product photo)
          // - Right shadow strip (3D extrusion)
          // - Bottom shadow strip (3D extrusion)
          <div 
            style={{
              position: 'relative', // Needed for positioning child elements
              overflow: 'visible', // Allow 3D shadows to show outside
              aspectRatio: '1 / 1', // Keep image square (width = height)
              cursor: 'pointer', // Show hand cursor on hover
              borderBottom: '1px solid var(--color-border)', // Separate from info section
              // Move image up and left when hovered to create 3D effect
              transform: isHovered ? 'translate(-4px, -4px)' : 'translate(0, 0)',
              transition: 'transform var(--transition-fast)', // Smooth animation
              borderRadius: 'var(--border-radius) var(--border-radius) 0 0', // Rounded top corners only
              // Clip path controls what's visible - removes clipping on hover to show border
              // clipPath: isHovered ? 'none' : 'inset(0 0 0 0 round var(--border-radius) var(--border-radius) 0 0)'
            }}
            // Update hover state when mouse enters/leaves
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* ========================================
                LAYER 1: MAIN IMAGE BOX (zIndex: 3)
                This is the actual product image you see
                ======================================== */}
            <div style={{
              position: 'relative', // Needed for Image component
              width: '100%',
              height: '100%',
              backgroundColor: 'var(--color-bg-secondary)', // Background while image loads
              border: isHovered ? '1px solid var(--color-primary)' : 'none', // Add border on hover
              transition: 'border var(--transition-fast)', // Smooth border transition
              zIndex: 3, // Stack above the 3D shadow faces ← THIS IS THE MAIN IMAGE BOX
              marginBottom: '-1px', // Prevent double border with info section
              borderRadius: '0', // Rounded top corners
              overflow: 'hidden' // Ensure image doesn't exceed rounded corners
            }}>
              {/* Next.js Image component - automatically optimizes images */}
              <Image 
                src={product.image} // Image URL
                alt={product.imageAlt || product.title} // Alt text for accessibility
                width={600} // Increased from 240 for better quality on all screen sizes
                height={600}
                priority={priority} // Load immediately if above the fold
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', // Crop/scale to fit container
                  display: 'block' // Remove extra spacing below image
                }} 
              />
            </div>
            
            {/* ========================================
                LAYER 2: RIGHT EXTRUSION (zIndex: 2)
                3D shadow strip on the right side
                ======================================== */}
            <div style={{
              position: 'absolute', // Position over the image container
              top: 0,
              right: '-4px', // Position outside the right edge
              width: '4px', // Thin vertical strip
              height: '100%',
              backgroundColor: 'var(--color-primary)', // Dark color for shadow effect
              // Scale from 0 to full size on hover, skew creates 3D angle
              transform: isHovered ? 'skewY(45deg)' : 'scaleY(0)',
              transformOrigin: 'top left', // Anchor point for transform
              transition: 'transform var(--transition-fast)', // Smooth animation
              zIndex: 2 // Behind the main image ← THIS IS THE RIGHT EXTRUSION
            }} />
            
            {/* ========================================
                LAYER 3: BOTTOM EXTRUSION (zIndex: 2)
                3D shadow strip on the bottom
                ======================================== */}
            <div style={{
              position: 'absolute', // Position over the image container
              bottom: '-4px', // Position outside the bottom edge
              left: 0,
              width: '100%',
              height: '4px', // Thin horizontal strip
              backgroundColor: 'var(--color-primary)',
              // Scale from 0 to full size on hover, skew creates 3D angle
              transform: isHovered ? 'skewX(45deg)' : 'scaleX(0)',
              transformOrigin: 'top left', // Anchor point for transform
              transition: 'transform var(--transition-fast)', // Smooth animation
              zIndex: 2 // Behind the main image ← THIS IS THE BOTTOM EXTRUSION
            }} />
          </div>
        )}
      </Link>

      {/* Product Information Section - Title and Price */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column', // Stack title and price vertically
        justifyContent: 'flex-end', // Align to top
        gap: '0.25rem', // Minimal space between title and price (4px)
        flex: 1, // Take up remaining space to push button to bottom
        padding: 'var(--space-sm)', // Inner spacing
        borderBottom: '1px solid var(--color-border)' // Separate from button section
      }}>
        {/* Clickable product title - links to product detail page */}
        <Link href={`/product/${encodeURIComponent(product.handle ?? product.id)}`}>
          <h3 style={{ 
            fontSize: 'var(--font-base)', // Regular text size
            fontWeight: 400, // Normal weight (not bold)
            margin: 0, // Remove default heading margins
            color: 'var(--color-primary)', // Primary text color
            letterSpacing: '-0.01em' // Slightly tighter letter spacing
          }}>
            {product.title} {/* Display the product name */}
          </h3>
        </Link>
        
        {/* Price display */}
        <p style={{ 
          margin: 0, // Remove default paragraph margins
          fontSize: 'var(--font-sm)', // Smaller than title
          color: 'var(--color-text-muted)', // Muted/gray color
          fontWeight: 400 // Normal weight
        }}>
          ${price} {/* Display the price with dollar sign */}
        </p>
      </div>

      {/* Action Button Section */}
      <div style={{ padding: 'var(--space-sm)' }}> {/* Padding around button */}
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
        style={{ 
          padding: 'var(--space-sm) var(--space-md)', // Vertical and horizontal padding
          fontSize: 'var(--font-sm)', // Small font size
          fontWeight: 400, // Normal weight
          border: `1px solid ${isOutOfStock ? '#ccc' : 'var(--color-primary)'}`, // Gray border if out of stock
          backgroundColor: 'transparent', // See-through background initially
          color: isOutOfStock ? '#999' : 'var(--color-text)', // Gray text if out of stock
          borderRadius: 'var(--border-radius)', // Rounded corners
          cursor: (loading || isOutOfStock) ? 'not-allowed' : 'pointer', // Change cursor based on state
          transition: 'all var(--transition-fast)', // Smooth transitions for all properties
          width: '100%', // Full width of container
          opacity: isOutOfStock ? 0.6 : 1 // Make button semi-transparent when out of stock
        }}
        // On hover, fill button with primary color and change text to white
        // BUT only if product is in stock
        onMouseEnter={(e) => {
          if (!loading && !isOutOfStock) { // Only apply hover effect if not loading and in stock
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
          }
        }}
        // On mouse leave, reset to transparent background
        onMouseLeave={(e) => {
          if (!isOutOfStock) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-text)';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
          } else {
            // Keep gray styling for out of stock
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#999';
            e.currentTarget.style.borderColor = '#ccc';
          }
        }}
      >
        {/* Show different text based on stock status and loading state */}
        {isOutOfStock ? 'Out of Stock' : (loading ? 'Adding…' : 'Add to Cart')}
      </button>
      </div>
    </div>
  );
}