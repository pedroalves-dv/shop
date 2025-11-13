import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission (you can add actual API call later)
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Message sent! We\'ll get back to you soon.', {
      duration: 3000,
      style: {
        height: 'calc(var(--header-height) - 13px)',
      }
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    setLoading(false);
  };

  return (
    <div className="container product-page-container">
      {/* Contact Form Card */}
      <div className="product-card product-card--spaced">
        {/* Header section */}
        <div style={{
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-sm) var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link
            href="/"
            style={{ 
              fontSize: 'var(--font-xs)',
              color: 'var(--color-text-muted)',
              display: 'inline-block',
              transition: 'color var(--transition-fast)',
              letterSpacing: '0.05em',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
          >
            ← Home
          </Link>
        </div>

        {/* Content */}
        <div className="contact-content" style={{
          padding: 'var(--space-xl) var(--space-lg)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {/* Left Column - Title & Description */}
          <div className="contact-intro">
            <h1 style={{ 
              fontSize: 'var(--font-2xl)',
              fontWeight: 500,
              margin: 0,
              marginBottom: 'var(--space-sm)',
              letterSpacing: '-0.02em',
              color: 'var(--color-primary)'
            }}>
              Get in Touch
            </h1>

            <p style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-xl)',
              lineHeight: 1.6
            }}>
              Have a question or want to work together? Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          {/* Right Column - Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label 
                htmlFor="name"
                style={{
                  display: 'block',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 500,
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--space-xs)'
                }}
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  fontSize: 'var(--font-sm)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius)',
                  fontFamily: 'var(--font-sans)',
                  transition: 'border-color var(--transition-fast)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label 
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 500,
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--space-xs)'
                }}
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  fontSize: 'var(--font-sm)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius)',
                  fontFamily: 'var(--font-sans)',
                  transition: 'border-color var(--transition-fast)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            {/* Message Field */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label 
                htmlFor="message"
                style={{
                  display: 'block',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 500,
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--space-xs)'
                }}
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="6"
                value={formData.message}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  fontSize: 'var(--font-sm)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius)',
                  fontFamily: 'var(--font-sans)',
                  resize: 'vertical',
                  transition: 'border-color var(--transition-fast)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: 'var(--space-md) var(--space-2xl)',
                fontSize: 'var(--font-base)',
                fontWeight: 400,
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--border-radius)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-fast)',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.color = 'var(--color-primary)';
                  
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = '#fff';
                  
                }
              }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
