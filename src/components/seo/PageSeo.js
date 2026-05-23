import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getPageConfig } from '../../utils/pageConfig';
import { buildSiteTitle, SITE_CONFIG } from '../../utils/siteConfig';

const DESCRIPTION_SELECTOR = 'meta[name="description"]';
const PAGE_SEO_ATTR = 'data-page-seo';

function PageSeo({
  pageId,
  title,
  description,
  titleBuilder = buildSiteTitle,
  openGraphTitle,
  openGraphDescription,
  children
}) {
  const pageConfig = pageId ? getPageConfig(pageId) : null;
  const pageTitle = title ?? pageConfig?.title ?? '';
  const pageDescription = description ?? pageConfig?.description ?? '';
  const effectiveDescription = pageDescription || SITE_CONFIG.defaultDescription;
  const documentTitle = pageTitle ? titleBuilder(pageTitle) : '';

  useEffect(() => {
    if (!effectiveDescription || typeof document === 'undefined') {
      return;
    }

    const descriptionMetas = [...document.head.querySelectorAll(DESCRIPTION_SELECTOR)];
    let primaryMeta = descriptionMetas.find((node) => node.getAttribute(PAGE_SEO_ATTR) === 'true');

    if (!primaryMeta) {
      primaryMeta = descriptionMetas[0] || document.createElement('meta');
      primaryMeta.setAttribute('name', 'description');
      primaryMeta.setAttribute(PAGE_SEO_ATTR, 'true');
    }

    primaryMeta.setAttribute('content', effectiveDescription);

    if (!primaryMeta.parentNode) {
      document.head.appendChild(primaryMeta);
    }

    descriptionMetas
      .filter((node) => node !== primaryMeta)
      .forEach((node) => node.parentNode?.removeChild(node));
  }, [effectiveDescription]);

  return (
    <Helmet>
      {documentTitle && <title>{documentTitle}</title>}
      {openGraphTitle && <meta property="og:title" content={openGraphTitle} />}
      {openGraphDescription && <meta property="og:description" content={openGraphDescription} />}
      {children}
    </Helmet>
  );
}

export default PageSeo;
