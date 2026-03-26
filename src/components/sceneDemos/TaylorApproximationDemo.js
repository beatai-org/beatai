import React, { useId, useMemo } from 'react';
import { SceneSequencePlayer } from '../common';

const VIEWPORT = { width: 960, height: 520 };
const PLOT = {
  left: 84,
  right: 38,
  top: 34,
  bottom: 68
};
const X_DOMAIN = [-Math.PI, Math.PI];
const Y_DOMAIN = [-1.45, 1.45];
const TAYLOR_ORDERS = [1, 3, 5, 7, 9];

function factorial(n) {
  let result = 1;

  for (let index = 2; index <= n; index += 1) {
    result *= index;
  }

  return result;
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

function buildTaylorSin(order) {
  const terms = [];

  for (let exponent = 1; exponent <= order; exponent += 2) {
    const sign = exponent % 4 === 1 ? 1 : -1;
    const denominator = factorial(exponent);

    terms.push((x) => sign * (x ** exponent) / denominator);
  }

  return (x) => terms.reduce((sum, getTermValue) => sum + getTermValue(x), 0);
}

function formatTaylorFormula(order) {
  const parts = [];

  for (let exponent = 1; exponent <= order; exponent += 2) {
    const denominator = factorial(exponent);
    const sign = exponent % 4 === 1 ? '+' : '-';
    const term = exponent === 1 ? 'x' : `x^${exponent}/${denominator}`;

    if (parts.length === 0) {
      parts.push(term);
    } else {
      parts.push(`${sign} ${term}`);
    }
  }

  return `P${order}(x) = ${parts.join(' ')}`;
}

function createPlotHelpers(viewport) {
  const innerWidth = viewport.width - PLOT.left - PLOT.right;
  const innerHeight = viewport.height - PLOT.top - PLOT.bottom;

  return {
    mapX(x) {
      return PLOT.left + ((x - X_DOMAIN[0]) / (X_DOMAIN[1] - X_DOMAIN[0])) * innerWidth;
    },
    mapY(y) {
      return PLOT.top + (1 - ((y - Y_DOMAIN[0]) / (Y_DOMAIN[1] - Y_DOMAIN[0]))) * innerHeight;
    },
    innerWidth,
    innerHeight
  };
}

function sampleFunctionPath(fn, viewport, sampleCount = 320) {
  const { mapX, mapY } = createPlotHelpers(viewport);
  const points = [];

  for (let index = 0; index <= sampleCount; index += 1) {
    const x = X_DOMAIN[0] + (index / sampleCount) * (X_DOMAIN[1] - X_DOMAIN[0]);
    const y = fn(x);
    points.push(`${mapX(x).toFixed(2)} ${mapY(y).toFixed(2)}`);
  }

  return `M${points.join(' L')}`;
}

function buildErrorAreaPath(referenceFn, approximationFn, viewport, sampleCount = 240) {
  const { mapX, mapY } = createPlotHelpers(viewport);
  const referencePoints = [];
  const approximationPoints = [];

  for (let index = 0; index <= sampleCount; index += 1) {
    const x = X_DOMAIN[0] + (index / sampleCount) * (X_DOMAIN[1] - X_DOMAIN[0]);
    referencePoints.push(`${mapX(x).toFixed(2)} ${mapY(referenceFn(x)).toFixed(2)}`);
    approximationPoints.push(`${mapX(x).toFixed(2)} ${mapY(approximationFn(x)).toFixed(2)}`);
  }

  return `M${referencePoints.join(' L')} L${approximationPoints.reverse().join(' L')} Z`;
}

function computeMaxError(referenceFn, approximationFn, sampleCount = 480) {
  let maxError = 0;

  for (let index = 0; index <= sampleCount; index += 1) {
    const x = X_DOMAIN[0] + (index / sampleCount) * (X_DOMAIN[1] - X_DOMAIN[0]);
    maxError = Math.max(maxError, Math.abs(referenceFn(x) - approximationFn(x)));
  }

  return maxError;
}

function getTaylorPalette(theme) {
  if (theme === 'dark') {
    return {
      background: '#0F1724',
      grid: 'rgba(148, 163, 184, 0.18)',
      axis: '#8FA3BA',
      reference: '#E6EDF5',
      approximation: '#4ADE80',
      cardFill: 'rgba(15, 23, 42, 0.88)',
      cardStroke: 'rgba(71, 85, 105, 0.76)',
      heading: '#F8FAFC',
      body: '#A9BACB',
      tick: '#8FA3BA',
      areaStart: '#34D399',
      areaEnd: '#60A5FA',
      point: '#E6EDF5'
    };
  }

  return {
    background: '#F9FBFF',
    grid: '#D8E3EE',
    axis: '#7A8FA8',
    reference: '#0F172A',
    approximation: '#0F9D58',
    cardFill: 'rgba(255, 255, 255, 0.94)',
    cardStroke: 'rgba(203, 213, 225, 0.56)',
    heading: '#0F172A',
    body: '#546A80',
    tick: '#74879C',
    areaStart: '#12B76A',
    areaEnd: '#60A5FA',
    point: '#0F172A'
  };
}

function TaylorScene({ scene, progress, viewport, theme }) {
  const gradientId = useId();
  const palette = getTaylorPalette(theme);
  const sinReveal = clamp(progress * 1.35, 0.08, 1);
  const approximationReveal = clamp(getSegmentProgress(progress, 0.16, 1), 0.04, 1);
  const areaOpacity = getSegmentProgress(progress, 0.34, 1) * 0.18;
  const labelOpacity = getSegmentProgress(progress, 0.22, 1);
  const { width, height } = viewport;
  const { mapX, mapY } = createPlotHelpers(viewport);
  const stageBottom = height - PLOT.bottom;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1={PLOT.top} x2={width} y2={stageBottom} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={palette.areaStart} stopOpacity="0.34" />
          <stop offset="1" stopColor={palette.areaEnd} stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={width} height={height} rx="28" fill={palette.background} />

      {[-1, -0.5, 0.5, 1].map((value) => (
        <line
          key={`h-${value}`}
          x1={PLOT.left}
          y1={mapY(value)}
          x2={width - PLOT.right}
          y2={mapY(value)}
          stroke={palette.grid}
          strokeWidth="1.4"
        />
      ))}

      {[-Math.PI, -Math.PI / 2, Math.PI / 2, Math.PI].map((value) => (
        <line
          key={`v-${value}`}
          x1={mapX(value)}
          y1={PLOT.top}
          x2={mapX(value)}
          y2={stageBottom}
          stroke={palette.grid}
          strokeWidth="1.4"
        />
      ))}

      <line x1={PLOT.left} y1={mapY(0)} x2={width - PLOT.right} y2={mapY(0)} stroke={palette.axis} strokeWidth="2.4" />
      <line x1={mapX(0)} y1={PLOT.top} x2={mapX(0)} y2={stageBottom} stroke={palette.axis} strokeWidth="2.4" />

      <path
        d={scene.errorAreaPath}
        fill={`url(#${gradientId})`}
        opacity={areaOpacity}
      />

      <path
        d={scene.sinPath}
        pathLength="1"
        stroke={palette.reference}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${sinReveal} 1`}
      />

      <path
        d={scene.approximationPath}
        pathLength="1"
        stroke={palette.approximation}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${approximationReveal} 1`}
      />

      <circle cx={mapX(0)} cy={mapY(0)} r="5.5" fill={palette.point} />

      <g opacity={labelOpacity}>
        <rect x={width - 250} y="28" width="216" height="84" rx="18" fill={palette.cardFill} stroke={palette.cardStroke} />
        <text x={width - 226} y="58" fill={palette.heading} fontSize="22" fontWeight="700">{scene.badge}</text>
        <text x={width - 226} y="84" fill={palette.body} fontSize="18">黑线固定是 sin(x)</text>
        <text x={width - 226} y="108" fill={palette.approximation} fontSize="18">绿线是当前多项式</text>
      </g>

      <g fill={palette.tick} fontSize="18">
        <text x={mapX(-Math.PI) - 16} y={mapY(0) + 28}>-π</text>
        <text x={mapX(-Math.PI / 2) - 22} y={mapY(0) + 28}>-π/2</text>
        <text x={mapX(0) - 5} y={mapY(0) + 28}>0</text>
        <text x={mapX(Math.PI / 2) - 16} y={mapY(0) + 28}>π/2</text>
        <text x={mapX(Math.PI) - 5} y={mapY(0) + 28}>π</text>
        <text x={mapX(0) + 10} y={mapY(1) + 6}>1</text>
        <text x={mapX(0) + 10} y={mapY(-1) + 6}>-1</text>
      </g>
    </>
  );
}

function TaylorApproximationDemo() {
  const scenes = useMemo(() => {
    const sinFn = (x) => Math.sin(x);
    const sinPath = sampleFunctionPath(sinFn, VIEWPORT);

    return TAYLOR_ORDERS.map((order) => {
      const approximationFn = buildTaylorSin(order);
      const maxError = computeMaxError(sinFn, approximationFn);
      const approximationPath = sampleFunctionPath(approximationFn, VIEWPORT);
      const errorAreaPath = buildErrorAreaPath(sinFn, approximationFn, VIEWPORT);

      return {
        id: `taylor-${order}`,
        shortLabel: `P${order}`,
        badge: `P${order}(x)`,
        title: `${order} 次多项式逼近`,
        description: ({
          1: '1 次多项式只保留线性项，离开 x = 0 后会很快偏离，基本只能贴住中心附近。',
          3: '加入 x^3 项后，中心区域开始更像 sin(x)，但两侧仍然有明显误差。',
          5: '5 次多项式把拟合范围继续向左右拉开，主干形状已经接近完整波峰和波谷。',
          7: '7 次多项式进一步压缩边缘误差，除了接近边界的位置，整体走势已经相当贴近。',
          9: '到 9 次时，多项式已经能逼近大部分区间，误差主要只剩在最外侧。'
        }[order] || '围绕 x = 0 展开，看看阶数增加后，曲线如何逐步贴近 sin(x)。'),
        formula: formatTaylorFormula(order),
        durationMs: 2800,
        stats: [
          { label: '对比区间', value: '[-π, π]' },
          { label: '最大误差', value: maxError.toFixed(4) }
        ],
        notes: [
          order === 1
            ? '一次多项式只在 0 附近像直线，离开中心后很快偏离。'
            : '新增高阶项后，逼近范围会逐步从中心向两侧扩展。',
          '误差阴影越薄，表示当前多项式与 sin(x) 的偏差越小。'
        ],
        sinPath,
        approximationPath,
        errorAreaPath,
        renderScene: ({ progress, viewport, theme }) => (
          <TaylorScene
            scene={{
              sinPath,
              approximationPath,
              errorAreaPath,
              badge: `P${order}(x)`
            }}
            progress={progress}
            viewport={viewport}
            theme={theme}
          />
        )
      };
    });
  }, []);

  return (
    <SceneSequencePlayer
      title="多项式逼近"
      description="用泰勒多项式逐阶逼近 sin(x)，重点看阶数增加后拟合范围如何扩大。"
      scenes={scenes}
      viewport={VIEWPORT}
      autoPlay
      loop
      className="animation-demo-card"
    />
  );
}

export default TaylorApproximationDemo;
