import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/classNames';
import { useTheme } from '../../contexts/ThemeContext';
import './SceneSequencePlayer.css';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeStatValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function resolveThemeValue(value, theme, fallback) {
  if (typeof value === 'function') {
    return value(theme);
  }

  if (value && typeof value === 'object') {
    return value[theme] || value.light || value.dark || fallback;
  }

  return value || fallback;
}

function renderSceneStage({
  currentScene,
  renderSceneFrame,
  sceneProgress,
  stageClassName,
  viewport,
  viewportWidth,
  viewportHeight,
  theme
}) {
  const stageType = currentScene.stageType || (currentScene.media ? 'image' : 'svg');

  if (stageType === 'image' && currentScene.media?.src) {
    const fit = currentScene.media.fit || 'contain';
    const objectPosition = currentScene.media.objectPosition || 'center';

    return (
      <div
        className={cn('scene-sequence-player__media-stage', stageClassName)}
        role="img"
        aria-label={currentScene.media.alt || currentScene.title}
        style={{
          '--scene-media-fit': fit,
          '--scene-media-position': objectPosition,
          '--scene-media-background': resolveThemeValue(
            currentScene.media.background,
            theme,
            'var(--scene-stage-bg)'
          )
        }}
      >
        <img
          src={currentScene.media.src}
          alt={currentScene.media.alt || currentScene.title}
          className="scene-sequence-player__media-image"
          loading="lazy"
        />
        {currentScene.media.caption ? (
          <div className="scene-sequence-player__media-caption">{currentScene.media.caption}</div>
        ) : null}
        {currentScene.renderOverlay ? currentScene.renderOverlay({ progress: sceneProgress, viewport, theme }) : null}
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
      className={cn('scene-sequence-player__stage', stageClassName)}
      role="img"
      aria-label={currentScene.title}
    >
      {renderSceneFrame ? renderSceneFrame({ scene: currentScene, progress: sceneProgress, viewport, theme }) : null}
      {currentScene.renderScene ? currentScene.renderScene({ progress: sceneProgress, viewport, theme }) : null}
    </svg>
  );
}

function SceneSequencePlayer({
  title,
  description,
  scenes = [],
  viewport = { width: 960, height: 540 },
  defaultDurationMs = 3200,
  autoPlay = true,
  loop = true,
  className = '',
  stageClassName = '',
  renderSceneFrame = null
}) {
  const { theme } = useTheme();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const progressRef = useRef(0);

  const safeScenes = useMemo(() => scenes.filter(Boolean), [scenes]);
  const currentScene = safeScenes[currentSceneIndex] || null;
  const totalScenes = safeScenes.length;

  useEffect(() => {
    setCurrentSceneIndex(0);
    setSceneProgress(0);
  }, [totalScenes]);

  useEffect(() => {
    setIsPlaying(autoPlay);
  }, [autoPlay]);

  useEffect(() => {
    progressRef.current = sceneProgress;
  }, [sceneProgress]);

  useEffect(() => {
    if (!isPlaying || totalScenes === 0) {
      return undefined;
    }

    const durationMs = Math.max(currentScene?.durationMs || defaultDurationMs, 800);
    const startedAt = performance.now() - (progressRef.current * durationMs);

    const intervalId = window.setInterval(() => {
      const nextProgress = clamp((performance.now() - startedAt) / durationMs, 0, 1);

      setSceneProgress(nextProgress);

      if (nextProgress < 1) {
        return;
      }

      window.clearInterval(intervalId);

      const isLastScene = currentSceneIndex === totalScenes - 1;

      if (isLastScene && !loop) {
        setIsPlaying(false);
        return;
      }

      setCurrentSceneIndex((previousIndex) => (previousIndex + 1) % totalScenes);
      setSceneProgress(0);
    }, 32);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    currentScene,
    currentSceneIndex,
    defaultDurationMs,
    isPlaying,
    loop,
    totalScenes
  ]);

  const viewportWidth = viewport?.width || 960;
  const viewportHeight = viewport?.height || 540;

  const goToScene = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= totalScenes) {
      return;
    }

    setCurrentSceneIndex(nextIndex);
    setSceneProgress(0);
  };

  const handlePrevious = () => {
    if (totalScenes === 0) {
      return;
    }

    const previousIndex = currentSceneIndex === 0 ? totalScenes - 1 : currentSceneIndex - 1;
    goToScene(previousIndex);
  };

  const handleNext = () => {
    if (totalScenes === 0) {
      return;
    }

    const nextIndex = (currentSceneIndex + 1) % totalScenes;

    if (!loop && currentSceneIndex === totalScenes - 1) {
      setIsPlaying(false);
      setSceneProgress(1);
      return;
    }

    goToScene(nextIndex);
  };

  const handleTogglePlayback = () => {
    if (totalScenes === 0) {
      return;
    }

    if (currentSceneIndex === totalScenes - 1 && sceneProgress >= 1 && !loop) {
      setCurrentSceneIndex(0);
      setSceneProgress(0);
    }

    setIsPlaying((previousValue) => !previousValue);
  };

  if (!currentScene) {
    return null;
  }

  return (
    <section className={cn('scene-sequence-player', className)} data-theme-mode={theme}>
      <div className="scene-sequence-player__header">
        <div>
          <h2 className="scene-sequence-player__title">{title}</h2>
          {description ? (
            <p className="scene-sequence-player__description">{description}</p>
          ) : null}
        </div>
        <div className="scene-sequence-player__status">
          <span className="scene-sequence-player__status-pill">
            Scene {currentSceneIndex + 1}/{totalScenes}
          </span>
          {isPlaying ? (
            <span className="scene-sequence-player__status-pill active">Autoplay</span>
          ) : null}
        </div>
      </div>

      <div className="scene-sequence-player__body">
        <div className="scene-sequence-player__stage-shell">
          {renderSceneStage({
            currentScene,
            renderSceneFrame,
            sceneProgress,
            stageClassName,
            viewport,
            viewportWidth,
            viewportHeight,
            theme
          })}
        </div>

        <div className="scene-sequence-player__panel">
          <div className="scene-sequence-player__panel-top">
            {currentScene.badge ? (
              <span className="scene-sequence-player__badge">{currentScene.badge}</span>
            ) : null}
            <h3 className="scene-sequence-player__scene-title">{currentScene.title}</h3>
            {currentScene.description ? (
              <p className="scene-sequence-player__scene-description">{currentScene.description}</p>
            ) : null}
          </div>

          {currentScene.formula ? (
            <pre className="scene-sequence-player__formula">{currentScene.formula}</pre>
          ) : null}

          {currentScene.stats?.length ? (
            <div className="scene-sequence-player__stats">
              {currentScene.stats.map((stat) => (
                <div key={stat.label} className="scene-sequence-player__stat-card">
                  <span className="scene-sequence-player__stat-label">{stat.label}</span>
                  <strong className="scene-sequence-player__stat-value">{normalizeStatValue(stat.value)}</strong>
                </div>
              ))}
            </div>
          ) : null}

          {currentScene.notes?.length ? (
            <ul className="scene-sequence-player__notes">
              {currentScene.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}

          <div className="scene-sequence-player__controls">
            <button type="button" className="scene-sequence-player__control-btn" onClick={handlePrevious}>
              Prev
            </button>
            <button type="button" className="scene-sequence-player__control-btn primary" onClick={handleTogglePlayback}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button type="button" className="scene-sequence-player__control-btn" onClick={handleNext}>
              Next
            </button>
          </div>

          <div className="scene-sequence-player__scene-tabs" role="tablist" aria-label={`${title} scenes`}>
            {safeScenes.map((scene, index) => (
              <button
                key={scene.id || scene.title}
                type="button"
                role="tab"
                aria-selected={index === currentSceneIndex}
                className={cn('scene-sequence-player__scene-tab', index === currentSceneIndex && 'active')}
                onClick={() => goToScene(index)}
              >
                <span className="scene-sequence-player__scene-tab-index">{index + 1}</span>
                <span className="scene-sequence-player__scene-tab-label">{scene.shortLabel || scene.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SceneSequencePlayer;
