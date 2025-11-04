import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{
      borderTop: '1px solid var(--color-primary)',
      marginTop: 'auto', // Push footer to bottom
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
          display: 'grid',
          gridTemplateColumns: '1fr', // Stack on mobile
          gap: 'var(--space-lg)',
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
              textDecoration: 'none'
            }}>
              Proto
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
          <div className="footer-links" style={{
            display: 'flex',
            flexDirection: 'column', // Stack columns on mobile
            gap: 'var(--space-lg)',
            justifyContent: 'flex-start'
          }}>
            {/* Column 1 */}
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
                Shop
              </h3>
              <Link href="/" style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)'
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
              <Link href="#" style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                About
              </Link>
              <Link href="#" style={{
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

            {/* Column 3 */}
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
                Legal
              </h3>
              <Link href="#" style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                Privacy
              </Link>
              <Link href="#" style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                Terms
              </Link>
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
            © {currentYear} Proto. All rights reserved.
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
