import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{
      borderTop: '1px solid var(--color-primary)',
      marginTop: 'var(--space-xl)', // Push footer to bottom
      backgroundColor: 'var(--color-bg)'
    }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: 'var(--space-xl) var(--container-padding)', // Responsive padding
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-lg)'
      }}>
        {/* Top Section - Brand and Links - Responsive grid */}
        <div className="footer-top" style={{
          paddingBottom: 'var(--space-lg)',
          borderBottom: '1px solid var(--color-border)'
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{
              fontSize: 'var(--font-lg)',
              fontWeight: 500,
              color: 'var(--color-primary)',
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              
            }}>
              Prototype
            </Link>
            <p style={{
              marginTop: 'var(--space-xs)',
              fontSize: 'var(--font-sm)',
              color: 'var(--color-text-muted)',
              maxWidth: '300px'
            }}>
              Minimal e-commerce for modern products.
            </p>
          </div>

          {/* Links - Stack on mobile, side by side on desktop */}
          <div className="footer-links">
            {/* Column 1 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              // width: '100px',
            }}>
              <h3 style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 500,
                color: 'var(--color-primary)',
                marginBottom: 'var(--space-xs)'
              }}>
                Shop
              </h3>
              <Link href="/products" style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                All Products
              </Link>
            </div>

            {/* Column 2 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-xs)'
            }}>
              <h3 style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 500,
                color: 'var(--color-primary)',
                marginBottom: 'var(--space-xs)'
              }}>
                Info
              </h3>
              <Link href="/contact" style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                Contact
              </Link>
            </div>

            {/* Column 3 - Legal/Policies */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-xs)'
            }}>
              <h3 style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 500,
                color: 'var(--color-primary)',
                marginBottom: 'var(--space-xs)'
              }}>
                Policies
              </h3>
              <a 
                href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/policies/refund-policy`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                  transition: 'color var(--transition-fast)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                Refund Policy
              </a>
              <a 
                href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/policies/shipping-policy`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                  transition: 'color var(--transition-fast)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                Shipping Policy
              </a>
              <a 
                href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/policies/privacy-policy`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                  transition: 'color var(--transition-fast)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                Privacy Policy
              </a>
              <a 
                href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/policies/terms-of-service`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                  transition: 'color var(--transition-fast)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                Terms of Service
              </a>
            </div>

            {/* Column 4 - Newsletter */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-xs)',
              minWidth: '280px'
            }}>
              <h3 style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 500,
                color: 'var(--color-primary)',
                marginBottom: 'var(--space-xs)'
              }}>
                Newsletter
              </h3>
              <p style={{
                fontSize: 'var(--font-xs)',
                color: 'var(--color-text-muted)',
                margin: '0 0 var(--space-xs) 0',
                lineHeight: 1.2,
              }}>
                Subscribe to our newsletter to get updates on new products and special offers.
              </p>
              <form 
                style={{
                  display: 'flex',
                  gap: 'var(--space-xs)',
                  flexDirection: 'column'
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  // TODO: Implement newsletter signup
                  alert(`Thanks for subscribing with ${email}!`);
                  e.target.reset();
                }}
              >
                <input 
                  type="email" 
                  name="email"
                  placeholder="your@email.com"
                  required
                  style={{
                    padding: 'var(--space-sm)',
                    fontSize: 'var(--font-sm)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius)',
                    outline: 'none',
                    transition: 'border-color var(--transition-fast)',
                    width: '100%'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                />
                <button 
                  type="submit"
                  style={{
                    padding: 'var(--space-sm)',
                    fontSize: 'var(--font-sm)',
                    fontWeight: 500,
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = '#fff';
                  }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright - Stack on mobile */}
        <div className="footer-bottom" style={{
          display: 'flex',
          flexDirection: 'column', // Stack on mobile
          gap: 'var(--space-sm)',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--color-text-muted)',
            margin: 0
          }}>
            © {currentYear} Prototype. All rights reserved.
          </p>
          
          <p style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--color-text-muted)',
            margin: 0
          }}>
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
