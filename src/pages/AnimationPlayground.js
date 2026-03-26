import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import PageShell from '../components/layout/PageShell';
import TaylorApproximationDemo from '../components/sceneDemos/TaylorApproximationDemo';
import ArchitectureEvolutionDemo from '../components/sceneDemos/ArchitectureEvolutionDemo';
import ImageMediaSequenceDemo from '../components/sceneDemos/ImageMediaSequenceDemo';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useDocsMeta } from '../hooks/useDocsMeta';
import { buildKnowledgeSpaces } from '../utils/knowledgeSpaces';
import './AnimationPlayground.css';

function AnimationPlayground() {
  const { meta } = useDocsMeta();
  const handleCategoryClick = useCategoryNavigation();
  const spaces = useMemo(() => buildKnowledgeSpaces(meta), [meta]);
  const categories = meta?.categories || [];

  return (
    <>
      <Helmet>
        <title>Animation Playground | BeatAI</title>
        <meta
          name="description"
          content="BeatAI 通用动画组件演示页，展示数学逼近与架构演变两类动画场景。"
        />
      </Helmet>

      <PageShell
        rootClassName="animation-playground-page"
        spaces={spaces}
        activeSpace={null}
        onSpaceClick={handleCategoryClick}
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
      >
        <main className="animation-playground">
          <section className="animation-playground__hero">
            <span className="animation-playground__eyebrow">Animation Playground</span>
            <h1>通用分镜动画组件</h1>
            <p>
              底层能力只关心“场景序列 + SVG 画布 + 时间轴 + 控制条”，
              所以上面可以同时承载数学过程、架构图演变、流程拆解，后面也可以继续扩展到算法可视化和产品状态机。
            </p>
          </section>

          <section className="animation-playground__capabilities">
            <article className="animation-playground__capability-card">
              <h2>一套播放器，承载多种内容</h2>
              <p>场景本身由调用方决定，可以是曲线、节点、箭头、状态块，也可以是 png、gif 这类图片分镜。</p>
            </article>
            <article className="animation-playground__capability-card">
              <h2>既能自动播放，也能手动跳场景</h2>
              <p>组件内置播放、暂停、上一步、下一步和场景切换，不需要每个 demo 自己重做控制条。</p>
            </article>
            <article className="animation-playground__capability-card">
              <h2>示例层只负责定义媒体与场景</h2>
              <p>未来如果要加导数、积分、优化过程、消息流、架构迁移或图片快照序列，只需要继续新增 scene。</p>
            </article>
          </section>

          <div className="animation-playground__demo-stack">
            <TaylorApproximationDemo />
            <ArchitectureEvolutionDemo />
            <ImageMediaSequenceDemo />
          </div>
        </main>
      </PageShell>
    </>
  );
}

export default AnimationPlayground;
