import React, { useMemo } from 'react';
import { SceneSequencePlayer } from '../common';

const VIEWPORT = { width: 960, height: 520 };

function getArchitecturePalette(theme) {
  if (theme === 'dark') {
    return {
      background: '#0F1724',
      haloBlue: 'rgba(96, 165, 250, 0.12)',
      haloGold: 'rgba(251, 191, 36, 0.1)',
      boxFill: 'rgba(15, 23, 42, 0.9)',
      text: '#E6EDF5',
      subtitle: '#9DB0C3',
      arrow: '#8FA3BA',
      arrowLabel: '#A9BACB'
    };
  }

  return {
    background: '#F9FBFF',
    haloBlue: 'rgba(96, 165, 250, 0.08)',
    haloGold: 'rgba(255, 211, 122, 0.08)',
    boxFill: 'rgba(255,255,255,0.95)',
    text: '#10233A',
    subtitle: '#62758A',
    arrow: '#7A8FA8',
    arrowLabel: '#5B7086'
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getSegmentProgress(progress, start, end) {
  if (progress <= start) {
    return 0;
  }

  if (progress >= end) {
    return 1;
  }

  return (progress - start) / (end - start);
}

function FadeBox({
  x,
  y,
  width,
  height,
  label,
  subtitle = '',
  color,
  palette,
  progress,
  dashed = false
}) {
  const opacity = clamp(progress, 0, 1);
  const translateY = (1 - opacity) * 12;

  return (
    <g opacity={opacity} transform={`translate(0 ${translateY.toFixed(2)})`}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="22"
        fill={palette.boxFill}
        stroke={color}
        strokeWidth="3"
        strokeDasharray={dashed ? '8 6' : undefined}
      />
      <text x={x + width / 2} y={y + 34} textAnchor="middle" fill={palette.text} fontSize="22" fontWeight="700">
        {label}
      </text>
      {subtitle ? (
        <text x={x + width / 2} y={y + 60} textAnchor="middle" fill={palette.subtitle} fontSize="16">
          {subtitle}
        </text>
      ) : null}
    </g>
  );
}

function FadeArrow({
  from,
  to,
  progress,
  color,
  palette,
  label = ''
}) {
  const opacity = clamp(progress, 0, 1);
  const currentX = from.x + ((to.x - from.x) * opacity);
  const currentY = from.y + ((to.y - from.y) * opacity);
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <g opacity={opacity}>
      <path
        d={`M ${from.x} ${from.y} L ${currentX.toFixed(2)} ${currentY.toFixed(2)}`}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        markerEnd="url(#architecture-arrowhead)"
      />
      {label ? (
        <text x={midX} y={midY - 10} textAnchor="middle" fill={palette.arrowLabel} fontSize="16" fontWeight="700">
          {label}
        </text>
      ) : null}
    </g>
  );
}

function ArchitectureScene({ scene, progress, theme }) {
  const palette = getArchitecturePalette(theme);

  return (
    <>
      <defs>
        <marker id="architecture-arrowhead" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
          <polygon points="0 0, 10 4, 0 8" fill={palette.arrow} />
        </marker>
      </defs>

      <rect x="0" y="0" width={VIEWPORT.width} height={VIEWPORT.height} rx="28" fill={palette.background} />
      <circle cx="820" cy="74" r="88" fill={palette.haloBlue} />
      <circle cx="126" cy="454" r="96" fill={palette.haloGold} />

      {scene.arrows.map((arrow) => (
        <FadeArrow
          key={arrow.id}
          from={arrow.from}
          to={arrow.to}
          label={arrow.label}
          color={palette.arrow}
          palette={palette}
          progress={getSegmentProgress(progress, arrow.start, arrow.end)}
        />
      ))}

      {scene.boxes.map((box) => (
        <FadeBox
          key={box.id}
          {...box}
          palette={palette}
          progress={getSegmentProgress(progress, box.start, box.end)}
        />
      ))}
    </>
  );
}

function ArchitectureEvolutionDemo() {
  const scenes = useMemo(() => ([
    {
      id: 'monolith',
      shortLabel: 'Monolith',
      badge: 'Stage 01',
      title: '从单体开始',
      description: '最开始只有一个 Web 应用，业务、接口、数据访问都堆在同一个进程里。',
      formula: 'Browser  ->  Monolith  ->  Database',
      durationMs: 2800,
      stats: [
        { label: '优点', value: '简单' },
        { label: '问题', value: '边界模糊' }
      ],
      notes: [
        '适合起步快，但一旦业务增长，改动很容易互相牵连。',
        '这是“架构图演变”场景，说明组件不仅能做数学动画。'
      ],
      boxes: [
        { id: 'browser', x: 84, y: 210, width: 168, height: 88, label: 'Browser', subtitle: '用户入口', color: '#2563EB', start: 0.04, end: 0.22 },
        { id: 'monolith', x: 366, y: 182, width: 228, height: 142, label: 'Monolith App', subtitle: 'UI + API + Domain + Data', color: '#7C3AED', start: 0.2, end: 0.42 },
        { id: 'database', x: 718, y: 214, width: 162, height: 82, label: 'Database', subtitle: '唯一存储', color: '#0F9D58', start: 0.42, end: 0.62 }
      ],
      arrows: [
        { id: 'b-m', from: { x: 252, y: 254 }, to: { x: 366, y: 254 }, start: 0.18, end: 0.38 },
        { id: 'm-d', from: { x: 594, y: 254 }, to: { x: 718, y: 254 }, start: 0.4, end: 0.6 }
      ]
    },
    {
      id: 'frontend-api',
      shortLabel: 'API Layer',
      badge: 'Stage 02',
      title: '先拆出清晰的接口层',
      description: '把页面渲染、后端接口、缓存和数据库职责拆开，变化会先沿着边界传播。',
      formula: 'Browser  ->  Frontend  ->  API  ->  Cache / Database',
      durationMs: 3200,
      stats: [
        { label: '目标', value: '分层' },
        { label: '收益', value: '更好维护' }
      ],
      notes: [
        '前后端开始有明确边界，缓存被提到架构层面。',
        '这类演示依赖的是场景序列，不依赖数学公式。'
      ],
      boxes: [
        { id: 'browser', x: 56, y: 216, width: 152, height: 82, label: 'Browser', subtitle: '用户入口', color: '#2563EB', start: 0.04, end: 0.18 },
        { id: 'frontend', x: 260, y: 210, width: 176, height: 94, label: 'Frontend', subtitle: '页面与交互', color: '#0EA5E9', start: 0.16, end: 0.32 },
        { id: 'api', x: 500, y: 210, width: 176, height: 94, label: 'API Layer', subtitle: '统一后端入口', color: '#7C3AED', start: 0.3, end: 0.46 },
        { id: 'cache', x: 742, y: 140, width: 150, height: 84, label: 'Cache', subtitle: '热点读写', color: '#F59E0B', start: 0.44, end: 0.62 },
        { id: 'database', x: 742, y: 286, width: 150, height: 84, label: 'Database', subtitle: '持久化', color: '#0F9D58', start: 0.54, end: 0.72 }
      ],
      arrows: [
        { id: 'b-f', from: { x: 208, y: 257 }, to: { x: 260, y: 257 }, start: 0.12, end: 0.28 },
        { id: 'f-a', from: { x: 436, y: 257 }, to: { x: 500, y: 257 }, start: 0.28, end: 0.44 },
        { id: 'a-c', from: { x: 676, y: 242 }, to: { x: 742, y: 182 }, start: 0.44, end: 0.62, label: 'fast path' },
        { id: 'a-d', from: { x: 676, y: 272 }, to: { x: 742, y: 328 }, start: 0.5, end: 0.7 }
      ]
    },
    {
      id: 'domain-services',
      shortLabel: 'Services',
      badge: 'Stage 03',
      title: '按领域拆服务',
      description: '当团队和流量继续增长，开始按业务能力拆成独立服务，各自拥有边界。',
      formula: 'Gateway  ->  User Service / Content Service / Search',
      durationMs: 3400,
      stats: [
        { label: '目标', value: '解耦' },
        { label: '收益', value: '可独立扩展' }
      ],
      notes: [
        '服务拆分后，团队可以围绕领域独立交付。',
        '但系统复杂度也上升，需要更清晰的通信方式。'
      ],
      boxes: [
        { id: 'browser', x: 60, y: 218, width: 144, height: 78, label: 'Clients', subtitle: 'Web / App', color: '#2563EB', start: 0.04, end: 0.16 },
        { id: 'gateway', x: 254, y: 210, width: 170, height: 94, label: 'API Gateway', subtitle: '统一鉴权与路由', color: '#7C3AED', start: 0.14, end: 0.28 },
        { id: 'user', x: 500, y: 118, width: 172, height: 88, label: 'User Service', subtitle: '账户与权限', color: '#0EA5E9', start: 0.28, end: 0.44 },
        { id: 'content', x: 500, y: 220, width: 172, height: 88, label: 'Content Service', subtitle: '内容主流程', color: '#0F9D58', start: 0.38, end: 0.54 },
        { id: 'search', x: 500, y: 322, width: 172, height: 88, label: 'Search Service', subtitle: '索引与检索', color: '#F59E0B', start: 0.48, end: 0.64 },
        { id: 'user-db', x: 748, y: 126, width: 142, height: 72, label: 'User DB', subtitle: '', color: '#2563EB', start: 0.42, end: 0.58 },
        { id: 'content-db', x: 748, y: 228, width: 142, height: 72, label: 'Content DB', subtitle: '', color: '#0F9D58', start: 0.52, end: 0.68 },
        { id: 'index', x: 748, y: 330, width: 142, height: 72, label: 'Search Index', subtitle: '', color: '#F59E0B', start: 0.62, end: 0.78 }
      ],
      arrows: [
        { id: 'c-g', from: { x: 204, y: 257 }, to: { x: 254, y: 257 }, start: 0.12, end: 0.24 },
        { id: 'g-u', from: { x: 424, y: 242 }, to: { x: 500, y: 162 }, start: 0.24, end: 0.42 },
        { id: 'g-c', from: { x: 424, y: 257 }, to: { x: 500, y: 264 }, start: 0.32, end: 0.5 },
        { id: 'g-s', from: { x: 424, y: 272 }, to: { x: 500, y: 366 }, start: 0.42, end: 0.6 },
        { id: 'u-db', from: { x: 672, y: 162 }, to: { x: 748, y: 162 }, start: 0.4, end: 0.58 },
        { id: 'c-db', from: { x: 672, y: 264 }, to: { x: 748, y: 264 }, start: 0.5, end: 0.68 },
        { id: 's-i', from: { x: 672, y: 366 }, to: { x: 748, y: 366 }, start: 0.6, end: 0.78 }
      ]
    },
    {
      id: 'event-driven',
      shortLabel: 'Event Flow',
      badge: 'Stage 04',
      title: '引入事件流和异步处理',
      description: '服务拆分后，再把通知、搜索、分析等旁路流程放到事件总线和工作队列里。',
      formula: 'Gateway  ->  Domain Services  ->  Event Bus  ->  Workers / Analytics',
      durationMs: 3600,
      stats: [
        { label: '目标', value: '异步化' },
        { label: '收益', value: '降低耦合' }
      ],
      notes: [
        '主链路只做关键同步事务，旁路能力通过事件异步消费。',
        '同一个通用组件也可以拿来讲系统演进、流程变化、组织协作。'
      ],
      boxes: [
        { id: 'browser', x: 42, y: 220, width: 140, height: 76, label: 'Clients', subtitle: 'Web / App', color: '#2563EB', start: 0.04, end: 0.14 },
        { id: 'gateway', x: 216, y: 212, width: 160, height: 92, label: 'API Gateway', subtitle: '主入口', color: '#7C3AED', start: 0.12, end: 0.24 },
        { id: 'user', x: 446, y: 122, width: 168, height: 84, label: 'User Service', subtitle: '同步事务', color: '#0EA5E9', start: 0.24, end: 0.36 },
        { id: 'content', x: 446, y: 232, width: 168, height: 84, label: 'Content Service', subtitle: '同步事务', color: '#0F9D58', start: 0.34, end: 0.46 },
        { id: 'bus', x: 694, y: 218, width: 152, height: 108, label: 'Event Bus', subtitle: '解耦异步事件', color: '#F97316', start: 0.44, end: 0.58 },
        { id: 'worker', x: 812, y: 98, width: 126, height: 78, label: 'Worker', subtitle: '发通知', color: '#2563EB', start: 0.58, end: 0.7 },
        { id: 'search', x: 812, y: 218, width: 126, height: 78, label: 'Indexer', subtitle: '刷新检索', color: '#F59E0B', start: 0.66, end: 0.78 },
        { id: 'analytics', x: 812, y: 338, width: 126, height: 78, label: 'Analytics', subtitle: '离线分析', color: '#EC4899', start: 0.74, end: 0.86 }
      ],
      arrows: [
        { id: 'c-g', from: { x: 182, y: 258 }, to: { x: 216, y: 258 }, start: 0.1, end: 0.2 },
        { id: 'g-u', from: { x: 376, y: 246 }, to: { x: 446, y: 164 }, start: 0.22, end: 0.34 },
        { id: 'g-c', from: { x: 376, y: 264 }, to: { x: 446, y: 274 }, start: 0.3, end: 0.42 },
        { id: 'u-bus', from: { x: 614, y: 164 }, to: { x: 694, y: 246 }, start: 0.42, end: 0.56 },
        { id: 'c-bus', from: { x: 614, y: 274 }, to: { x: 694, y: 274 }, start: 0.46, end: 0.58 },
        { id: 'bus-worker', from: { x: 846, y: 238 }, to: { x: 812, y: 136 }, start: 0.58, end: 0.7 },
        { id: 'bus-search', from: { x: 846, y: 272 }, to: { x: 812, y: 256 }, start: 0.66, end: 0.78 },
        { id: 'bus-analytics', from: { x: 846, y: 304 }, to: { x: 812, y: 376 }, start: 0.74, end: 0.86 }
      ]
    }
  ]), []);

  return (
    <SceneSequencePlayer
      title="架构图演变"
      description="同一个底层组件也能播放非数学的演进过程，这里用系统架构拆分与异步化做演示。"
      scenes={scenes.map((scene) => ({
        ...scene,
        renderScene: ({ progress, theme }) => <ArchitectureScene scene={scene} progress={progress} theme={theme} />
      }))}
      viewport={VIEWPORT}
      autoPlay
      loop
      className="animation-demo-card"
    />
  );
}

export default ArchitectureEvolutionDemo;
