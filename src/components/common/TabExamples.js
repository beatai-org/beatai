import React, { useState } from 'react';
import { TabGroup, TabButton } from '../common';

/**
 * TabGroup 组件使用示例
 *
 * 这个文件展示了如何使用通用标签页组件
 */

// 示例 1: 基本用法
export function BasicExample() {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <div style={{ padding: '20px' }}>
      <h2>基本用法</h2>
      <TabGroup
        tabs={[
          { id: 'tab1', label: 'Tab 1' },
          { id: 'tab2', label: 'Tab 2' },
          { id: 'tab3', label: 'Tab 3' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      <div style={{ padding: '20px', marginTop: '20px', background: 'var(--card-bg)', borderRadius: '8px' }}>
        当前激活: <strong>{activeTab}</strong>
      </div>
    </div>
  );
}

// 示例 2: 带计数的标签
export function CountExample() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div style={{ padding: '20px' }}>
      <h2>带计数徽章</h2>
      <TabGroup
        tabs={[
          { id: 'all', label: 'All Items', count: 42 },
          { id: 'active', label: 'Active', count: 15 },
          { id: 'completed', label: 'Completed', count: 27 }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
}

// 示例 3: 禁用状态
export function DisabledExample() {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <div style={{ padding: '20px' }}>
      <h2>禁用状态</h2>
      <TabGroup
        tabs={[
          { id: 'tab1', label: 'Available' },
          { id: 'tab2', label: 'Coming Soon', disabled: true },
          { id: 'tab3', label: 'Beta Feature', disabled: true },
          { id: 'tab4', label: 'Active' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
}

// 示例 4: 独立的 TabButton
export function TabButtonExample() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ padding: '20px' }}>
      <h2>独立 TabButton（自定义布局）</h2>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
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
      <div style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '8px' }}>
        当前激活: <strong>{activeTab}</strong>
      </div>
    </div>
  );
}

// 示例 5: 动态标签（模拟过滤）
export function DynamicExample() {
  const [filter, setFilter] = useState('all');

  const mockItems = [
    { id: 1, name: 'Item 1', status: 'active' },
    { id: 2, name: 'Item 2', status: 'completed' },
    { id: 3, name: 'Item 3', status: 'active' },
    { id: 4, name: 'Item 4', status: 'completed' },
    { id: 5, name: 'Item 5', status: 'active' },
  ];

  const activeItems = mockItems.filter(i => i.status === 'active');
  const completedItems = mockItems.filter(i => i.status === 'completed');

  const tabs = [
    { id: 'all', label: 'All', count: mockItems.length },
    { id: 'active', label: 'Active', count: activeItems.length },
    { id: 'completed', label: 'Completed', count: completedItems.length }
  ];

  const filteredItems = filter === 'all'
    ? mockItems
    : mockItems.filter(item => item.status === filter);

  return (
    <div style={{ padding: '20px' }}>
      <h2>动态标签（过滤功能）</h2>
      <TabGroup
        tabs={tabs}
        activeTab={filter}
        onChange={setFilter}
      />
      <div style={{ marginTop: '20px' }}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            style={{
              padding: '10px',
              margin: '8px 0',
              background: 'var(--card-bg)',
              borderRadius: '6px'
            }}
          >
            {item.name} - <em>{item.status}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

// 示例页面：展示所有示例
export default function TabExamplesPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <h1>标签页组件示例</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        展示 TabGroup 和 TabButton 组件的各种用法
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <BasicExample />
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-primary)' }} />

        <CountExample />
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-primary)' }} />

        <DisabledExample />
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-primary)' }} />

        <TabButtonExample />
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-primary)' }} />

        <DynamicExample />
      </div>
    </div>
  );
}
