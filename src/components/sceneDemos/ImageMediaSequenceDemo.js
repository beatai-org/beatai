import React, { useMemo } from 'react';
import { SceneSequencePlayer } from '../common';

const VIEWPORT = { width: 960, height: 540 };
const MEDIA_STAGE_BACKGROUND = {
  light: 'linear-gradient(180deg, #ffffff, #f8fafc)',
  dark: 'linear-gradient(180deg, #0f172a, #111827)'
};

function ImageMediaSequenceDemo() {
  const scenes = useMemo(() => ([
    {
      id: 'png-frame-1',
      shortLabel: 'PNG 01',
      badge: 'Image Stage',
      title: '静态 PNG 分镜',
      description: '播放器不再只接受 SVG。这里直接播放 PNG 图片资源，适合教材截图、设计稿、流程快照。',
      durationMs: 2400,
      media: {
        src: '/docs/learn-ai/deep-learning/imgs/0201.png',
        alt: '静态 PNG 分镜 1',
        fit: 'contain',
        background: MEDIA_STAGE_BACKGROUND,
        caption: 'Scene 1: 使用 PNG 作为当前分镜画面。'
      },
      stats: [
        { label: '媒体类型', value: 'png' },
        { label: '适合内容', value: '截图 / 图示' }
      ],
      notes: [
        '如果你的演示素材已经是图片文件，不需要强行转成 SVG 再播放。',
        '对外部生成内容、设计图、教材插图，这种接法更直接。'
      ]
    },
    {
      id: 'png-frame-2',
      shortLabel: 'PNG 02',
      badge: 'Image Stage',
      title: '多张图片也能组成时序动画',
      description: '不同 scene 切换不同图片，就能形成“逐帧演进”的视觉效果。',
      durationMs: 2400,
      media: {
        src: '/docs/learn-ai/deep-learning/imgs/0202.png',
        alt: '静态 PNG 分镜 2',
        fit: 'contain',
        background: MEDIA_STAGE_BACKGROUND,
        caption: 'Scene 2: 切换到另一张 PNG，形成图片序列。'
      },
      stats: [
        { label: '媒体类型', value: 'png' },
        { label: '切换方式', value: 'scene 切换' }
      ],
      notes: [
        '这对“架构图快照演变”“产品页面迭代”“课件步骤图”很实用。',
        '调用方式和 SVG scene 一样，仍然由同一个播放器管理时间轴。'
      ]
    },
    {
      id: 'gif-frame',
      shortLabel: 'GIF',
      badge: 'Animated Image',
      title: 'GIF 也能直接承载',
      description: '如果素材本身已经带帧动画，例如 GIF，也可以直接作为一个 scene 播放。',
      durationMs: 2600,
      media: {
        src: '/docs/learn-ai/deep-learning/imgs/0201.gif',
        alt: 'GIF 动图分镜',
        fit: 'contain',
        background: MEDIA_STAGE_BACKGROUND,
        caption: 'Scene 3: GIF 自带动画，播放器只负责切换和编排。'
      },
      stats: [
        { label: '媒体类型', value: 'gif' },
        { label: '适合内容', value: '已有动图' }
      ],
      notes: [
        '这意味着组件现在可以编排 svg、png、jpg、webp、gif 等图片资源。',
        '如果后面要支持 video 或 canvas，再扩一个新的 stage 类型即可。'
      ]
    }
  ]), []);

  return (
    <SceneSequencePlayer
      title="图片媒体分镜"
      description="同一个播放器现在既能播 SVG 场景，也能播普通图片资源，适合快照序列和现成动图。"
      scenes={scenes}
      viewport={VIEWPORT}
      autoPlay
      loop
      className="animation-demo-card"
    />
  );
}

export default ImageMediaSequenceDemo;
