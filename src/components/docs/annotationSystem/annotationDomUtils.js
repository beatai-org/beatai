const HIGHLIGHT_CLASS = 'highlighted-text';

export function isHighlightedElement(target) {
  return target?.classList?.contains(HIGHLIGHT_CLASS);
}

export function getSelectionToolbarPosition(range) {
  const rect = range.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top - 10
  };
}

export function getAnnotationPopupPosition(target) {
  const rect = target.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.bottom + window.scrollY + 10
  };
}

function replaceHighlight(highlight) {
  const textNode = document.createTextNode(highlight.textContent);
  highlight.parentNode.replaceChild(textNode, highlight);
}

export function clearHighlights(container) {
  const existingHighlights = container.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
  existingHighlights.forEach(replaceHighlight);
}

export function highlightTextInDOM(container, annotation) {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  let node;

  // eslint-disable-next-line no-cond-assign
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }

  for (const textNode of textNodes) {
    const text = textNode.textContent;
    const index = text.indexOf(annotation.text);

    if (index !== -1 && !textNode.parentElement.classList.contains(HIGHLIGHT_CLASS)) {
      const range = document.createRange();
      range.setStart(textNode, index);
      range.setEnd(textNode, index + annotation.text.length);

      const span = document.createElement('span');
      span.className = HIGHLIGHT_CLASS;
      span.dataset.annotationId = annotation.id;
      span.textContent = annotation.text;

      range.deleteContents();
      range.insertNode(span);
      break;
    }
  }
}

export function applyAllHighlights(annotationsToApply) {
  const docContent = document.querySelector('.doc-content');

  if (!docContent) {
    return;
  }

  clearHighlights(docContent);
  annotationsToApply.forEach((annotation) => {
    highlightTextInDOM(docContent, annotation);
  });
}

export function removeHighlightById(annotationId) {
  const highlightedElements = document.querySelectorAll(
    `.${HIGHLIGHT_CLASS}[data-annotation-id="${annotationId}"]`
  );

  highlightedElements.forEach(replaceHighlight);
}

export function scrollToAnnotation(annotationId) {
  setTimeout(() => {
    const targetElement = document.querySelector(
      `.${HIGHLIGHT_CLASS}[data-annotation-id="${annotationId}"]`
    );

    if (!targetElement) {
      return;
    }

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    targetElement.classList.add('annotation-pulse');
    setTimeout(() => {
      targetElement.classList.remove('annotation-pulse');
    }, 2000);

    window.history.replaceState(null, '', window.location.pathname);
  }, 100);
}

export function getAnnotationPreview(text, maxLength = 100) {
  const preview = text.substring(0, maxLength);
  return `"${preview}${text.length > maxLength ? '...' : ''}"`;
}
