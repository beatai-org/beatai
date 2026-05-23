import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import ThemeToggle from './ThemeToggle';
import ThemeSelector from './ThemeSelector';
import { SITE_CONFIG } from '../utils/siteConfig';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <span className="logo-text">{SITE_CONFIG.brandName}</span>
          </div>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <a href="#features">Features</a>
            <a href="#demo">Demo</a>
            <Link to="/">Documentation</Link>
            <a href="#community">Community</a>
          </nav>

          <div className="header-actions">
            <ThemeSelector />
            <ThemeToggle />
            <a href={SITE_CONFIG.links.githubOrgUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{SITE_CONFIG.labels.github}</a>
            <Link to="/" className="btn btn-primary">Get Started</Link>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
