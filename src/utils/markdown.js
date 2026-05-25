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
  return resolveContentAssetUrl(assetPath, markdownUrl);
}

export function resolveContentAssetUrl(assetPath, baseUrl) {
  if (!assetPath || !isRelativeContentPath(assetPath) || !baseUrl) {
    return assetPath;
  }

  const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';

  try {
    return new URL(assetPath, new URL(baseUrl, baseOrigin)).toString();
  } catch (error) {
    return assetPath;
  }
}

export function normalizeDocComponentMarkdown(markdown) {
  if (!markdown) {
    return '';
  }

  // CommonMark type-7 HTML blocks require the line to contain only an opening
  // tag (or only a closing tag); a paired `<x>...</x>` on the same line falls
  // back to inline HTML and gets wrapped in <p>. parse5 also refuses to honor
  // XHTML-style self-closing on custom elements, so `<doc-component ... />`
  // would swallow every following sibling as a child. Split into two lines so
  // each tag is its own type-7 block AND parse5 sees a real closing tag.
  return String(markdown).replace(
    /<doc-component\b([^>]*?)\s*\/>/g,
    '<doc-component$1>\n</doc-component>'
  );
}
