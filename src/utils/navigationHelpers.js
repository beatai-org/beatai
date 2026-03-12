/**
 * 将嵌套的 _meta.json 结构展平为线性章节列表
 * @param {Object} meta - _meta.json 数据
 * @returns {Array} - 扁平化的章节列表 [{title, path, category, section}]
 */
export function flattenChapters(meta) {
  const chapters = [];

  // 递归函数处理 items 和 children
  function processItems(items, categoryTitle, sectionTitle) {
    items.forEach(item => {
      chapters.push({
        title: item.title,
        path: item.path,
        category: categoryTitle,
        section: sectionTitle
      });

      // 递归处理子章节
      if (item.children && item.children.length > 0) {
        processItems(item.children, categoryTitle, sectionTitle);
      }
    });
  }

  // 遍历所有分类和分区
  meta.categories?.forEach(category => {
    category.sections?.forEach(section => {
      if (section.items) {
        processItems(section.items, category.title, section.title);
      }
    });
  });

  return chapters;
}

/**
 * 获取指定路径的前后章节
 * @param {Array} chapters - 扁平化章节列表
 * @param {string} currentPath - 当前章节路径
 * @returns {Object} - {prev: {...}, next: {...}} 或 null
 */
export function getAdjacentChapters(chapters, currentPath) {
  const currentIndex = chapters.findIndex(ch => ch.path === currentPath);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const currentChapter = chapters[currentIndex];
  const currentCategory = currentChapter.category;

  // 查找前一章，但必须在同一分类（书籍）内
  let prev = null;
  if (currentIndex > 0) {
    const prevChapter = chapters[currentIndex - 1];
    if (prevChapter.category === currentCategory) {
      prev = prevChapter;
    }
  }

  // 查找下一章，但必须在同一分类（书籍）内
  let next = null;
  if (currentIndex < chapters.length - 1) {
    const nextChapter = chapters[currentIndex + 1];
    if (nextChapter.category === currentCategory) {
      next = nextChapter;
    }
  }

  return { prev, next };
}
