import React, { useState, useEffect } from 'react';
import { HiSparkles, HiX, HiSearch } from 'react-icons/hi';
import Fuse from 'fuse.js';
import './AIAssistant.css';
import '../../styles/3d-effects.css';
import '../../styles/animations.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [docIndex, setDocIndex] = useState(null);

  useEffect(() => {
    // Load and index documentation metadata
    fetch('/docs/_meta.json')
      .then(res => res.json())
      .then(data => {
        const searchableContent = [];

        // Handle new categories structure
        const categories = data.categories || [];
        categories.forEach(category => {
          const sections = category.sections || [];
          sections.forEach(section => {
            const items = section.items || [];

            // Helper function to recursively add items and their children
            const addItem = (item, parentSection) => {
              searchableContent.push({
                title: item.title,
                path: item.path,
                section: parentSection,
                category: category.title,
                description: item.description || ''
              });

              // Add children recursively
              if (item.children && item.children.length > 0) {
                item.children.forEach(child => addItem(child, parentSection));
              }
            };

            items.forEach(item => addItem(item, section.title));
          });
        });

        const fuse = new Fuse(searchableContent, {
          keys: ['title', 'description', 'section', 'category'],
          threshold: 0.4,
          includeScore: true
        });

        setDocIndex(fuse);
      })
      .catch(err => console.error('Failed to load docs index:', err));
  }, []);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);

    if (!searchQuery.trim() || !docIndex) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      const searchResults = docIndex.search(searchQuery);
      setResults(searchResults.slice(0, 5).map(r => r.item));
      setIsSearching(false);
    }, 300);
  };

  const quickQuestions = [
    'How to install BeatAI?',
    'Getting started guide',
    'API documentation',
    'Configuration options'
  ];

  return (
    <>
      {/* Floating AI orb */}
      <button
        className="ai-orb breathe-animation glow-effect"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="AI Assistant"
        aria-expanded={isOpen}
      >
        <HiSparkles />
        <span className="ai-pulse"></span>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <>
          <div className="ai-backdrop" onClick={() => setIsOpen(false)} />
          <div className="ai-panel slide-in-left">
            <div className="ai-header">
              <div className="ai-header-title">
                <HiSparkles /> AI Assistant
              </div>
              <button
                className="ai-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
              >
                <HiX />
              </button>
            </div>

            <div className="ai-content">
              {/* Search input */}
              <div className="ai-search">
                <HiSearch className="ai-search-icon" />
                <input
                  type="text"
                  className="ai-search-input"
                  placeholder="Ask me anything about the docs..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Quick questions */}
              {!query && (
                <div className="ai-suggestions">
                  <div className="ai-suggestions-title">Quick Questions:</div>
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      className="ai-suggestion-chip"
                      onClick={() => handleSearch(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Search results */}
              {query && (
                <div className="ai-results">
                  {isSearching ? (
                    <div className="ai-searching">
                      <div className="ai-spinner rotate-animation"></div>
                      Searching...
                    </div>
                  ) : results.length > 0 ? (
                    <>
                      <div className="ai-results-title">
                        Found {results.length} result{results.length !== 1 ? 's' : ''}:
                      </div>
                      {results.map((result, idx) => (
                        <a
                          key={idx}
                          href={result.path}
                          className="ai-result-card float-up"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="ai-result-section">{result.section}</div>
                          <div className="ai-result-title">{result.title}</div>
                          {result.description && (
                            <div className="ai-result-description">{result.description}</div>
                          )}
                        </a>
                      ))}
                    </>
                  ) : (
                    <div className="ai-no-results">
                      <div className="ai-no-results-icon">🔍</div>
                      <div>No results found for "{query}"</div>
                      <div className="ai-no-results-hint">
                        Try different keywords or browse the documentation.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="ai-footer">
              <div className="ai-footer-text">
                💡 Powered by fuzzy search
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AIAssistant;
