import React from 'react';
import { FaGithub, FaHeart } from 'react-icons/fa';
import { SITE_CONFIG } from '../../utils/siteConfig';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* BeatAI 简介 */}
        <div className="footer-brand">
          <span className="footer-logo">{SITE_CONFIG.brandName}</span>
          <span className="footer-separator">·</span>
          <span className="footer-description">让 AI 更简单</span>
        </div>

        {/* GitHub 链接 */}
        <a
          href={SITE_CONFIG.links.githubOrgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-github-link"
        >
          <FaGithub className="footer-github-icon" />
          <span>{SITE_CONFIG.labels.github}</span>
        </a>

        {/* Made with ❤️ */}
        <div className="footer-made-with">
          Made with <FaHeart className="footer-heart-icon" /> by 创世实验室
        </div>
      </div>
    </footer>
  );
};

export default Footer;
