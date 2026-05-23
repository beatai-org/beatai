import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
import { SITE_CONFIG } from '../utils/siteConfig';

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
            <Link to="/">Docs</Link>
            <a href="#api">API</a>
            <a href={SITE_CONFIG.links.githubOrgUrl} target="_blank" rel="noopener noreferrer">{SITE_CONFIG.labels.github}</a>
            <a href="#blog">Blog</a>
          </div>

          <div className="footer-social">
            <a href={SITE_CONFIG.links.githubOrgUrl} target="_blank" rel="noopener noreferrer" aria-label={SITE_CONFIG.labels.github}>
              <FaGithub />
            </a>
            <a href="#twitter" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#discord" aria-label="Discord">
              <FaDiscord />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
