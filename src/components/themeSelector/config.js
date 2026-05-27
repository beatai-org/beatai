export const DEFAULT_THEME_MODE = 'light';
export const THEME_MODE_STORAGE_KEY = 'theme-mode';
export const DEFAULT_THEME_ID = 'kindle-paper';
export const DEFAULT_FONT_ID = 'pingfang';
export const DEFAULT_FONT_WEIGHT_ID = 'normal';
export const DEFAULT_FONT_SIZE_ID = '18';
export const DEFAULT_BACKGROUND_DEPTH_ID = 'soft';

export const THEMES = [
  {
    id: 'kindle-paper',
    name: 'Kindle Paper',
    gradient: 'linear-gradient(135deg, #f2f1ed 0%, #d8d7d1 58%, #3a3a37 100%)',
    gradientDark: 'linear-gradient(135deg, #141413 0%, #252522 58%, #d9d7cf 100%)',
    colors: ['#f2f1ed', '#d8d7d1', '#3a3a37']
  },
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    gradient: '#3b82f6',
    gradientDark: '#60a5fa',
    colors: ['#3b82f6'],
    isSolid: true
  },
  {
    id: 'classic-green',
    name: 'Classic Green',
    gradient: '#16a34a',
    gradientDark: '#22c55e',
    colors: ['#16a34a'],
    isSolid: true
  },
  {
    id: 'orange-red',
    name: 'Orange Red',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    gradientDark: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
    colors: ['#f97316', '#ef4444']
  },
  {
    id: 'aurora',
    name: 'Aurora',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
    gradientDark: 'linear-gradient(135deg, #22d3ee 0%, #34d399 100%)',
    colors: ['#06b6d4', '#10b981']
  },
  {
    id: 'sailor-moon',
    name: 'Sailor Moon',
    gradient: 'linear-gradient(135deg, #ff69b4 0%, #ffd700 100%)',
    gradientDark: 'linear-gradient(135deg, #ff69b4 0%, #ffd700 100%)',
    colors: ['#ff69b4', '#ffd700'],
    backgroundImage: '/images/themes/sailor-moon-bg.svg',
    isImageTheme: true
  }
];

export const FONTS = [
  {
    id: 'system',
    name: '系统默认',
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
  },
  {
    id: 'pingfang',
    name: '苹方',
    family: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
  },
  {
    id: 'microsoft-yahei',
    name: '微软雅黑',
    family: '"Microsoft YaHei", "Microsoft YaHei UI", "PingFang SC", sans-serif'
  },
  {
    id: 'noto-sans',
    name: '思源黑体',
    family: '"Noto Sans SC", sans-serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap',
    preconnects: [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ]
  },
  {
    id: 'noto-serif',
    name: '思源宋体',
    family: '"Noto Serif SC", serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600;700&display=swap',
    preconnects: [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ]
  },
  {
    id: 'lxgw-wenkai',
    name: '霞鹜文楷',
    family: '"LXGW WenKai", "KaiTi", serif',
    stylesheet: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css',
    preconnects: [
      { href: 'https://cdn.jsdelivr.net', crossOrigin: 'anonymous' }
    ]
  },
  {
    id: 'ma-shan-zheng',
    name: '马善政楷书',
    family: '"Ma Shan Zheng", cursive',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap',
    preconnects: [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ]
  },
  {
    id: 'liu-jian-mao-cao',
    name: '刘兼毛草',
    family: '"Liu Jian Mao Cao", cursive',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&display=swap',
    preconnects: [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ]
  },
  {
    id: 'zcool-qingke',
    name: '站酷高端黑',
    family: '"ZCOOL QingKe HuangYou", sans-serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=ZCOOL+QingKe+HuangYou&display=swap',
    preconnects: [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ]
  },
  {
    id: 'zhi-mang-xing',
    name: '志忙星手写',
    family: '"Zhi Mang Xing", cursive',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Zhi+Mang+Xing&display=swap',
    preconnects: [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ]
  },
  {
    id: 'zcool-kuaile',
    name: '站酷快乐体',
    family: '"ZCOOL KuaiLe", sans-serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap',
    preconnects: [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ]
  },
  {
    id: 'zcool-xiaowei',
    name: '站酷小薇',
    family: '"ZCOOL XiaoWei", serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap',
    preconnects: [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ]
  }
];

export const FONT_WEIGHTS = [
  { id: 'light', name: '细体', value: '300' },
  { id: 'normal', name: '常规', value: '400' },
  { id: 'medium', name: '中等', value: '500' },
  { id: 'semibold', name: '半粗', value: '600' },
  { id: 'bold', name: '粗体', value: '700' }
];

export const FONT_SIZES = Array.from({ length: 9 }, (_, index) => {
  const size = 14 + index;

  return {
    id: String(size),
    name: `${size}px`,
    value: `${size}px`
  };
});

export const BACKGROUND_DEPTHS = [
  {
    id: 'bright',
    name: '明亮',
    shortName: '亮',
    description: '保留原本更通透的主题背景，氛围更强。',
    pageBackgroundLight: 'transparent',
    pageBackgroundDark: 'transparent',
    overlayOpacityLight: '1',
    overlayOpacityDark: '1.3'
  },
  {
    id: 'soft',
    name: '柔和',
    shortName: '柔',
    description: '轻微压低背景亮度，兼顾主题氛围和阅读舒适度。',
    pageBackgroundLight: '#f2f5f9',
    pageBackgroundDark: '#0d111a',
    overlayOpacityLight: '0.86',
    overlayOpacityDark: '0.98'
  },
  {
    id: 'balanced',
    name: '平衡',
    shortName: '衡',
    description: '阅读和视觉效果均衡，适合作为日常默认档位。',
    pageBackgroundLight: '#eff3f8',
    pageBackgroundDark: '#0c131d',
    overlayOpacityLight: '0.72',
    overlayOpacityDark: '0.72'
  },
  {
    id: 'dim',
    name: '暗调',
    shortName: '暗',
    description: '明显压低背景存在感，让章节正文更稳定、更易读。',
    pageBackgroundLight: '#eaeff5',
    pageBackgroundDark: '#0a0d15',
    overlayOpacityLight: '0.58',
    overlayOpacityDark: '0.44'
  },
  {
    id: 'deep',
    name: '深夜',
    shortName: '深',
    description: '最克制的背景档位，适合长时间沉浸式阅读。',
    pageBackgroundLight: '#e4eaf1',
    pageBackgroundDark: '#070a0f',
    overlayOpacityLight: '0.42',
    overlayOpacityDark: '0.24'
  }
];
