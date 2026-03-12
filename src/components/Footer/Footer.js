import React from 'react';
import { FaGithub, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* BeatAI 简介 */}
        <div className="footer-brand">
          <span className="footer-logo">BeatAI</span>
          <span className="footer-separator">·</span>
          <span className="footer-description">让 AI 更简单</span>
        </div>

        {/* GitHub 链接 */}
        <a
          href="https://github.com/beatai-org"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-github-link"
        >
          <FaGithub className="footer-github-icon" />
          <span>GitHub</span>
        </a>

        {/* Made with ❤️ */}
        <div className="footer-made-with">
          Made with <FaHeart className="footer-heart-icon" /> by BeatAI 社区
        </div>
      </div>
    </footer>
  );
};

export default Footer;
