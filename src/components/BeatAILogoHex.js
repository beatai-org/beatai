import React from 'react';

/**
 * BeatAI Logo 设计方案 5 - 数字脉冲
 *
 * 设计理念：
 * - 六边形代表 AI 的计算单元
 * - 中心脉冲代表 "Beat" 的生命力
 * - 数字化、蜂巢式的结构
 */
const BeatAILogoHex = ({ size = 32, className = '' }) => {
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
        <linearGradient id="hex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#f093fb" />
        </linearGradient>
      </defs>

      {/* 外层六边形 */}
      <path
        d="M 24 6 L 36 13 L 36 27 L 24 34 L 12 27 L 12 13 Z"
        stroke="url(#hex-gradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />

      {/* 中层六边形 */}
      <path
        d="M 24 12 L 32 16.5 L 32 25.5 L 24 30 L 16 25.5 L 16 16.5 Z"
        stroke="url(#hex-gradient)"
        strokeWidth="2"
        fill="url(#hex-gradient)"
        opacity="0.1"
      />

      {/* 内层脉冲圈 */}
      <circle
        cx="24"
        cy="21"
        r="6"
        stroke="url(#hex-gradient)"
        strokeWidth="2"
        fill="none"
      />

      {/* 中心脉冲点 */}
      <circle
        cx="24"
        cy="21"
        r="3"
        fill="url(#hex-gradient)"
      />

      {/* 脉冲波纹动画 */}
      <circle
        cx="24"
        cy="21"
        r="6"
        stroke="url(#hex-gradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      >
        <animate
          attributeName="r"
          from="6"
          to="12"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="0.6"
          to="0"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* 连接线 - 数字化效果 */}
      <line x1="24" y1="21" x2="24" y2="30" stroke="url(#hex-gradient)" strokeWidth="1.5" opacity="0.5" />
      <line x1="24" y1="21" x2="32" y2="25" stroke="url(#hex-gradient)" strokeWidth="1.5" opacity="0.5" />
      <line x1="24" y1="21" x2="16" y2="25" stroke="url(#hex-gradient)" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
};

export default BeatAILogoHex;
