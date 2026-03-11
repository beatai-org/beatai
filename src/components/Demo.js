import React, { useState } from 'react';
import './Demo.css';
import { HiCode } from 'react-icons/hi';

const Demo = () => {
  const [activeTab, setActiveTab] = useState('quickstart');

  const demos = {
    quickstart: {
      title: 'Quick Start',
      code: `npm install loongbot

# Create a new bot
npx loongbot create my-bot
cd my-bot

# Start development server
npm run dev

# Your bot is now running! 🚀`
    },
    plugin: {
      title: 'Plugin Development',
      code: `import { Plugin } from 'loongbot';

export class MyPlugin extends Plugin {
  name = 'my-plugin';

  async onMessage(message) {
    if (message.content === 'hello') {
      return 'Hello from my plugin!';
    }
  }

  async onStart() {
    console.log('Plugin initialized');
  }
}`
    },
    ai: {
      title: 'AI Integration',
      code: `import { BeatAI, AIPlugin } from 'loongbot';

const bot = new BeatAI({
  plugins: [
    new AIPlugin({
      model: 'gpt-4',
      apiKey: process.env.OPENAI_API_KEY,
      systemPrompt: 'You are a helpful assistant'
    })
  ]
});

bot.start();`
    }
  };

  return (
    <section id="demo" className="demo">
      <div className="container">
        <div className="section-header">
          <span className="section-icon"><HiCode /></span>
          <h2 className="section-title">Get Started in Minutes</h2>
        </div>

        <div className="demo-container">
          <div className="demo-tabs">
            {Object.keys(demos).map((key) => (
              <button
                key={key}
                className={`demo-tab ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {demos[key].title}
              </button>
            ))}
          </div>

          <div className="demo-content">
            <div className="demo-editor">
              <div className="editor-header">
                <div className="editor-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="editor-title">{demos[activeTab].title}</span>
              </div>
              <pre className="code-block">
                <code>{demos[activeTab].code}</code>
              </pre>
            </div>

            <div className="demo-output">
              <div className="output-header">
                <span>✓ Terminal Output</span>
              </div>
              <div className="output-content">
                <div className="output-line success">
                  <span className="output-icon">✓</span>
                  <span>BeatAI initialized successfully</span>
                </div>
                <div className="output-line">
                  <span className="output-icon">→</span>
                  <span>Loading plugins...</span>
                </div>
                <div className="output-line success">
                  <span className="output-icon">✓</span>
                  <span>All plugins loaded</span>
                </div>
                <div className="output-line success">
                  <span className="output-icon">✓</span>
                  <span>Bot is ready and listening</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
