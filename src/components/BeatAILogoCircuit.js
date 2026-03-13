import React from 'react';

/**
 * BeatAI Logo 设计方案 3 - 电路板风格
 *
 * 设计理念：
 * - 电路板风格的路径代表 AI 的计算网络
 * - 中心的闪电代表 "Beat" 的能量和速度
 * - 科技感强，现代化
 */
const BeatAILogoCircuit = ({ size = 32, className = '' }) => {
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
        <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="50%" stopColor="#764ba2" />
          <stop offset="100%" stopColor="#f093fb" />
        </linearGradient>
      </defs>

      {/* 电路板路径 */}
      <g stroke="url(#circuit-gradient)" strokeWidth="2" opacity="0.4">
        {/* 左侧路径 */}
        <path d="M 8 16 L 16 16 L 16 24" fill="none" />
        <circle cx="16" cy="24" r="2" fill="url(#circuit-gradient)" />

        {/* 右侧路径 */}
        <path d="M 40 16 L 32 16 L 32 24" fill="none" />
        <circle cx="32" cy="24" r="2" fill="url(#circuit-gradient)" />

        {/* 底部路径 */}
        <path d="M 24 40 L 24 32" fill="none" />
        <circle cx="24" cy="32" r="2" fill="url(#circuit-gradient)" />
      </g>

      {/* 中心闪电 - 代表 Beat 的能量 */}
      <path
        d="M 28 8 L 20 24 L 26 24 L 20 40 L 32 20 L 24 20 Z"
        fill="url(#circuit-gradient)"
        stroke="url(#circuit-gradient)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* 中心节点连接 */}
      <circle cx="24" cy="24" r="3" fill="url(#circuit-gradient)" opacity="0.8" />
    </svg>
  );
};

export default BeatAILogoCircuit;
