import React from 'react';

/**
 * Learn Claude Code 图标
 *
 * 设计理念：
 * - 科幻控制台 + Agent 核心 + 工具分发
 * - 使用当前主题色，不写死固定配色
 * - 视觉风格与广场其它 SVG 图标保持一致，但更具未来感
 */
const LearnClaudeCodeIcon = ({ size = 80, className = '' }) => {
  const gradientId = `lcc-icon-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="12%" y1="10%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="var(--accent-start, #667eea)" />
          <stop offset="50%" stopColor="var(--accent-mid, var(--accent-end, #8b5cf6))" />
          <stop offset="100%" stopColor="var(--accent-end, #f093fb)" />
        </linearGradient>

        <radialGradient id={`${gradientId}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-end, #f093fb)" stopOpacity="0.95" />
          <stop offset="55%" stopColor="var(--accent-start, #667eea)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--accent-start, #667eea)" stopOpacity="0" />
        </radialGradient>

        <filter id={`${gradientId}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="40"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.6"
        strokeDasharray="4 6"
        opacity="0.24"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="24s"
          repeatCount="indefinite"
        />
      </circle>

      <path
        d="M22 60C24.5 71.5 34.9 80 47.2 80"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M78 40C75.5 28.5 65.1 20 52.8 20"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.42"
      />

      <circle cx="50" cy="50" r="25" fill={`url(#${gradientId}-core)`} opacity="0.8" />

      <g filter={`url(#${gradientId}-glow)`}>
        <rect
          x="24"
          y="28"
          width="52"
          height="42"
          rx="12"
          fill="rgba(255,255,255,0.03)"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.2"
          opacity="0.96"
        />

        <path
          d="M24 40H76"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.8"
          opacity="0.45"
        />
      </g>

      <g fill={`url(#${gradientId})`} opacity="0.8">
        <circle cx="31" cy="34" r="2" />
        <circle cx="37" cy="34" r="2" opacity="0.75" />
        <circle cx="43" cy="34" r="2" opacity="0.5" />
      </g>

      <g stroke={`url(#${gradientId})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 46V55" />
        <path d="M50 55L39 62" opacity="0.92" />
        <path d="M50 55L61 62" opacity="0.92" />
        <path d="M39 62H33" opacity="0.82" />
        <path d="M61 62H67" opacity="0.82" />
      </g>

      <circle
        cx="50"
        cy="46"
        r="5.5"
        fill={`url(#${gradientId})`}
        filter={`url(#${gradientId}-glow)`}
      />
      <circle cx="39" cy="62" r="4.6" fill={`url(#${gradientId})`} opacity="0.88" />
      <circle cx="61" cy="62" r="4.6" fill={`url(#${gradientId})`} opacity="0.88" />
      <circle cx="33" cy="62" r="3.2" fill={`url(#${gradientId})`} opacity="0.58" />
      <circle cx="67" cy="62" r="3.2" fill={`url(#${gradientId})`} opacity="0.58" />

      <path
        d="M43 51L46 54L43 57"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <path
        d="M57 51L54 54L57 57"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      <path
        d="M71 48C75.971 48 80 52.029 80 57C80 61.971 75.971 66 71 66"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M71 45L75 48L71 51"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.78"
      />

      <path
        d="M29 34C24.029 34 20 38.029 20 43C20 47.971 24.029 52 29 52"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M29 31L25 34L29 37"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.78"
      />

      <g fill={`url(#${gradientId})`}>
        <circle cx="80" cy="29" r="2" opacity="0.55" />
        <circle cx="18" cy="66" r="1.8" opacity="0.5" />
        <circle cx="72" cy="79" r="2.1" opacity="0.42" />
      </g>
    </svg>
  );
};

export default LearnClaudeCodeIcon;
