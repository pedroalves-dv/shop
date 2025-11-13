import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-primary)",
        marginTop: "var(--space-xl)", // Push footer to bottom
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "var(--space-xl) var(--container-padding)", // Responsive padding
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-lg)",
        }}
      >
        {/* Top Section - Brand and Links - Responsive grid */}
        <div
          className="footer-top"
          style={{
            paddingBottom: "var(--space-lg)",
            // borderBottom: '1px solid var(--color-border)'
          }}
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                fontSize: "var(--font-lg)",
                fontWeight: 500,
                color: "var(--color-primary)",
                letterSpacing: "-0.01em",
                textDecoration: "none",
              }}
            >
              Prototype
            </Link>
            <p
              style={{
                marginTop: "var(--space-xs)",
                fontSize: "var(--font-sm)",
                color: "var(--color-text-muted)",
                maxWidth: "300px",
              }}
            >
              Thoughtful and functional design.
            </p>

            {/* Social icons */}
            <div
              style={{
                marginTop: "var(--space-xl)",
                display: "flex",
                gap: "var(--space-lg)",
                alignItems: "center",
              }}
            >
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                style={{
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  borderRadius: "6px",
                  transition:
                    "color var(--transition-fast), background var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-muted)";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path d="M18.42,14.009L27.891,3h-2.244l-8.224,9.559L10.855,3H3.28l9.932,14.455L3.28,29h2.244l8.684-10.095,6.936,10.095h7.576l-10.301-14.991h0Zm-3.074,3.573l-1.006-1.439L6.333,4.69h3.447l6.462,9.243,1.006,1.439,8.4,12.015h-3.447l-6.854-9.804h0Z"></path>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  borderRadius: "6px",
                  transition:
                    "color var(--transition-fast), background var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-muted)";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path d="M10.202,2.098c-1.49,.07-2.507,.308-3.396,.657-.92,.359-1.7,.84-2.477,1.619-.776,.779-1.254,1.56-1.61,2.481-.345,.891-.578,1.909-.644,3.4-.066,1.49-.08,1.97-.073,5.771s.024,4.278,.096,5.772c.071,1.489,.308,2.506,.657,3.396,.359,.92,.84,1.7,1.619,2.477,.779,.776,1.559,1.253,2.483,1.61,.89,.344,1.909,.579,3.399,.644,1.49,.065,1.97,.08,5.771,.073,3.801-.007,4.279-.024,5.773-.095s2.505-.309,3.395-.657c.92-.36,1.701-.84,2.477-1.62s1.254-1.561,1.609-2.483c.345-.89,.579-1.909,.644-3.398,.065-1.494,.081-1.971,.073-5.773s-.024-4.278-.095-5.771-.308-2.507-.657-3.397c-.36-.92-.84-1.7-1.619-2.477s-1.561-1.254-2.483-1.609c-.891-.345-1.909-.58-3.399-.644s-1.97-.081-5.772-.074-4.278,.024-5.771,.096m.164,25.309c-1.365-.059-2.106-.286-2.6-.476-.654-.252-1.12-.557-1.612-1.044s-.795-.955-1.05-1.608c-.192-.494-.423-1.234-.487-2.599-.069-1.475-.084-1.918-.092-5.656s.006-4.18,.071-5.656c.058-1.364,.286-2.106,.476-2.6,.252-.655,.556-1.12,1.044-1.612s.955-.795,1.608-1.05c.493-.193,1.234-.422,2.598-.487,1.476-.07,1.919-.084,5.656-.092,3.737-.008,4.181,.006,5.658,.071,1.364,.059,2.106,.285,2.599,.476,.654,.252,1.12,.555,1.612,1.044s.795,.954,1.051,1.609c.193,.492,.422,1.232,.486,2.597,.07,1.476,.086,1.919,.093,5.656,.007,3.737-.006,4.181-.071,5.656-.06,1.365-.286,2.106-.476,2.601-.252,.654-.556,1.12-1.045,1.612s-.955,.795-1.608,1.05c-.493,.192-1.234,.422-2.597,.487-1.476,.069-1.919,.084-5.657,.092s-4.18-.007-5.656-.071M21.779,8.517c.002,.928,.755,1.679,1.683,1.677s1.679-.755,1.677-1.683c-.002-.928-.755-1.679-1.683-1.677,0,0,0,0,0,0-.928,.002-1.678,.755-1.677,1.683m-12.967,7.496c.008,3.97,3.232,7.182,7.202,7.174s7.183-3.232,7.176-7.202c-.008-3.97-3.233-7.183-7.203-7.175s-7.182,3.233-7.174,7.203m2.522-.005c-.005-2.577,2.08-4.671,4.658-4.676,2.577-.005,4.671,2.08,4.676,4.658,.005,2.577-2.08,4.671-4.658,4.676-2.577,.005-4.671-2.079-4.676-4.656h0"></path>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                style={{
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  borderRadius: "6px",
                  transition:
                    "color var(--transition-fast), background var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-muted)";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path d="M24.562,7.613c-1.508-.983-2.597-2.557-2.936-4.391-.073-.396-.114-.804-.114-1.221h-4.814l-.008,19.292c-.081,2.16-1.859,3.894-4.039,3.894-.677,0-1.315-.169-1.877-.465-1.288-.678-2.169-2.028-2.169-3.582,0-2.231,1.815-4.047,4.046-4.047,.417,0,.816,.069,1.194,.187v-4.914c-.391-.053-.788-.087-1.194-.087-4.886,0-8.86,3.975-8.86,8.86,0,2.998,1.498,5.65,3.783,7.254,1.439,1.01,3.19,1.606,5.078,1.606,4.886,0,8.86-3.975,8.86-8.86V11.357c1.888,1.355,4.201,2.154,6.697,2.154v-4.814c-1.345,0-2.597-.4-3.647-1.085Z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Links - Stack on mobile, side by side on desktop */}
          <div className="footer-links">
            {/* Column 1 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // width: '100px',
              }}
            >
              <h3
                style={{
                  fontSize: "var(--font-sm)",
                  fontWeight: 500,
                  color: "var(--color-primary)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                Shop
              </h3>
              <Link
                href="/products"
                style={{
                  fontSize: "var(--font-sm)",
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  transition: "color var(--transition-fast)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }
              >
                All Products
              </Link>
            </div>

            {/* Column 2 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-xs)",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--font-sm)",
                  fontWeight: 500,
                  color: "var(--color-primary)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                Info
              </h3>
              <Link
                href="/contact"
                style={{
                  fontSize: "var(--font-sm)",
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  transition: "color var(--transition-fast)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }
              >
                Contact
              </Link>
            </div>

            {/* Column 3 - Legal/Policies */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-xs)",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--font-sm)",
                  fontWeight: 500,
                  color: "var(--color-primary)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                Policies
              </h3>
              <a
                href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/policies/refund-policy`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "var(--font-sm)",
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  transition: "color var(--transition-fast)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }
              >
                Refund Policy
              </a>
              <a
                href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/policies/shipping-policy`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "var(--font-sm)",
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  transition: "color var(--transition-fast)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }
              >
                Shipping Policy
              </a>
              <a
                href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/policies/privacy-policy`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "var(--font-sm)",
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  transition: "color var(--transition-fast)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }
              >
                Privacy Policy
              </a>
              <a
                href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/policies/terms-of-service`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "var(--font-sm)",
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  transition: "color var(--transition-fast)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }
              >
                Terms of Service
              </a>
            </div>

            {/* Column 4 - Newsletter */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-xs)",
                minWidth: "280px",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--font-sm)",
                  fontWeight: 500,
                  color: "var(--color-primary)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                Newsletter
              </h3>
              <p
                style={{
                  fontSize: "var(--font-xs)",
                  color: "var(--color-text-muted)",
                  margin: "0 0 var(--space-xs) 0",
                  lineHeight: 1.2,
                }}
              >
                Subscribe to our newsletter to get updates on new products and
                special offers.
              </p>
              <form
                style={{
                  display: "flex",
                  gap: "var(--space-xs)",
                  flexDirection: "column",
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
                    padding: "var(--space-sm)",
                    fontSize: "var(--font-sm)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--border-radius)",
                    outline: "none",
                    transition: "border-color var(--transition-fast)",
                    width: "100%",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--color-primary)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--color-border)")
                  }
                />
                <button
                  type="submit"
                  style={{
                    padding: "var(--space-sm)",
                    fontSize: "var(--font-sm)",
                    fontWeight: 500,
                    backgroundColor: "var(--color-primary)",
                    color: "#fff",
                    border: "1px solid var(--color-primary)",
                    borderRadius: "var(--border-radius)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.color = "var(--color-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-primary)";
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
