export function getAnnotationTimestamp(value) {
  return new Date(value).getTime();
}

export function getAnnotationBookName(annotation) {
  const pathParts = annotation.path.split('/').filter(Boolean);
  return pathParts[0] || 'Uncategorized';
}

export function getAnnotationPageTitle(annotation) {
  return annotation.pageTitle || annotation.path.split('/').pop() || 'Untitled';
}

export function formatAnnotationDate(createdAt) {
  return new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function buildBookGroups(allAnnotations) {
  const annotations = Object.values(allAnnotations).flat();
  const byBook = annotations.reduce((acc, annotation) => {
    const bookName = getAnnotationBookName(annotation);

    if (!acc[bookName]) {
      acc[bookName] = [];
    }

    acc[bookName].push(annotation);
    return acc;
  }, {});

  return Object.entries(byBook).map(([bookName, bookAnnotations]) => {
    const pageGroups = bookAnnotations.reduce((acc, annotation) => {
      const title = getAnnotationPageTitle(annotation);

      if (!acc[title]) {
        acc[title] = {
          title,
          path: annotation.path,
          annotations: []
        };
      }

      acc[title].annotations.push(annotation);
      return acc;
    }, {});

    const sortedPageGroups = Object.values(pageGroups).map((group) => ({
      ...group,
      annotations: [...group.annotations].sort(
        (a, b) => getAnnotationTimestamp(b.createdAt) - getAnnotationTimestamp(a.createdAt)
      )
    })).sort(
      (a, b) => getAnnotationTimestamp(b.annotations[0].createdAt) - getAnnotationTimestamp(a.annotations[0].createdAt)
    );

    return {
      bookName,
      pageGroups: sortedPageGroups,
      totalCount: bookAnnotations.length,
      newestTime: Math.max(...bookAnnotations.map((annotation) => getAnnotationTimestamp(annotation.createdAt)))
    };
  }).sort((a, b) => b.newestTime - a.newestTime);
}

export function getFilteredPageGroups(bookGroups, activeBook) {
  if (activeBook === 'all') {
    return bookGroups.flatMap((book) =>
      book.pageGroups.map((group) => ({
        ...group,
        bookName: book.bookName
      }))
    ).sort(
      (a, b) => getAnnotationTimestamp(b.annotations[0].createdAt) - getAnnotationTimestamp(a.annotations[0].createdAt)
    );
  }

  const selectedBook = bookGroups.find((book) => book.bookName === activeBook);
  return selectedBook ? selectedBook.pageGroups.map((group) => ({
    ...group,
    bookName: selectedBook.bookName
  })) : [];
}

export function getTotalAnnotationCount(bookGroups) {
  return bookGroups.reduce((sum, book) => sum + book.totalCount, 0);
}
