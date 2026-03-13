import React from 'react';

/**
 * BeatAI Logo - 极简创意版本
 *
 * 设计理念：
 * - 将字母 "B" 和心电图波形结合
 * - 用神经网络节点表示 AI
 * - 使用品牌渐变色
 * - 极简风格，易于识别
 */
const BeatAILogoMinimal = ({ size = 32, className = '' }) => {
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
        <linearGradient id="minimal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#f093fb" />
        </linearGradient>
      </defs>

      {/* 字母 B 的外形 + 心电图波形 */}
      <path
        d="M 12 10
           L 12 38
           L 26 38
           C 32 38 36 34 36 28
           C 36 25 34 23 32 22
           C 34 21 36 19 36 16
           C 36 10 32 10 26 10
           L 12 10

           M 16 14 L 24 14
           L 28 18 L 32 10 L 34 14

           M 16 24 L 20 24 L 22 18 L 26 30 L 30 24 L 34 24"
        stroke="url(#minimal-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default BeatAILogoMinimal;
