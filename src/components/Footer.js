import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <p className="footer-copyright">
              © 2026 BeatAI. Open Source under MIT License.
            </p>
          </div>

          <div className="footer-links">
            <Link to="/">Docs</Link>
            <a href="#api">API</a>
            <a href="https://github.com/loong-ai" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#blog">Blog</a>
          </div>

          <div className="footer-social">
            <a href="https://github.com/loong-ai" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
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
