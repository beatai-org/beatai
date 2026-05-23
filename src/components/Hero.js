import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import ThemeSelector from './ThemeSelector';
import { HiSparkles } from 'react-icons/hi';
import { SITE_CONFIG } from '../utils/siteConfig';
import { PAGE_CONFIG, PAGE_IDS } from '../utils/pageConfig';

const Hero = () => {
  return (
    <section className="hero">
      <div className="theme-toggle-container">
        <ThemeSelector />
        <ThemeToggle />
      </div>

      <div className="container">
        <div className="hero-content">
          {/* Logo 区域 */}
          <Logo />

          {/* 品牌名称 */}
          <h1 className="brand-name">
            <span className="gradient-text">{SITE_CONFIG.brandName}</span>
          </h1>

          <p className="tagline">
            THE AI THAT ACTUALLY DOES THINGS.
          </p>

          {/* 简短描述 */}
          <p className="hero-description">
            Clone your ideas, code smells, navigate your codebase, <br />
            do from WhatsApp, Telegram, or any chat app you already use.
          </p>

          {/* 徽章 */}
          <div className="hero-badge">
            <span className="badge-text">
              <HiSparkles className="badge-icon" />
              OpenAI DevDay will enable for Get Credits →
            </span>
          </div>

          <div className="hero-actions">
            <Link to={PAGE_CONFIG[PAGE_IDS.docs].path} className="btn btn-primary btn-large">
              {PAGE_CONFIG[PAGE_IDS.docs].ctaLabel} →
            </Link>
            <a href={SITE_CONFIG.links.githubOrgUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-large">
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
