import React from 'react';

export function slugifyHeading(text) {
  return encodeURIComponent(
    String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
    .replace(/%20/g, '-')
    .replace(/[!'()*]/g, (char) => char)
    .replace(/%2D/g, '-');
}

export function getTextContent(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => getTextContent(item)).join('');
  }

  if (React.isValidElement(value)) {
    return getTextContent(value.props?.children);
  }

  return '';
}

export function resolvePublicContentUrl(contentPath) {
  if (!contentPath) {
    return '';
  }

  if (/^https?:\/\//.test(contentPath)) {
    return contentPath;
  }

  const publicBase = process.env.PUBLIC_URL || '';
  const normalizedPath = contentPath.startsWith('/') ? contentPath : `/${contentPath}`;

  return `${publicBase}${normalizedPath}`;
}

function isRelativeContentPath(contentPath) {
  return Boolean(contentPath)
    && !/^(?:[a-z]+:)?\/\//i.test(contentPath)
    && !contentPath.startsWith('/')
    && !contentPath.startsWith('#');
}

export function resolveMarkdownAssetUrl(assetPath, markdownUrl) {
  if (!assetPath || !isRelativeContentPath(assetPath) || !markdownUrl) {
    return assetPath;
  }

  const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';

  try {
    return new URL(assetPath, new URL(markdownUrl, baseOrigin)).toString();
  } catch (error) {
    return assetPath;
  }
}
