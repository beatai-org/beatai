import React, { useState, useEffect, useMemo } from 'react';
import { HiSparkles, HiX, HiSearch } from 'react-icons/hi';
import Fuse from 'fuse.js';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { buildSearchableDocsModel } from '../../domain/docs';
import { loadDocsMeta } from '../../utils/docsMeta';
import { SITE_CONFIG } from '../../utils/siteConfig';
import './AIAssistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [docIndex, setDocIndex] = useState(null);
  const [searchMode, setSearchMode] = useState('waiting'); // 'waiting' | 'algolia' | 'fallback'

  // Algolia configuration
  // TODO: Replace these with your actual Algolia credentials after approval
  const ALGOLIA_CONFIG = {
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_SEARCH_API_KEY',
    indexName: 'YOUR_INDEX_NAME',
    enabled: false // Set to true after getting Algolia credentials
  };

  // Initialize Algolia search client (only if enabled)
  const searchClient = useMemo(() => {
    if (ALGOLIA_CONFIG.enabled) {
      return algoliasearch(ALGOLIA_CONFIG.appId, ALGOLIA_CONFIG.apiKey);
    }
    return null;
  }, [ALGOLIA_CONFIG.enabled]);

  useEffect(() => {
    // Load and index documentation metadata
    loadDocsMeta()
      .then((data) => {
        const fuse = new Fuse(buildSearchableDocsModel(data), {
          keys: ['title', 'description', 'section', 'category'],
          threshold: 0.4,
          includeScore: true
        });

        setDocIndex(fuse);
      })
      .catch((err) => console.error('Failed to load docs index:', err));
  }, []);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Try Algolia search first (if enabled)
      if (ALGOLIA_CONFIG.enabled && searchClient) {
        const index = searchClient.initIndex(ALGOLIA_CONFIG.indexName);
        const { hits } = await index.search(searchQuery, {
          hitsPerPage: 5,
          attributesToSnippet: ['content:50'],
          attributesToHighlight: ['title', 'content', 'hierarchy.lvl1', 'hierarchy.lvl2'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>'
        });

        // Transform Algolia results to match our UI format
        const transformedResults = hits.map(hit => ({
          title: hit._highlightResult?.title?.value || hit.title || '',
          path: hit.url || '',
          section: hit.hierarchy?.lvl1 || hit.hierarchy?.lvl0 || '',
          category: hit.hierarchy?.lvl0 || '',
          snippet: hit._snippetResult?.content?.value || '',
          description: hit.content || ''
        }));

        setResults(transformedResults);
        setSearchMode('algolia');
        setIsSearching(false);
        return;
      }
    } catch (err) {
      console.warn('Algolia search failed, falling back to metadata search:', err);
    }

    // Fallback to Fuse.js metadata search
    setTimeout(() => {
      if (docIndex) {
        const searchResults = docIndex.search(searchQuery);
        setResults(searchResults.slice(0, 5).map(r => r.item));
        setSearchMode('fallback');
      } else {
        setResults([]);
      }
      setIsSearching(false);
    }, 300);
  };

  const quickQuestions = [
    `How to install ${SITE_CONFIG.brandName}?`,
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
                <HiSparkles /> AI 小助手
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
                        Found {results.length} result{results.length !== 1 ? 's' : ''}
                        {searchMode === 'algolia' && ' (Full-text)'}
                        {searchMode === 'fallback' && ' (Metadata only)'}
                      </div>
                      {results.map((result, idx) => (
                        <a
                          key={idx}
                          href={result.path}
                          className="ai-result-card float-up"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="ai-result-section">
                            {result.category && result.category !== result.section
                              ? `${result.category} › ${result.section}`
                              : result.section}
                          </div>
                          <div
                            className="ai-result-title"
                            dangerouslySetInnerHTML={{ __html: result.title }}
                          />
                          {/* Show snippet if available (Algolia), otherwise description (metadata) */}
                          {result.snippet ? (
                            <div
                              className="ai-result-snippet"
                              dangerouslySetInnerHTML={{ __html: result.snippet }}
                            />
                          ) : result.description ? (
                            <div className="ai-result-description">{result.description}</div>
                          ) : null}
                        </a>
                      ))}
                    </>
                  ) : (
                    <div className="ai-no-results">
                      <div className="ai-no-results-icon">🔍</div>
                      <div>No results found for "{query}"</div>
                      <div className="ai-no-results-hint">
                        {searchMode === 'fallback'
                          ? 'Currently searching titles and descriptions only. Full-text search coming soon!'
                          : 'Try different keywords or browse the documentation.'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* <div className="ai-footer">
              <div className="ai-footer-text">
                💡 Powered by fuzzy search
              </div>
            </div> */}
          </div>
        </>
      )}
    </>
  );
};

export default AIAssistant;
