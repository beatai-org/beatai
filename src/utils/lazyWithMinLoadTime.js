/**
 * 延迟加载工具
 * 确保Loading动画至少显示指定时长后再加载组件
 *
 * @param {Function} importFunc - 动态导入函数
 * @param {number} minLoadTime - 最小加载时间（毫秒），默认1000ms
 * @returns {Promise} 延迟后的组件导入Promise
 */
export const lazyWithMinLoadTime = (importFunc, minLoadTime = 1200) => {
  return new Promise((resolve) => {
    const startTime = Date.now();

    importFunc().then((module) => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);

      setTimeout(() => {
        resolve(module);
      }, remaining);
    });
  });
};

export default lazyWithMinLoadTime;
