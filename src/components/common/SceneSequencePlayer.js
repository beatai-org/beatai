import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '../../utils/classNames';
import { useTheme } from '../../contexts/ThemeContext';
import './SceneSequencePlayer.css';

const PLAYBACK_SPEED_OPTIONS = [0.5, 0.75, 1, 1.5, 2];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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
  const [playbackSpeed, setPlaybackSpeed] = useState(0.75);
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

    const durationMs = Math.max((currentScene?.durationMs || defaultDurationMs) / playbackSpeed, 800 / playbackSpeed);
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
    playbackSpeed,
    totalScenes
  ]);

  const viewportWidth = viewport?.width || 960;
  const viewportHeight = viewport?.height || 540;

  const goToScene = (nextIndex, options = {}) => {
    const {
      progress = 0,
      pause = false
    } = options;

    if (nextIndex < 0 || nextIndex >= totalScenes) {
      return;
    }

    setCurrentSceneIndex(nextIndex);
    setSceneProgress(clamp(progress, 0, 1));

    if (pause) {
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (totalScenes === 0) {
      return;
    }

    const previousIndex = currentSceneIndex === 0 ? totalScenes - 1 : currentSceneIndex - 1;
    goToScene(previousIndex, { progress: 1, pause: true });
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

    goToScene(nextIndex, { progress: 1, pause: true });
  };

  const handleTogglePlayback = () => {
    if (totalScenes === 0) {
      return;
    }

    if (!isPlaying && sceneProgress >= 1) {
      if (currentSceneIndex === totalScenes - 1 && !loop) {
        setCurrentSceneIndex(0);
      }

      setSceneProgress(0);
    }

    setIsPlaying((previousValue) => !previousValue);
  };

  if (!currentScene) {
    return null;
  }

  return (
    <section
      className={cn('scene-sequence-player', className)}
      data-theme-mode={theme}
      aria-label={title || currentScene.title || 'Scene sequence player'}
    >
      <div className="scene-sequence-player__header">
        {currentScene.description || description ? (
          <p className="scene-sequence-player__scene-description">
            {currentScene.description || description}
          </p>
        ) : null}
      </div>

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

      <div className="scene-sequence-player__controls" role="group" aria-label="Scene playback controls">
        <button
          type="button"
          className="scene-sequence-player__control-btn"
          onClick={handlePrevious}
          aria-label="Previous scene"
          title="Previous scene"
        >
          <SkipBack size={18} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          className={cn('scene-sequence-player__control-btn', 'primary')}
          onClick={handleTogglePlayback}
          aria-label={isPlaying ? 'Pause playback' : 'Play sequence'}
          title={isPlaying ? 'Pause playback' : 'Play sequence'}
        >
          {isPlaying ? <Pause size={18} strokeWidth={2.2} /> : <Play size={18} strokeWidth={2.2} />}
        </button>
        <button
          type="button"
          className="scene-sequence-player__control-btn"
          onClick={handleNext}
          aria-label="Next scene"
          title="Next scene"
        >
          <SkipForward size={18} strokeWidth={2.2} />
        </button>
        <label className="scene-sequence-player__speed-select-wrap">
          <select
            className="scene-sequence-player__speed-select"
            value={String(playbackSpeed)}
            onChange={(event) => setPlaybackSpeed(Number(event.target.value))}
            aria-label="Playback speed"
          >
            {PLAYBACK_SPEED_OPTIONS.map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

export default SceneSequencePlayer;
