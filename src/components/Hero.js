import React from 'react';
import './Hero.css';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { HiSparkles } from 'react-icons/hi';

const Hero = () => {
  return (
    <section className="hero">
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>

      <div className="container">
        <div className="hero-content">
          {/* Logo 区域 */}
          <Logo />

          {/* 品牌名称 */}
          <h1 className="brand-name">
            <span className="gradient-text">LoongBot</span>
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
            <button className="btn btn-primary btn-large">
              Get Started →
            </button>
            <button className="btn btn-secondary btn-large">
              View on GitHub
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
