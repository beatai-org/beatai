import React from 'react';
import { Helmet } from 'react-helmet-async';
import AIInsightsIcon from '../components/icons/AIInsightsIcon';
import RustBookIcon from '../components/icons/RustBookIcon';
import LearnClaudeCodeIcon from '../components/icons/LearnClaudeCodeIcon';
import BeatAILogoWave from '../components/BeatAILogoWave';
import PageShell from '../components/layout/PageShell';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useDocsMeta } from '../hooks/useDocsMeta';
import { getFirstNavigablePathForCategory } from '../utils/docsMeta';
import './Square.css';

const Square = () => {
  const { meta } = useDocsMeta();
  const handleCategoryClick = useCategoryNavigation();

  // Get first item path for a category
  const getFirstItemPath = (categoryId) => {
    const category = meta?.categories?.find((item) => item.id === categoryId);
    return getFirstNavigablePathForCategory(category) || '#';
  };

  const categories = meta?.categories || [];

  return (
    <>
      <Helmet>
        <title>广场 | BeatAI</title>
        <meta name="description" content="BeatAI 社区广场 - 分享、交流与探索" />
      </Helmet>

      <PageShell
        rootClassName="square-page"
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
      >
        <div className="square-container">
          <div className="square-hero">
            <div className="square-hero-logo">
              <BeatAILogoWave size={64} />
            </div>
            <h1 className="square-title">BeatAI</h1>
            <p className="square-subtitle">
              让 AI 更简单 - 创世实验室
            </p>
          </div>

          <div className="square-content">
            <div className="square-section">
              <h2 className="section-title">探索内容</h2>
              <div className="square-grid">
                <a href={getFirstItemPath('ai-insights')} className="square-card glass-card">
                  <div className="card-icon">
                    <AIInsightsIcon size={80} />
                  </div>
                  <h3>AI 前沿分享</h3>
                  <p>AI 领域最新动态、技术分享与深度解析</p>
                </a>

                <a href={getFirstItemPath('rust-course')} className="square-card glass-card">
                  <div className="card-icon">
                    <RustBookIcon size={80} />
                  </div>
                  <h3>Rust 语言圣经</h3>
                  <p>学习 AI 时代最安全的语言</p>
                </a>

                <a href="/learn-claude-code/preface" className="square-card glass-card">
                  <div className="card-icon">
                    <LearnClaudeCodeIcon size={80} />
                  </div>
                  <h3>CC宝典</h3>
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
