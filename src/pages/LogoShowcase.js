import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BeatAILogo from '../components/BeatAILogo';
import BeatAILogoGeometric from '../components/BeatAILogoGeometric';
import BeatAILogoCircuit from '../components/BeatAILogoCircuit';
import BeatAILogoWave from '../components/BeatAILogoWave';
import BeatAILogoHex from '../components/BeatAILogoHex';
import {
  buildSiteTitle,
  SITE_CONFIG
} from '../utils/siteConfig';
import './LogoShowcase.css';

const LogoShowcase = () => {
  const [selectedLogo, setSelectedLogo] = useState('original');

  const logos = [
    {
      id: 'original',
      name: '心电图 + 神经网络',
      description: '结合心电图波形（Beat）和神经网络节点（AI），有辉光效果',
      component: BeatAILogo
    },
    {
      id: 'geometric',
      name: '极简几何',
      description: '三角形和圆形组合，脉冲动画，现代科技感',
      component: BeatAILogoGeometric
    },
    {
      id: 'circuit',
      name: '电路板风格',
      description: '电路板路径 + 闪电能量，强科技感',
      component: BeatAILogoCircuit
    },
    {
      id: 'wave',
      name: '音频波形',
      description: '音频波形条，节奏感强，简洁动感',
      component: BeatAILogoWave
    },
    {
      id: 'hex',
      name: '数字脉冲',
      description: '六边形蜂巢结构 + 脉冲动画，数字化风格',
      component: BeatAILogoHex
    }
  ];

  const SelectedLogoComponent = logos.find(l => l.id === selectedLogo)?.component || BeatAILogo;

  return (
    <>
      <Helmet>
        <title>{buildSiteTitle('Logo 设计方案')}</title>
      </Helmet>

      <div className="logo-showcase">
        <div className="logo-showcase-container">
          <h1 className="showcase-title">{SITE_CONFIG.brandName} Logo 设计方案</h1>
          <p className="showcase-subtitle">选择你喜欢的设计风格</p>

          {/* 大图预览 */}
          <div className="logo-preview-large">
            <div className="preview-card">
              <SelectedLogoComponent size={200} />
              <div className="preview-info">
                <h2>{logos.find(l => l.id === selectedLogo)?.name}</h2>
                <p>{logos.find(l => l.id === selectedLogo)?.description}</p>
              </div>
            </div>

            {/* 带文字的预览 */}
            <div className="preview-with-text">
              <div className="preview-logo-text">
                <SelectedLogoComponent size={48} />
                <span className="preview-text">{SITE_CONFIG.brandName}</span>
              </div>
              <p className="preview-hint">Header 中的效果预览</p>
            </div>
          </div>

          {/* Logo 列表 */}
          <div className="logo-grid">
            {logos.map(logo => {
              const LogoComponent = logo.component;
              return (
                <div
                  key={logo.id}
                  className={`logo-card ${selectedLogo === logo.id ? 'active' : ''}`}
                  onClick={() => setSelectedLogo(logo.id)}
                >
                  <div className="logo-card-preview">
                    <LogoComponent size={80} />
                  </div>
                  <h3>{logo.name}</h3>
                  <p>{logo.description}</p>
                  {selectedLogo === logo.id && (
                    <div className="logo-card-badge">已选择</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="showcase-note">
            <p>💡 提示：所有 Logo 都使用品牌渐变色（紫色→粉色），可以灵活调整尺寸和颜色</p>
            <p>🎨 你可以选择其中一个设计，或者我可以根据你的反馈进一步优化</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoShowcase;
