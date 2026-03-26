import React, { useEffect, useMemo, useState } from 'react';
import { SceneSequencePlayer } from '../../common';
import { resolveContentAssetUrl, resolveMarkdownAssetUrl } from '../../../utils/markdown';

function normalizeImageItem(item, index, baseUrl) {
  if (typeof item === 'string') {
    return {
      id: `scene-image-${index + 1}`,
      shortLabel: `Scene ${index + 1}`,
      title: `Scene ${index + 1}`,
      stageType: 'image',
      media: {
        src: resolveContentAssetUrl(item, baseUrl),
        alt: `Scene ${index + 1}`
      }
    };
  }

  const resolvedSrc = resolveContentAssetUrl(item?.src, baseUrl);

  return {
    id: item?.id || `scene-image-${index + 1}`,
    shortLabel: item?.shortLabel || item?.label || `Scene ${index + 1}`,
    title: item?.title || item?.label || `Scene ${index + 1}`,
    description: item?.description || '',
    durationMs: item?.durationMs,
    stageType: 'image',
    media: {
      ...item?.media,
      src: resolvedSrc,
      alt: item?.alt || item?.title || item?.label || `Scene ${index + 1}`,
      fit: item?.fit || item?.media?.fit,
      caption: item?.caption || item?.media?.caption,
      background: item?.background || item?.media?.background,
      objectPosition: item?.objectPosition || item?.media?.objectPosition
    }
  };
}

function normalizeSceneItem(scene, index, baseUrl) {
  if (scene?.stageType === 'image' || scene?.media?.src) {
    return {
      ...scene,
      id: scene.id || `scene-${index + 1}`,
      shortLabel: scene.shortLabel || scene.title || `Scene ${index + 1}`,
      title: scene.title || scene.shortLabel || `Scene ${index + 1}`,
      media: {
        ...scene.media,
        src: resolveContentAssetUrl(scene.media?.src, baseUrl)
      }
    };
  }

  return {
    ...scene,
    id: scene?.id || `scene-${index + 1}`,
    shortLabel: scene?.shortLabel || scene?.title || `Scene ${index + 1}`,
    title: scene?.title || scene?.shortLabel || `Scene ${index + 1}`
  };
}

function buildConfigFromProps(props, baseUrl) {
  const images = Array.isArray(props.images) ? props.images : null;
  const scenes = Array.isArray(props.scenes) ? props.scenes : null;
  const normalizedScenes = scenes?.length
    ? scenes.map((scene, index) => normalizeSceneItem(scene, index, baseUrl))
    : images?.length
      ? images.map((item, index) => normalizeImageItem(item, index, baseUrl))
      : [];

  return {
    title: props.title || 'Scene Sequence',
    description: props.description || '',
    viewport: props.viewport,
    defaultDurationMs: props.defaultDurationMs ?? props.defaultdurationms,
    autoPlay: props.autoPlay ?? props.autoplay ?? true,
    loop: props.loop ?? true,
    scenes: normalizedScenes
  };
}

function normalizeLoadedConfig(config, baseUrl) {
  return buildConfigFromProps(config || {}, baseUrl);
}

function LoadingState() {
  return <p className="doc-p">Loading scene sequence...</p>;
}

function ErrorState({ message }) {
  return (
    <blockquote className="doc-blockquote">
      <strong>Failed to load scene sequence:</strong>
      {' '}
      {message}
    </blockquote>
  );
}

function EmptyState() {
  return (
    <blockquote className="doc-blockquote">
      <strong>Invalid scene sequence:</strong>
      {' '}
      provide `src`, `images`, or `scenes`.
    </blockquote>
  );
}

function SceneSequenceDocEmbed({ markdownUrl = '', src = '', ...props }) {
  const resolvedConfigUrl = useMemo(() => {
    if (!src) {
      return '';
    }

    return resolveMarkdownAssetUrl(src, markdownUrl);
  }, [markdownUrl, src]);

  const inlineConfig = useMemo(() => {
    if (resolvedConfigUrl) {
      return null;
    }

    return buildConfigFromProps(props, markdownUrl);
  }, [markdownUrl, props, resolvedConfigUrl]);

  const [remoteConfig, setRemoteConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!resolvedConfigUrl) {
      setRemoteConfig(null);
      setLoading(false);
      setError('');
      return undefined;
    }

    const controller = new AbortController();

    setLoading(true);
    setError('');
    setRemoteConfig(null);

    fetch(resolvedConfigUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      })
      .then((value) => {
        setRemoteConfig(normalizeLoadedConfig(value, resolvedConfigUrl));
        setLoading(false);
      })
      .catch((fetchError) => {
        if (fetchError.name === 'AbortError') {
          return;
        }

        setError(fetchError.message || 'Unknown error');
        setLoading(false);
      });

    return () => controller.abort();
  }, [resolvedConfigUrl]);

  const config = resolvedConfigUrl ? remoteConfig : inlineConfig;

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!config?.scenes?.length) {
    return <EmptyState />;
  }

  return (
    <div className="doc-embedded-component" data-doc-component="scene-sequence">
      <SceneSequencePlayer
        title={config.title}
        description={config.description}
        scenes={config.scenes}
        viewport={config.viewport}
        defaultDurationMs={config.defaultDurationMs}
        autoPlay={config.autoPlay}
        loop={config.loop}
      />
    </div>
  );
}

export default SceneSequenceDocEmbed;
