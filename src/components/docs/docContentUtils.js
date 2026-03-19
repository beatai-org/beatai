export function formatPublishedDate(publishedAt) {
  if (!publishedAt) {
    return '';
  }

  const [year, month, day] = publishedAt.split('-').map(Number);
  if (!year || !month || !day) {
    return publishedAt;
  }

  return `${year}年${month}月${day}日`;
}

export function formatDocErrorMessage(error) {
  if (!error?.message) {
    return 'Document not found';
  }

  return error.message === 'HTTP error! status: 404' ? 'Document not found' : error.message;
}

export function buildFallbackTitleFromPath(docPath) {
  return docPath.split('/').pop()?.split('-').map((word) =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Untitled';
}

export function buildDocPageTitle(docPath, titleFromMeta, frontmatterTitle) {
  return titleFromMeta || frontmatterTitle || buildFallbackTitleFromPath(docPath);
}

export function buildDocPageDescription(frontmatterDescription, pageTitle) {
  return frontmatterDescription || `Documentation for ${pageTitle}`;
}

export function stripAiInsightsTitle(content, isAiInsightsArticle) {
  if (!isAiInsightsArticle) {
    return content;
  }

  return content.replace(/^\s*#\s+.+?(?:\r?\n){1,2}/, '');
}
