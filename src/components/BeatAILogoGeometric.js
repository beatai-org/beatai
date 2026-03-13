import React from 'react';

/**
 * BeatAI Logo 设计方案 2 - 极简几何
 *
 * 设计理念：
 * - 使用三角形和圆形的组合表示 AI 的计算和连接
 * - 中心的脉冲点代表 "Beat"
 * - 极简几何风格，现代科技感
 */
const BeatAILogoGeometric = ({ size = 32, className = '' }) => {
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
        <linearGradient id="geo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#f093fb" />
        </linearGradient>
      </defs>

      {/* 外圈 - 象征连接 */}
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="url(#geo-gradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />

      {/* 内部三角形 - 象征 AI 的方向性和计算 */}
      <path
        d="M 24 12 L 34 28 L 14 28 Z"
        stroke="url(#geo-gradient)"
        strokeWidth="2.5"
        fill="url(#geo-gradient)"
        opacity="0.15"
      />

      {/* 中心脉搏点 */}
      <circle
        cx="24"
        cy="24"
        r="4"
        fill="url(#geo-gradient)"
      />

      {/* 脉搏波动环 */}
      <circle
        cx="24"
        cy="24"
        r="8"
        stroke="url(#geo-gradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      >
        <animate
          attributeName="r"
          from="8"
          to="16"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="0.4"
          to="0"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default BeatAILogoGeometric;
