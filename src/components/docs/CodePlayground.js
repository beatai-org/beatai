import React, { useState, useRef, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from '../../utils/prism';
import { HiPlay, HiRefresh, HiShare } from 'react-icons/hi';

const CodePlayground = ({ initialCode = '', language = 'javascript' }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // Capture console output
  const captureConsole = () => {
    const logs = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      logs.push({ type: 'log', message: args.map(arg => String(arg)).join(' ') });
      originalLog(...args);
    };

    console.error = (...args) => {
      logs.push({ type: 'error', message: args.map(arg => String(arg)).join(' ') });
      originalError(...args);
    };

    console.warn = (...args) => {
      logs.push({ type: 'warn', message: args.map(arg => String(arg)).join(' ') });
      originalWarn(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  };

  // Execute code in sandbox
  const runCode = () => {
    setIsRunning(true);
    setOutput([]);

    const cleanup = captureConsole();

    try {
      // Create a sandboxed function
      // eslint-disable-next-line no-new-func
      const userFunction = new Function('console', code);

      // Execute with controlled console
      const tempLogs = [];
      const sandboxConsole = {
        log: (...args) => tempLogs.push({ type: 'log', message: args.map(arg => JSON.stringify(arg)).join(' ') }),
        error: (...args) => tempLogs.push({ type: 'error', message: args.map(arg => JSON.stringify(arg)).join(' ') }),
        warn: (...args) => tempLogs.push({ type: 'warn', message: args.map(arg => JSON.stringify(arg)).join(' ') })
      };

      userFunction(sandboxConsole);
      setOutput(tempLogs);

      // Add flash animation to editor
      if (editorRef.current) {
        editorRef.current.classList.add('code-flash');
        setTimeout(() => {
          editorRef.current?.classList.remove('code-flash');
        }, 500);
      }
    } catch (error) {
      setOutput([{ type: 'error', message: `Error: ${error.message}` }]);
    } finally {
      cleanup();
      setTimeout(() => setIsRunning(false), 500);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput([]);
  };

  const shareCode = () => {
    // Simple copy to clipboard
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const highlightCode = (source) => {
    const grammar = Prism.languages[language] || Prism.languages.javascript;

    if (!grammar) {
      return source;
    }

    return Prism.highlight(source, grammar, language || 'javascript');
  };

  return (
    <div className="code-playground card-3d glass-morphism">
      <div className="playground-header">
        <div className="playground-title">
          <span className="playground-icon">▶</span>
          Interactive Code Playground
        </div>
        <div className="playground-controls">
          <button
            className="playground-btn playground-btn-primary"
            onClick={runCode}
            disabled={isRunning}
            title="Run code (Ctrl+Enter)"
          >
            <HiPlay /> Run
          </button>
          <button
            className="playground-btn"
            onClick={resetCode}
            title="Reset to initial code"
          >
            <HiRefresh /> Reset
          </button>
          <button
            className="playground-btn"
            onClick={shareCode}
            title="Copy code to clipboard"
          >
            <HiShare /> Share
          </button>
        </div>
      </div>

      <div className="playground-content">
        <div className="playground-editor" ref={editorRef}>
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={highlightCode}
            padding={16}
            style={{
              fontFamily: '"Fira Code", "Consolas", monospace',
              fontSize: 14,
              lineHeight: 1.6,
              minHeight: '200px'
            }}
            textareaClassName="playground-textarea"
            className="editor-wrapper"
            onKeyDown={(e) => {
              // Ctrl+Enter to run
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                runCode();
              }
            }}
          />
        </div>

        <div className="playground-console">
          <div className="console-header">
            <span>Console Output</span>
            {output.length > 0 && (
              <button
                className="console-clear"
                onClick={() => setOutput([])}
                title="Clear console"
              >
                Clear
              </button>
            )}
          </div>
          <div className="console-output">
            {output.length === 0 ? (
              <div className="console-empty">
                Click "Run" to execute code...
              </div>
            ) : (
              output.map((log, idx) => (
                <div
                  key={idx}
                  className={`console-line console-${log.type} slide-in-bottom`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <span className="console-marker">
                    {log.type === 'error' ? '✕' : log.type === 'warn' ? '⚠' : '▶'}
                  </span>
                  <span className="console-message">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
