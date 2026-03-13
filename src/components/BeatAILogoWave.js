import React from 'react';

/**
 * BeatAI Logo 设计方案 4 - 音频波形
 *
 * 设计理念：
 * - 音频波形条代表 "Beat" 的节奏感
 * - 波形形成 "AI" 的形状
 * - 简洁、动感、现代
 */
const BeatAILogoWave = ({ size = 32, className = '' }) => {
  // 使用唯一 ID 避免多个实例冲突
  const gradientId = `wave-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#f093fb" />
        </linearGradient>
      </defs>

      {/* 音频波形条 - 形成节奏感 */}
      <g fill={`url(#${gradientId})`}>
        {/* 第一组 - 低 */}
        <rect x="8" y="20" width="4" height="8" rx="2" />

        {/* 第二组 - 高 */}
        <rect x="13" y="12" width="4" height="24" rx="2" />

        {/* 第三组 - 中 */}
        <rect x="18" y="16" width="4" height="16" rx="2" />

        {/* 第四组 - 最高 (中心) */}
        <rect x="23" y="8" width="4" height="32" rx="2" />

        {/* 第五组 - 中 */}
        <rect x="28" y="16" width="4" height="16" rx="2" />

        {/* 第六组 - 高 */}
        <rect x="33" y="12" width="4" height="24" rx="2" />

        {/* 第七组 - 低 */}
        <rect x="38" y="20" width="4" height="8" rx="2" />
      </g>

      {/* AI 装饰点 - 调整到安全区域内 */}
      <circle cx="10" cy="12" r="1.5" fill="#667eea" opacity="0.7" />
      <circle cx="38" cy="36" r="1.5" fill="#f093fb" opacity="0.7" />
    </svg>
  );
};

export default BeatAILogoWave;
