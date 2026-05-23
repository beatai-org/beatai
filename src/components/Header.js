import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import ThemeToggle from './ThemeToggle';
import ThemeSelector from './ThemeSelector';
import { SITE_CONFIG } from '../utils/siteConfig';
import { MARKETING_NAV_ITEMS, PAGE_CONFIG, PAGE_IDS } from '../utils/pageConfig';

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
            {MARKETING_NAV_ITEMS.map((item) => (
              item.to ? (
                <Link key={item.id} to={item.to}>{item.label}</Link>
              ) : (
                <a key={item.id} href={item.href}>{item.label}</a>
              )
            ))}
          </nav>

          <div className="header-actions">
            <ThemeSelector />
            <ThemeToggle />
            <a href={SITE_CONFIG.links.githubOrgUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{SITE_CONFIG.labels.github}</a>
            <Link to={PAGE_CONFIG[PAGE_IDS.docs].path} className="btn btn-primary">
              {PAGE_CONFIG[PAGE_IDS.docs].ctaLabel}
            </Link>
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
