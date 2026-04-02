import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './FooterComponent.css';

class Footer extends Component {
  render() {
    const productLinks = ['Billiard Tables', 'Professional Cues', 'Accessories', 'Lighting', 'Custom Orders'];
    const supportLinks = ['Shipping Info', 'Returns', 'Warranty', 'Installation', 'FAQ'];
    const aboutLinks = ['About Us', 'Showrooms', 'Careers', 'Blog', 'Contact'];

    return (
      <footer className="footer-luxury">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Logo & Slogan */}
            <div className="footer-logo-section">
              <div className="footer-logo">
                <div className="logo-icon">⚡</div>
                <h2 className="logo-text">CUE MASTER</h2>
              </div>
              <p className="footer-slogan">
                Excellence in Every Shot. Your premier destination for professional billiard equipment and accessories since 1985.
              </p>

              {/* Contact Info */}
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>123 Championship Avenue, Suite 100<br />New York, NY 10001</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">☎</span>
                  <span>1-800-BILLIARD (1-800-245-5427)</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉</span>
                  <span>info@cuemaster.com</span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="footer-link-section">
              <h3 className="footer-section-title">Products</h3>
              <ul className="footer-links">
                {productLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="footer-link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="footer-link-section">
              <h3 className="footer-section-title">Support</h3>
              <ul className="footer-links">
                {supportLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="footer-link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div className="footer-link-section">
              <h3 className="footer-section-title">About Us</h3>
              <ul className="footer-links">
                {aboutLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="footer-link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider"></div>

          {/* Social Media & Payment */}
          <div className="footer-bottom">
            {/* Social Media */}
            <div className="social-media-section">
              <span className="social-label">Follow Us:</span>
              <div className="social-links">
                <a href="#" className="social-icon" title="Facebook">f</a>
                <a href="#" className="social-icon" title="Instagram">📷</a>
                <a href="#" className="social-icon" title="Twitter">𝕏</a>
                <a href="#" className="social-icon" title="YouTube">▶</a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-section">
              <span className="payment-label">We Accept:</span>
              <div className="payment-methods">
                <div className="payment-badge">VNPAY</div>
                <div className="payment-badge">Momo</div>
                <div className="payment-badge">COD</div>
                <div className="payment-badge">VISA</div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-copyright">
            <p>© 2026 Cue Master. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
