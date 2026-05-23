import React from 'react';
import BeatAILogoWave from './BeatAILogoWave';
import { SITE_CONFIG } from '../utils/siteConfig';

/**
 * 页面跳转Loading效果
 * - 使用BeatAI Logo作为加载指示器
 * - 酷炫的渐变背景动画
 * - 脉冲和旋转效果
 */
const PageTransitionLoader = () => {
  return (
    <div className="page-transition-loader">
      {/* 动态渐变背景 */}
      <div className="loader-bg-layer"></div>

      {/* Logo容器 */}
      <div className="loader-content">
        <div className="loader-logo-wrapper">
          <BeatAILogoWave size={80} />
        </div>

        {/* 文字提示 */}
        <div className="loader-text">
          <span className="loader-text-gradient">{SITE_CONFIG.brandName}</span>
        </div>

        {/* 进度条 */}
        <div className="loader-progress-bar">
          <div className="loader-progress-fill"></div>
        </div>

        {/* 装饰性粒子 */}
        <div className="loader-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
        </div>
      </div>
    </div>
  );
};

export default PageTransitionLoader;
