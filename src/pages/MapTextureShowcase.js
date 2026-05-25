import React, { useState } from 'react';
import PageShell from '../components/layout/PageShell';
import PageSeo from '../components/seo/PageSeo';
import { SITE_CONFIG } from '../utils/siteConfig';
import { PAGE_IDS } from '../utils/pageConfig';
import './MapTextureShowcase.css';

const PUBLIC_ROOT = process.env.PUBLIC_URL || '';

const MAP_TEXTURE_OPTIONS = [
  {
    id: 'pandemos',
    name: '帝国地图',
    style: '史诗帝国 / 高细节 / 桌游感',
    fit: `最适合做 ${SITE_CONFIG.brandName} 大陆的主视觉底图，细节丰富但不幼稚。`,
    resolution: '3235 x 1970',
    image: `${PUBLIC_ROOT}/images/map-texture-showcase/pandemos-empire-map.png`,
    source: 'https://opengameart.org/content/map-of-the-pandemos-empire-world-of-sustelas'
  },
  {
    id: 'watercolor',
    name: '水彩大陆',
    style: '手绘水彩 / 高级插画 / 柔和',
    fit: '更偏品牌展示和设定集封面，氛围感强。',
    resolution: '3800 x 2607',
    image: `${PUBLIC_ROOT}/images/map-texture-showcase/watercolor-world-map.png`,
    source: 'https://opengameart.org/content/watercolor-world-map'
  },
  {
    id: 'old-world',
    name: '古典航海图',
    style: '羊皮纸 / 旧世界 / 航海探索',
    fit: '适合做带文明、王国、路线的老派世界观。',
    resolution: '1600 x 1200',
    image: `${PUBLIC_ROOT}/images/map-texture-showcase/old-world-map.png`,
    source: 'https://opengameart.org/content/old-world-map'
  },
  {
    id: 'fantasy-generated',
    name: '程序幻想大陆',
    style: '大地图 / 地形分布完整 / 游戏感',
    fit: '结构完整，适合测试节点和区域划分。',
    resolution: '4000 x 2000',
    image: `${PUBLIC_ROOT}/images/map-texture-showcase/fantasy-generated-map.gif`,
    source: 'https://opengameart.org/content/fantasy-world-map'
  },
  {
    id: 'parchment-scroll',
    name: '卷轴场景地图',
    style: '卷轴 UI / 地图界面 / 展示型',
    fit: '适合做章节地图或任务航线页，不像主大陆底图那么自由。',
    resolution: '1920 x 1080',
    image: `${PUBLIC_ROOT}/images/map-texture-showcase/parchment-scroll-map.png`,
    source: 'https://opengameart.org/content/map'
  },
  {
    id: 'example-map',
    name: '羊皮纸插画地图',
    style: '奇幻 RPG / 插画化 / 中世纪',
    fit: '适合偏设定、偏冒险叙事的地图页。',
    resolution: '1335 x 931',
    image: `${PUBLIC_ROOT}/images/map-texture-showcase/example-map.png`,
    source: 'https://opengameart.org/content/simple-map-tiles'
  },
  {
    id: 'island-map',
    name: '岛屿地形图',
    style: '单大陆 / 山脉森林明确 / 模组风',
    fit: '适合先搭学习路径，再慢慢精修节点落位。',
    resolution: '800 x 600',
    image: `${PUBLIC_ROOT}/images/map-texture-showcase/island-map.png`,
    source: 'https://opengameart.org/content/island-map'
  },
  {
    id: 'worldmap-tileset',
    name: '经典 JRPG 世界地图',
    style: '16-bit / JRPG / Overworld',
    fit: '适合做复古路线图和像素大陆演示。',
    resolution: '256 x 336',
    image: `${PUBLIC_ROOT}/images/map-texture-showcase/worldmap-overworld-tileset.png`,
    source: 'https://opengameart.org/content/worldmapoverworld-tileset'
  },
  {
    id: 'gameboy',
    name: 'GameBoy 俯视地图',
    style: '掌机复古 / 极简 / 像素',
    fit: '风格非常强，但只适合做彩蛋或复古分支页。',
    resolution: '160 x 112',
    image: `${PUBLIC_ROOT}/images/map-texture-showcase/gameboy-overworld-map.png`,
    source: 'https://opengameart.org/content/16x16-gameboy-style-overworld-map-tiles'
  },
  {
    id: 'overworld',
    name: '极简 Overworld',
    style: '8x8 / 小而精 / 低分辨率',
    fit: '适合做 minimap 或路线缩略视图，不适合主地图。',
    resolution: '96 x 96',
    image: `${PUBLIC_ROOT}/images/map-texture-showcase/overworld-map.png`,
    source: 'https://opengameart.org/content/overworld-map'
  }
];

export default function MapTextureShowcase() {
  const [selectedId, setSelectedId] = useState('pandemos');

  const selectedTexture = MAP_TEXTURE_OPTIONS.find((item) => item.id === selectedId) || MAP_TEXTURE_OPTIONS[0];

  return (
    <>
      <PageSeo pageId={PAGE_IDS.mapTextureShowcase} />

      <PageShell rootClassName="map-texture-page">
        <main className="map-texture-main">
          <section className="map-texture-hero">
            <p className="map-texture-kicker">Texture Lab</p>
            <h1>10 张不同风格的游戏世界贴图测试页</h1>
            <p>
              {`这一页不是最终方案，而是风格对比页。重点看三件事：底图气质够不够成熟、节点叠上去是否清楚、以及它是否适合继续演化成 ${SITE_CONFIG.brandName} 的大陆地图。`}
            </p>
          </section>

          <section className="map-texture-preview">
            <div className="map-texture-stage">
              <img src={selectedTexture.image} alt={selectedTexture.name} />
            </div>

            <aside className="map-texture-detail">
              <p className="detail-style">{selectedTexture.style}</p>
              <h2>{selectedTexture.name}</h2>
              <p className="detail-fit">{selectedTexture.fit}</p>

              <div className="detail-meta">
                <span>分辨率：{selectedTexture.resolution}</span>
                <span>用途：世界地图贴图测试</span>
              </div>

              <a href={selectedTexture.source} target="_blank" rel="noreferrer">
                打开素材来源
              </a>
            </aside>
          </section>

          <section className="map-texture-grid">
            {MAP_TEXTURE_OPTIONS.map((texture, index) => (
              <button
                key={texture.id}
                type="button"
                className={texture.id === selectedTexture.id ? 'texture-card is-active' : 'texture-card'}
                onClick={() => setSelectedId(texture.id)}
              >
                <span className="texture-card-rank">{String(index + 1).padStart(2, '0')}</span>
                <span className="texture-card-frame">
                  <img src={texture.image} alt={texture.name} loading="lazy" />
                </span>
                <span className="texture-card-copy">
                  <strong>{texture.name}</strong>
                  <span>{texture.style}</span>
                </span>
              </button>
            ))}
          </section>
        </main>
      </PageShell>
    </>
  );
}
