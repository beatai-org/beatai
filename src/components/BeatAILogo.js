import React from 'react';

/**
 * BeatAI Logo - 创意设计理念:
 *
 * 1. 心电图波形 (Beat): 代表生命力、脉搏、节奏
 * 2. 神经网络节点: 代表人工智能、连接、智能
 * 3. 渐变色彩: 紫色到粉色，体现科技感和活力
 * 4. 简洁几何: 使用简单的线条和圆形，易于识别
 */
const BeatAILogo = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* 主渐变 - 紫色到粉色 */}
        <linearGradient id="beatai-gradient-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="50%" stopColor="#764ba2" />
          <stop offset="100%" stopColor="#f093fb" />
        </linearGradient>

        {/* 辉光效果 */}
        <filter id="beatai-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 背景圆 - 柔和的渐变背景 */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="url(#beatai-gradient-main)"
        opacity="0.1"
      />

      {/* 心电图波形 - 代表 Beat */}
      <path
        d="M 8 24 L 12 24 L 14 18 L 18 30 L 22 14 L 26 28 L 30 20 L 34 24 L 40 24"
        stroke="url(#beatai-gradient-main)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#beatai-glow)"
      />

      {/* AI 神经网络节点 - 三个连接的圆点 */}
      <g opacity="0.9">
        {/* 左节点 */}
        <circle
          cx="14"
          cy="18"
          r="3"
          fill="url(#beatai-gradient-main)"
          filter="url(#beatai-glow)"
        />

        {/* 中心节点 (稍大) */}
        <circle
          cx="24"
          cy="24"
          r="4"
          fill="url(#beatai-gradient-main)"
          filter="url(#beatai-glow)"
        />

        {/* 右节点 */}
        <circle
          cx="34"
          cy="30"
          r="3"
          fill="url(#beatai-gradient-main)"
          filter="url(#beatai-glow)"
        />

        {/* 连接线 */}
        <line
          x1="14"
          y1="18"
          x2="24"
          y2="24"
          stroke="url(#beatai-gradient-main)"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <line
          x1="24"
          y1="24"
          x2="34"
          y2="30"
          stroke="url(#beatai-gradient-main)"
          strokeWidth="1.5"
          opacity="0.4"
        />
      </g>

      {/* 装饰性粒子 */}
      <circle cx="38" cy="12" r="1.5" fill="#667eea" opacity="0.6" />
      <circle cx="10" cy="34" r="1.5" fill="#f093fb" opacity="0.6" />
    </svg>
  );
};

export default BeatAILogo;
