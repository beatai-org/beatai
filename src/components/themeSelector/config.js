export const DEFAULT_THEME_ID = 'classic-mono';
export const DEFAULT_FONT_ID = 'system';
export const DEFAULT_FONT_WEIGHT_ID = 'normal';
export const DEFAULT_FONT_SIZE_ID = 'large';
export const DEFAULT_BACKGROUND_DEPTH_ID = 'balanced';

export const THEMES = [
  {
    id: 'classic-mono',
    name: 'Classic Mono',
    gradient: '#1a1a1a',
    gradientDark: '#d4d4d4',
    colors: ['#1a1a1a'],
    isSolid: true
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
    id: 'purple-pink',
    name: 'Purple Pink',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    gradientDark: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
    colors: ['#8b5cf6', '#ec4899']
  },
  {
    id: 'blue-green',
    name: 'Blue Green',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
    gradientDark: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
    colors: ['#3b82f6', '#10b981']
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
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #10b981 100%)',
    gradientDark: 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 50%, #34d399 100%)',
    colors: ['#8b5cf6', '#06b6d4', '#10b981']
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #10b981 50%, #7c3aed 100%)',
    gradientDark: 'linear-gradient(135deg, #1e40af 0%, #34d399 50%, #a78bfa 100%)',
    colors: ['#1e3a8a', '#10b981', '#7c3aed']
  },
  {
    id: 'desert-dune',
    name: 'Desert Dune',
    gradient: 'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #38bdf8 100%)',
    gradientDark: 'linear-gradient(135deg, #a16207 0%, #fbbf24 50%, #7dd3fc 100%)',
    colors: ['#92400e', '#f59e0b', '#38bdf8']
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #fb7185 50%, #2dd4bf 100%)',
    gradientDark: 'linear-gradient(135deg, #0891b2 0%, #fda4af 50%, #5eead4 100%)',
    colors: ['#0e7490', '#fb7185', '#2dd4bf']
  },
  {
    id: 'autumn-forest',
    name: 'Autumn Forest',
    gradient: 'linear-gradient(135deg, #065f46 0%, #f59e0b 50%, #dc2626 100%)',
    gradientDark: 'linear-gradient(135deg, #047857 0%, #fbbf24 50%, #f87171 100%)',
    colors: ['#065f46', '#f59e0b', '#dc2626']
  },
  {
    id: 'sailor-moon',
    name: 'Sailor Moon',
    gradient: 'linear-gradient(135deg, #ff69b4 0%, #ffd700 50%, #ff1493 100%)',
    gradientDark: 'linear-gradient(135deg, #ff69b4 0%, #ffd700 50%, #ff1493 100%)',
    colors: ['#ff69b4', '#ffd700', '#ff1493'],
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
    family: '"Noto Sans SC", sans-serif'
  },
  {
    id: 'noto-serif',
    name: '思源宋体',
    family: '"Noto Serif SC", serif'
  },
  {
    id: 'lxgw-wenkai',
    name: '霞鹜文楷',
    family: '"LXGW WenKai", "KaiTi", serif'
  },
  {
    id: 'ma-shan-zheng',
    name: '马善政楷书',
    family: '"Ma Shan Zheng", cursive'
  },
  {
    id: 'liu-jian-mao-cao',
    name: '刘兼毛草',
    family: '"Liu Jian Mao Cao", cursive'
  },
  {
    id: 'zcool-qingke',
    name: '站酷高端黑',
    family: '"ZCOOL QingKe HuangYou", sans-serif'
  },
  {
    id: 'zhi-mang-xing',
    name: '志忙星手写',
    family: '"Zhi Mang Xing", cursive'
  },
  {
    id: 'zcool-kuaile',
    name: '站酷快乐体',
    family: '"ZCOOL KuaiLe", sans-serif'
  },
  {
    id: 'zcool-xiaowei',
    name: '站酷小薇',
    family: '"ZCOOL XiaoWei", serif'
  }
];

export const FONT_WEIGHTS = [
  { id: 'light', name: '细体', value: '300' },
  { id: 'normal', name: '常规', value: '400' },
  { id: 'medium', name: '中等', value: '500' },
  { id: 'semibold', name: '半粗', value: '600' },
  { id: 'bold', name: '粗体', value: '700' }
];

export const FONT_SIZES = [
  { id: 'small', name: '小', value: '14px' },
  { id: 'normal', name: '标准', value: '16px' },
  { id: 'large', name: '大', value: '18px' },
  { id: 'xlarge', name: '超大', value: '20px' }
];

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
    pageBackgroundLight: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)',
    pageBackgroundDark: 'linear-gradient(180deg, #0a0d14 0%, #101520 100%)',
    overlayOpacityLight: '0.86',
    overlayOpacityDark: '0.98'
  },
  {
    id: 'balanced',
    name: '平衡',
    shortName: '衡',
    description: '阅读和视觉效果均衡，适合作为日常默认档位。',
    pageBackgroundLight: 'linear-gradient(180deg, #f3f6fa 0%, #ebf0f6 100%)',
    pageBackgroundDark: 'linear-gradient(180deg, #09101a 0%, #0f1621 100%)',
    overlayOpacityLight: '0.72',
    overlayOpacityDark: '0.72'
  },
  {
    id: 'dim',
    name: '暗调',
    shortName: '暗',
    description: '明显压低背景存在感，让章节正文更稳定、更易读。',
    pageBackgroundLight: 'linear-gradient(180deg, #eef2f7 0%, #e7ecf3 100%)',
    pageBackgroundDark: 'linear-gradient(180deg, #080b12 0%, #0c1018 100%)',
    overlayOpacityLight: '0.58',
    overlayOpacityDark: '0.44'
  },
  {
    id: 'deep',
    name: '深夜',
    shortName: '深',
    description: '最克制的背景档位，适合长时间沉浸式阅读。',
    pageBackgroundLight: 'linear-gradient(180deg, #e8edf4 0%, #e1e7ef 100%)',
    pageBackgroundDark: 'linear-gradient(180deg, #06080d 0%, #090c12 100%)',
    overlayOpacityLight: '0.42',
    overlayOpacityDark: '0.24'
  }
];
