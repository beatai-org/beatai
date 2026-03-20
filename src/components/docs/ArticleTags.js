import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleTags.css';

const ArticleTags = ({ tags }) => {
  // Don't render anything if there are no tags
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="article-tags">
      <div className="article-tags-list">
        {tags.map((tag, index) => (
          <Link
            key={index}
            to={`/tags/${encodeURIComponent(tag)}`}
            className="article-tag"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArticleTags;
