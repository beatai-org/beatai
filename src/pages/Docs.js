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
    // Use process.env.PUBLIC_URL to handle both dev and production environments
    const metaPath = `${process.env.PUBLIC_URL}/docs/_meta.json`;
    fetch(metaPath)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setDocsMeta(data);
      })
      .catch(err => console.error('Failed to load docs meta:', err));
  }, []);

  if (!docsMeta) {
    return <div className="docs-loading">Loading documentation...</div>;
  }

  // Get default path - prioritize Rust Course
  const defaultPath = '/rust-course/first-try/intro';

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
