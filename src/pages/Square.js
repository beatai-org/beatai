import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AIInsightsIcon from '../components/icons/AIInsightsIcon';
import RustBookIcon from '../components/icons/RustBookIcon';
import LearnClaudeCodeIcon from '../components/icons/LearnClaudeCodeIcon';
import BeatAILogoWave from '../components/BeatAILogoWave';
import PageShell from '../components/layout/PageShell';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useDocsMeta } from '../hooks/useDocsMeta';
import { getFirstNavigablePathForCategory } from '../utils/docsMeta';
import { getLearnAiDefaultPath } from '../utils/learnAiPaths';
import { buildKnowledgeSpaces } from '../utils/knowledgeSpaces';
import {
  buildSiteTitle,
  SITE_CONFIG
} from '../utils/siteConfig';
import { AI_INSIGHTS_CATEGORY_ID } from '../utils/siteRoutes';
import './Square.css';

const Square = () => {
  const { meta } = useDocsMeta();
  const handleCategoryClick = useCategoryNavigation();
  const spaces = useMemo(() => buildKnowledgeSpaces(meta), [meta]);
  const [heroLogoAnimated, setHeroLogoAnimated] = useState(false);
  const [hoveredCard, setHoveredCard] = useState('');

  // Resolve a category's entry path: explicit `entryPath` in meta wins,
  // otherwise fall back to the first navigable chapter.
  const getCategoryEntryPath = (categoryId) => {
    const category = meta?.categories?.find((item) => item.id === categoryId);
    return category?.entryPath || getFirstNavigablePathForCategory(category) || '#';
  };

  const categories = meta?.categories || [];

  return (
    <>
      <Helmet>
        <title>{buildSiteTitle('广场')}</title>
        <meta name="description" content={`${SITE_CONFIG.brandName} 社区广场 - 分享、交流与探索`} />
      </Helmet>

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
                <a
                  href={getCategoryEntryPath(AI_INSIGHTS_CATEGORY_ID)}
                  className="square-card glass-card"
                  onMouseEnter={() => setHoveredCard(AI_INSIGHTS_CATEGORY_ID)}
                  onMouseLeave={() => setHoveredCard('')}
                >
                  <div className="card-icon">
                    <AIInsightsIcon size={80} animated={hoveredCard === AI_INSIGHTS_CATEGORY_ID} />
                  </div>
                  <h3>AI 前沿分享</h3>
                  <p>AI 领域最新动态、技术分享与深度解析</p>
                </a>

                <a
                  href={getCategoryEntryPath('rust-course')}
                  className="square-card glass-card"
                  onMouseEnter={() => setHoveredCard('rust-course')}
                  onMouseLeave={() => setHoveredCard('')}
                >
                  <div className="card-icon">
                    <RustBookIcon size={80} animated={hoveredCard === 'rust-course'} />
                  </div>
                  <h3>RUST 语言圣经</h3>
                  <p>学习 AI 时代最安全的语言</p>
                </a>

                <a
                  href={getLearnAiDefaultPath()}
                  className="square-card glass-card"
                  onMouseEnter={() => setHoveredCard('learn-ai')}
                  onMouseLeave={() => setHoveredCard('')}
                >
                  <div className="card-icon">
                    <LearnClaudeCodeIcon size={80} animated={hoveredCard === 'learn-ai'} />
                  </div>
                  <h3>Learn Claude Code</h3>
                  <p>欲练此功...</p>
                </a>
              </div>
            </div>

            <div className="square-section">
              <h2 className="section-title">热门标签</h2>
              <div className="tags-cloud">
                <a href="/tags/Rust" className="tag-cloud-item">
                  <span className="tag-hash">#</span>Rust
                </a>
                <a href="/tags/基础" className="tag-cloud-item">
                  <span className="tag-hash">#</span>基础
                </a>
                <a href="/tags/进阶" className="tag-cloud-item">
                  <span className="tag-hash">#</span>进阶
                </a>
                <a href="/tags/所有权" className="tag-cloud-item">
                  <span className="tag-hash">#</span>所有权
                </a>
                <a href="/tags/AI" className="tag-cloud-item">
                  <span className="tag-hash">#</span>AI
                </a>
                <a href="/tags/入门" className="tag-cloud-item">
                  <span className="tag-hash">#</span>入门
                </a>
                <a href="/tags/数据类型" className="tag-cloud-item">
                  <span className="tag-hash">#</span>数据类型
                </a>
                <a href="/tags/Cargo" className="tag-cloud-item">
                  <span className="tag-hash">#</span>Cargo
                </a>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
};

export default Square;
