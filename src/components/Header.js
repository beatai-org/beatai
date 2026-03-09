import React, { useState } from 'react';
import './Header.css';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <span className="logo-text">LoongBot</span>
          </div>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <a href="#features">Features</a>
            <a href="#demo">Demo</a>
            <a href="#docs">Documentation</a>
            <a href="#community">Community</a>
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <button className="btn btn-secondary">GitHub</button>
            <button className="btn btn-primary">Get Started</button>
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
