import React, { useState, useEffect, useRef } from 'react';
import './TableOfContents.css';

const TableOfContents = ({ headings }) => {
  const [activeId, setActiveId] = useState('');
  const observer = useRef(null);
  const tocListRef = useRef(null);

  useEffect(() => {
    // Return early if no headings
    if (!headings || headings.length === 0) return;

    // Create IntersectionObserver to track which heading is currently visible
    observer.current = new IntersectionObserver(
      (entries) => {
        // Collect all currently visible headings
        const visibleHeadings = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleHeadings.push({
              id: entry.target.id,
              top: entry.boundingClientRect.top
            });
          }
        });

        // If we have visible headings, select the topmost one
        if (visibleHeadings.length > 0) {
          visibleHeadings.sort((a, b) => a.top - b.top);
          setActiveId(visibleHeadings[0].id);
        }
      },
      {
        rootMargin: '-100px 0px -66% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1.0]
      }
    );

    // Observe all heading elements
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.current.observe(element);
      }
    });

    // Add scroll listener to handle bottom edge case
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if we're at the bottom of the page (within 100px)
      const isAtBottom = scrollTop + windowHeight >= documentHeight - 100;

      if (isAtBottom && headings.length > 0) {
        // Highlight the last heading when at bottom
        setActiveId(headings[headings.length - 1].id);
      }
    };

    // Throttle scroll events using requestAnimationFrame
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });

    // Cleanup
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
      window.removeEventListener('scroll', scrollListener);
    };
  }, [headings]);

  // Auto-scroll active item into view
  useEffect(() => {
    if (activeId && tocListRef.current) {
      const activeElement = tocListRef.current.querySelector(`[href="#${activeId}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [activeId]);

  // Handle click on TOC link - smooth scroll to target
  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      // Update active ID immediately
      setActiveId(id);
    }
  };

  // Don't render if no headings
  if (!headings || headings.length === 0) {
    return null;
  }

  return (
    <nav className="toc" aria-label="Table of contents">
      <div className="toc-header">
        <h4 className="toc-title">On This Page</h4>
      </div>
      <ul className="toc-list" ref={tocListRef}>
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            className={`toc-item toc-level-${level} ${activeId === id ? 'active' : ''}`}
          >
            <a
              href={`#${id}`}
              className="toc-link"
              onClick={(e) => handleClick(e, id)}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
