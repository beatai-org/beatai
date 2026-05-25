import React, { useMemo, useState } from 'react';
import AIInsightsIcon from '../components/icons/AIInsightsIcon';
import RustBookIcon from '../components/icons/RustBookIcon';
import LearnClaudeCodeIcon from '../components/icons/LearnClaudeCodeIcon';
import BeatAILogoWave from '../components/BeatAILogoWave';
import PageShell from '../components/layout/PageShell';
import PageSeo from '../components/seo/PageSeo';
import { getSquareCards } from '../content';
import { SITE_CONFIG } from '../utils/siteConfig';
import {
  buildTagPath,
  PAGE_IDS,
  SQUARE_TAGS
} from '../utils/pageConfig';
import { preloadRouteForPath } from '../utils/routePrefetch';
import './Square.css';

const SQUARE_CARD_ICONS = {
  'ai-insights': AIInsightsIcon,
  'rust-course': RustBookIcon,
  'learn-ai': LearnClaudeCodeIcon
};

const Square = () => {
  const [heroLogoAnimated, setHeroLogoAnimated] = useState(false);
  const [hoveredCard, setHoveredCard] = useState('');
  const squareCards = useMemo(() => getSquareCards(), []);

  return (
    <>
      <PageSeo pageId={PAGE_IDS.square} />

      <PageShell rootClassName="square-page">
        <div className="square-container">
          <div className="square-hero">
            <div
              className="square-hero-logo"
              onMouseEnter={() => setHeroLogoAnimated(true)}
              onMouseLeave={() => setHeroLogoAnimated(false)}
            >
              <BeatAILogoWave size={64} animated={heroLogoAnimated} />
            </div>
            <h1 className="square-title">{SITE_CONFIG.brandName}</h1>
            <p className="square-subtitle">
              让 AI 学习更简单
            </p>
          </div>

          <div className="square-content">
            <div className="square-section">
              <h2 className="section-title">探索内容</h2>
              <div className="square-grid">
                {squareCards.map((card) => {
                  const CardIcon = SQUARE_CARD_ICONS[card.icon];

                  return (
                    <a
                      key={card.id}
                      href={card.href}
                      className="square-card glass-card"
                      onMouseEnter={() => {
                        setHoveredCard(card.id);
                        preloadRouteForPath(card.href);
                      }}
                      onFocus={() => preloadRouteForPath(card.href)}
                      onTouchStart={() => preloadRouteForPath(card.href)}
                      onMouseLeave={() => setHoveredCard('')}
                    >
                      <div className="card-icon">
                        <CardIcon size={80} animated={hoveredCard === card.id} />
                      </div>
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="square-section">
              <h2 className="section-title">热门标签</h2>
              <div className="tags-cloud">
                {SQUARE_TAGS.map((tag) => (
                  <a
                    key={tag}
                    href={buildTagPath(tag)}
                    className="tag-cloud-item"
                    onMouseEnter={() => preloadRouteForPath(buildTagPath(tag))}
                    onFocus={() => preloadRouteForPath(buildTagPath(tag))}
                    onTouchStart={() => preloadRouteForPath(buildTagPath(tag))}
                  >
                    <span className="tag-hash">#</span>{tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
};

export default Square;
