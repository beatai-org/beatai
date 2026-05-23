import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
import { SITE_CONFIG } from '../utils/siteConfig';
import {
  MARKETING_FOOTER_LINKS,
  MARKETING_SOCIAL_LINKS
} from '../utils/pageConfig';

const SOCIAL_ICON_BY_ID = {
  github: <FaGithub />,
  twitter: <FaTwitter />,
  discord: <FaDiscord />
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <p className="footer-copyright">
              © 2026 {SITE_CONFIG.brandName}. Open Source under MIT License.
            </p>
          </div>

          <div className="footer-links">
            {MARKETING_FOOTER_LINKS.map((item) => (
              item.to ? (
                <Link key={item.id} to={item.to}>{item.label}</Link>
              ) : (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </a>
              )
            ))}
          </div>

          <div className="footer-social">
            {MARKETING_SOCIAL_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                aria-label={item.label}
              >
                {SOCIAL_ICON_BY_ID[item.id]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
