import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DocsLayout from '../components/docs/DocsLayout';
import DocContent from '../components/docs/DocContent';
import './Docs.css';

const Docs = () => {
  const [docsMeta, setDocsMeta] = useState(null);

  useEffect(() => {
    // Load docs metadata
    fetch('/docs/_meta.json')
      .then(res => res.json())
      .then(data => setDocsMeta(data))
      .catch(err => console.error('Failed to load docs meta:', err));
  }, []);

  if (!docsMeta) {
    return <div className="docs-loading">Loading documentation...</div>;
  }

  // Get default path from first category's first section's first item
  const defaultPath = docsMeta.categories?.[0]?.sections?.[0]?.items?.[0]?.path || '/getting-started/introduction';

  return (
    <>
      <Helmet>
        <title>Documentation | BeatAI</title>
        <meta name="description" content="Complete documentation for BeatAI - the open-source AI bot framework" />
      </Helmet>

      <DocsLayout meta={docsMeta}>
        <Routes>
          <Route index element={<Navigate to={defaultPath} replace />} />
          <Route path="*" element={<DocContent />} />
        </Routes>
      </DocsLayout>
    </>
  );
};

export default Docs;
