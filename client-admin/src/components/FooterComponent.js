import React, { Component } from 'react';
import './FooterComponent.css';

class Footer extends Component {
  render() {
    const managementLinks = ['Dashboard', 'Products', 'Categories', 'Orders', 'Users'];
    const systemLinks = ['Settings', 'Analytics', 'Reports', 'API Integration', 'System Logs'];
    const helpLinks = ['Admin Guide', 'Support Tickets', 'System Status', 'Updates', 'Contact IT'];

    return (
      <footer className="footer-luxury">
        <div className="footer-container">
          <div className="footer-grid mb-12">
            {/* Logo & Slogan */}
            <div className="footer-logo-section lg-col-span-2">
              <div className="flex-logo mb-4">
                <div className="logo-icon-round bg-bronze flex-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-black">
                    <line x1="6" y1="4" x2="6" y2="20" />
                    <line x1="6" y1="12" x2="18" y2="12" />
                    <circle cx="18" cy="12" r="2" />
                  </svg>
                </div>
                <h2 className="text-2xl text-white font-serif tracking-wider">CUE MASTER</h2>
              </div>
              <p className="text-gray-400 font-sans mb-6">
                Secure Administration & Management Portal. Your premier destination for professional management.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bronze mt-1 flex-shrink-0 w-18 h-18">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Admin HQ, Suite 100<br />New York, NY 10001</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bronze flex-shrink-0 w-18 h-18">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>IT Support: 1-800-555-0199</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bronze flex-shrink-0 w-18 h-18">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>admin-support@cuemaster.com</span>
                </div>
              </div>
            </div>

            {/* Management */}
            <div>
              <h3 className="text-white mb-4 text-lg font-serif">Management</h3>
              <ul className="space-y-2">
                {managementLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-gray-400 hover-bronze transition-colors text-sm font-sans">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* System */}
            <div>
              <h3 className="text-white mb-4 text-lg font-serif">System</h3>
              <ul className="space-y-2">
                {systemLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-gray-400 hover-bronze transition-colors text-sm font-sans">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help & Resources */}
            <div>
              <h3 className="text-white mb-4 text-lg font-serif">Help & Resources</h3>
              <ul className="space-y-2">
                {helpLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-gray-400 hover-bronze transition-colors text-sm font-sans">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media & Status */}
          <div className="footer-bottom-section border-t-tertiary pt-8">
            <div className="flex-between-md items-center gap-6">
              {/* Social Media */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm mr-2 font-sans">Follow Us:</span>
                <a href="#" className="social-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="social-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="social-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
              </div>

              {/* Status Methods */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm font-sans">Status:</span>
                <div className="flex gap-2">
                  <div className="payment-badge">INTERNAL</div>
                  <div className="payment-badge">SECURE</div>
                  <div className="payment-badge">VERIFIED</div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-copyright mt-8 pt-8 border-t-tertiary">
            <p className="text-gray-500 text-sm font-sans">© 2026 Cue Master Admin Portal. All rights reserved. | Confidential & Proprietary</p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;