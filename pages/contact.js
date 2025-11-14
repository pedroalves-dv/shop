/*
  Contact page (pages/contact.js)
  - What it is: contact form page used to collect messages from users.
  - What it controls (CSS classes): .contact-header, .contact-content, .contact-intro,
    .contact-form, .contact-input, .contact-textarea, .contact-submit-button
  - Notes: form currently uses a simulated submission; toast styling is runtime-only.
*/
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
        <div className="contact-header">
          <Link href="/" className="contact-back-link">← Home</Link>
        </div>

        {/* Content */}
        <div className="contact-content">
          {/* Left Column - Title & Description */}
          <div className="contact-intro">
            <h1>Get in Touch</h1>

            <p>
              Have a question or want to work together? Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          {/* Right Column - Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="contact-field">
              <label htmlFor="name" className="contact-label">Name *</label>
              <input
                className="contact-input"
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email Field */}
            <div className="contact-field">
              <label htmlFor="email" className="contact-label">Email *</label>
              <input
                className="contact-input"
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Message Field */}
            <div className="contact-field">
              <label htmlFor="message" className="contact-label">Message *</label>
              <textarea
                className="contact-textarea"
                id="message"
                name="message"
                required
                rows="6"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="contact-submit-button"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
