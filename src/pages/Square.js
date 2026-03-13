import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppHeader from '../components/AppHeader/AppHeader';
import Footer from '../components/Footer/Footer';
import AIInsightsIcon from '../components/icons/AIInsightsIcon';
import RustBookIcon from '../components/icons/RustBookIcon';
import BeatAILogoWave from '../components/BeatAILogoWave';
import './Square.css';

const Square = () => {
  const [meta, setMeta] = useState(null);
  const navigate = useNavigate();

  // Load docs metadata
  useEffect(() => {
    const metaPath = `${process.env.PUBLIC_URL}/docs/_meta.json`;
    fetch(metaPath)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setMeta(data);
      })
      .catch(err => console.error('Failed to load docs meta:', err));
  }, []);

  const handleCategoryClick = (category) => {
    // Navigate to the first item in the first section of this category
    const firstSection = category.sections?.[0];
    const firstItem = firstSection?.items?.[0];

    if (firstItem?.path) {
      navigate(firstItem.path);
    }
  };

  const categories = meta?.categories || [];

  return (
    <>
      <Helmet>
        <title>广场 | BeatAI</title>
        <meta name="description" content="BeatAI 社区广场 - 分享、交流与探索" />
      </Helmet>

      <div className="square-page dynamic-background">
        {/* Background Layer */}
        <div className="sailor-moon-bg-layer"></div>

        {/* 复用统一的 AppHeader - 广场页面不激活任何书籍标签 */}
        <AppHeader
          categories={categories}
          activeCategory={null}
          onCategoryClick={handleCategoryClick}
        />

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
                <div className="square-card glass-card">
                  <div className="card-icon">
                    <AIInsightsIcon size={80} />
                  </div>
                  <h3>AI 前沿分享</h3>
                  <p>AI 领域最新动态、技术分享与深度解析</p>
                  <a href="/ai-insights/viewpoint/intro" className="card-link">了解更多 →</a>
                </div>

                <div className="square-card glass-card">
                  <div className="card-icon">
                    <RustBookIcon size={80} />
                  </div>
                  <h3>Rust 语言圣经</h3>
                  <p>Rust 编程语言完整学习指南</p>
                  <a href="/rust-course/about-book" className="card-link">开始学习 →</a>
                </div>
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

        {/* 复用统一的 Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Square;
