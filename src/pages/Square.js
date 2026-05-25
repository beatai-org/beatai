import React, { useMemo, useState } from 'react';
import AIInsightsIcon from '../components/icons/AIInsightsIcon';
import RustBookIcon from '../components/icons/RustBookIcon';
import LearnClaudeCodeIcon from '../components/icons/LearnClaudeCodeIcon';
import BeatAILogoWave from '../components/BeatAILogoWave';
import PageShell from '../components/layout/PageShell';
import PageSeo from '../components/seo/PageSeo';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useDocsMeta } from '../hooks/useDocsMeta';
import {
  buildKnowledgeNavigationModel,
  findDocCategory,
  getCategoryEntryPath
} from '../domain/docs';
import { getBookDefaultUrl } from '../content';
import { SITE_CONFIG } from '../utils/siteConfig';
import {
  buildTagPath,
  PAGE_IDS,
  SQUARE_CONTENT_CARDS,
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
  const { meta } = useDocsMeta();
  const handleCategoryClick = useCategoryNavigation();
  const { categories, spaces } = useMemo(() => buildKnowledgeNavigationModel(meta), [meta]);
  const [heroLogoAnimated, setHeroLogoAnimated] = useState(false);
  const [hoveredCard, setHoveredCard] = useState('');

  const getSquareCategoryEntryPath = (categoryId) => {
    return getCategoryEntryPath(findDocCategory(meta, categoryId), '#');
  };

  const getSquareCardPath = (card) => {
    if (card.pathKind === 'learnAiDefault') {
      return getBookDefaultUrl('learn-claude-code');
    }

    return getSquareCategoryEntryPath(card.categoryId);
  };

  return (
    <>
      <PageSeo pageId={PAGE_IDS.square} />

      <PageShell
        rootClassName="square-page"
        spaces={spaces}
        activeSpace={null}
        onSpaceClick={handleCategoryClick}
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
      >
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
                {SQUARE_CONTENT_CARDS.map((card) => {
                  const CardIcon = SQUARE_CARD_ICONS[card.icon];

                  return (
                    <a
                      key={card.id}
                      href={getSquareCardPath(card)}
                      className="square-card glass-card"
                      onMouseEnter={() => {
                        setHoveredCard(card.id);
                        preloadRouteForPath(getSquareCardPath(card));
                      }}
                      onFocus={() => preloadRouteForPath(getSquareCardPath(card))}
                      onTouchStart={() => preloadRouteForPath(getSquareCardPath(card))}
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
