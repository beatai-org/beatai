# 📑 通用标签页组件 (TabGroup & TabButton)

## 📦 组件位置
- `src/components/common/TabGroup.js` - 标签组
- `src/components/common/TabButton.js` - 单个标签按钮
- `src/components/common/TabGroup.css` - 样式文件
- `src/components/common/TabButton.css` - 样式文件

## 🎯 设计目标

将 MyNotes 页面中的标签页样式抽象为可复用的通用组件，方便在其他页面使用统一风格的标签页。

## 📋 功能特性

- ✅ 支持活动标签高亮
- ✅ 支持计数徽章显示
- ✅ 支持禁用状态
- ✅ 响应式设计（移动端滚动）
- ✅ Dark/Light 主题适配
- ✅ 平滑过渡动画
- ✅ 可访问性支持

## 🚀 使用方法

### 1. TabGroup 组件（推荐）

适用于需要一组标签的场景。

#### 基本用法

```jsx
import { TabGroup } from '../components/common';

function MyComponent() {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <TabGroup
      tabs={[
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
        { id: 'tab3', label: 'Tab 3' }
      ]}
      activeTab={activeTab}
      onChange={setActiveTab}
    />
  );
}
```

#### 带计数的标签

```jsx
<TabGroup
  tabs={[
    { id: 'all', label: 'All Items', count: 42 },
    { id: 'active', label: 'Active', count: 15 },
    { id: 'completed', label: 'Completed', count: 27 }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

#### 禁用某些标签

```jsx
<TabGroup
  tabs={[
    { id: 'tab1', label: 'Available' },
    { id: 'tab2', label: 'Coming Soon', disabled: true },
    { id: 'tab3', label: 'Active' }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

#### 动态标签（如 MyNotes）

```jsx
const tabs = [
  { id: 'all', label: 'All Books', count: totalCount },
  ...bookGroups.map(book => ({
    id: book.bookName,
    label: getBookTitle(book.bookName),
    count: book.totalCount
  }))
];

<TabGroup
  tabs={tabs}
  activeTab={activeBook}
  onChange={setActiveBook}
/>
```

### 2. TabButton 组件（独立使用）

适用于需要单独控制每个标签的场景。

```jsx
import { TabButton } from '../components/common';

function MyComponent() {
  const [active, setActive] = useState('tab1');

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <TabButton
        label="Tab 1"
        count={10}
        active={active === 'tab1'}
        onClick={() => setActive('tab1')}
      />
      <TabButton
        label="Tab 2"
        count={5}
        active={active === 'tab2'}
        onClick={() => setActive('tab2')}
      />
      <TabButton
        label="Tab 3"
        disabled
      />
    </div>
  );
}
```

## 📚 API 文档

### TabGroup Props

| 属性 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tabs` | `Array<Tab>` | ✅ | - | 标签数组 |
| `activeTab` | `string` | ✅ | - | 当前激活的标签 ID |
| `onChange` | `(tabId: string) => void` | ✅ | - | 标签切换回调 |
| `className` | `string` | ❌ | `''` | 额外的 CSS 类名 |

#### Tab 对象

```typescript
interface Tab {
  id: string;           // 唯一标识
  label: string;        // 显示文本
  count?: number;       // 计数徽章（可选）
  disabled?: boolean;   // 是否禁用（可选）
}
```

### TabButton Props

| 属性 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `label` | `string` | ✅ | - | 标签文字 |
| `count` | `number \| string` | ❌ | - | 计数徽章 |
| `active` | `boolean` | ❌ | `false` | 是否激活 |
| `disabled` | `boolean` | ❌ | `false` | 是否禁用 |
| `onClick` | `() => void` | ❌ | - | 点击回调 |
| `className` | `string` | ❌ | `''` | 额外的 CSS 类名 |

## 🎨 样式定制

### 通过 CSS 变量

组件使用全局 CSS 变量，自动适配主题：

```css
/* 在你的 CSS 文件中覆盖 */
.my-custom-tabs {
  --tab-gap: 12px;              /* 标签间距 */
  --tab-padding: 8px 20px;      /* 标签内边距 */
  --tab-border-radius: 10px;    /* 圆角大小 */
}
```

### 通过 className

```jsx
<TabGroup
  tabs={tabs}
  activeTab={activeTab}
  onChange={setActiveTab}
  className="my-custom-tabs"
/>
```

```css
/* MyComponent.css */
.my-custom-tabs {
  margin-bottom: 40px;
  border-bottom: 3px solid var(--accent-primary);
}

.my-custom-tabs .tab-button {
  font-size: 16px;
  padding: 8px 20px;
}
```

## 📱 响应式行为

组件自动支持移动端：

- **桌面端**：标签横向排列
- **移动端**：
  - 标签可横向滚动
  - 显示细滚动条
  - 触摸滚动优化
  - 字体和间距自适应

## 🌓 主题支持

组件完全支持 Dark/Light 主题：

```jsx
// 自动根据 data-theme-mode 属性切换样式
<div data-theme-mode="dark">
  <TabGroup tabs={tabs} activeTab={active} onChange={setActive} />
</div>
```

### Dark 模式
- 背景：半透明白色
- 文字：浅色
- 激活：更亮的半透明白色

### Light 模式
- 背景：半透明黑色
- 文字：深色
- 激活：更深的半透明黑色

## 🔄 迁移指南

### 从旧代码迁移到 TabGroup

#### 之前

```jsx
<div className="my-notes-tabs">
  <button
    className={`my-notes-tab ${activeBook === 'all' ? 'active' : ''}`}
    onClick={() => setActiveBook('all')}
  >
    All Books
    <span className="my-notes-tab-count">{totalCount}</span>
  </button>
  {bookGroups.map((book) => (
    <button
      key={book.bookName}
      className={`my-notes-tab ${activeBook === book.bookName ? 'active' : ''}`}
      onClick={() => setActiveBook(book.bookName)}
    >
      {getBookTitle(book.bookName)}
      <span className="my-notes-tab-count">{book.totalCount}</span>
    </button>
  ))}
</div>
```

#### 之后

```jsx
import { TabGroup } from '../common';

<TabGroup
  tabs={[
    { id: 'all', label: 'All Books', count: totalCount },
    ...bookGroups.map(book => ({
      id: book.bookName,
      label: getBookTitle(book.bookName),
      count: book.totalCount
    }))
  ]}
  activeTab={activeBook}
  onChange={setActiveBook}
/>
```

### 删除旧的 CSS

迁移后可以删除组件特定的标签页样式（如 `.my-notes-tabs`, `.my-notes-tab` 等）。

## 🎯 使用场景

### 适用场景

- ✅ 内容分类切换（如：全部/已完成/进行中）
- ✅ 数据过滤（如：按书籍/按标签/按时间）
- ✅ 视图切换（如：列表视图/网格视图）
- ✅ 设置面板（如：基本/高级/关于）

### 不适用场景

- ❌ 复杂的多级导航（使用 Menu 组件）
- ❌ 分步表单（使用 Stepper 组件）
- ❌ 页面顶部主导航（使用 Header/Nav 组件）

## 📦 完整示例

### 示例 1: 简单的内容切换

```jsx
import React, { useState } from 'react';
import { TabGroup } from '../components/common';

function ContentTabs() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div>
      <TabGroup
        tabs={[
          { id: 'posts', label: 'Posts', count: 128 },
          { id: 'comments', label: 'Comments', count: 45 },
          { id: 'likes', label: 'Likes', count: 892 }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'posts' && <PostsContent />}
      {activeTab === 'comments' && <CommentsContent />}
      {activeTab === 'likes' && <LikesContent />}
    </div>
  );
}
```

### 示例 2: 动态标签（过滤功能）

```jsx
import React, { useState, useMemo } from 'react';
import { TabGroup } from '../components/common';

function FilteredList({ items }) {
  const [filter, setFilter] = useState('all');

  const tabs = useMemo(() => {
    const active = items.filter(i => i.status === 'active');
    const completed = items.filter(i => i.status === 'completed');

    return [
      { id: 'all', label: 'All', count: items.length },
      { id: 'active', label: 'Active', count: active.length },
      { id: 'completed', label: 'Completed', count: completed.length }
    ];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(item => item.status === filter);
  }, [items, filter]);

  return (
    <div>
      <TabGroup
        tabs={tabs}
        activeTab={filter}
        onChange={setFilter}
      />
      <ItemList items={filteredItems} />
    </div>
  );
}
```

### 示例 3: 使用 TabButton 构建自定义布局

```jsx
import React, { useState } from 'react';
import { TabButton } from '../components/common';

function CustomTabs() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px'
    }}>
      <TabButton
        label="Overview"
        active={activeTab === 'overview'}
        onClick={() => setActiveTab('overview')}
      />
      <TabButton
        label="Activity"
        count={12}
        active={activeTab === 'activity'}
        onClick={() => setActiveTab('activity')}
      />
      <TabButton
        label="Settings"
        active={activeTab === 'settings'}
        onClick={() => setActiveTab('settings')}
      />
      <TabButton
        label="Premium"
        disabled
      />
    </div>
  );
}
```

## ✅ 已完成的重构

- ✅ MyNotes 组件已使用 TabGroup
- ✅ 旧的 `.my-notes-tabs` 样式已移除
- ✅ 功能保持完全一致
- ✅ 代码更简洁易维护

## 🔮 未来扩展

可以考虑添加：

- [ ] 标签页图标支持
- [ ] 垂直标签页模式
- [ ] 拖拽排序
- [ ] 懒加载内容
- [ ] 动画效果配置
- [ ] 更多主题预设

---

**创建时间**: 2026-03-17
**组件版本**: 1.0.0
**适用范围**: 所有需要标签页的页面
