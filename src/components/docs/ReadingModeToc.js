import React, { useEffect, useRef, useState } from 'react';
import './ReadingModeToc.css';

const HEADING_SELECTOR = 'article h2, article h3, article h4';

function extractHeadings() {
  if (typeof document === 'undefined') return [];
  const elements = document.querySelectorAll(HEADING_SELECTOR);
  return Array.from(elements)
    .map((el, index) => ({
      id: el.id,
      uniqueKey: `${el.id || 'h'}-${index}`,
      text: el.textContent || '',
      level: parseInt(el.tagName.substring(1), 10),
    }))
    .filter((h) => h.id);
}

function ReadingModeToc({ isOpen = true }) {
  const [headings, setHeadings] = useState(() => extractHeadings());
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef(null);
  const userClickedRef = useRef(false);
  const listRef = useRef(null);

  // 文章 DOM 可能晚于本组件挂载（尤其在阅读模式刷新时，TOC 现在常驻挂载）。
  // 多扫几帧直到拿到 heading，让 observer 尽早接管。
  useEffect(() => {
    let frame = null;
    let attempts = 0;
    const scan = () => {
      const next = extractHeadings();
      if (next.length) {
        setHeadings((prev) => (prev.length === next.length ? prev : next));
        return;
      }
      if (attempts++ < 60) {
        frame = requestAnimationFrame(scan);
      }
    };
    scan();
    return () => {
      if (frame != null) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 打开 popover 时兜底再扫一次，覆盖「文章渲染超过 1s 后用户才打开」的极端情况
  useEffect(() => {
    if (!isOpen) return;
    const next = extractHeadings();
    if (next.length && next.length !== headings.length) {
      setHeadings(next);
    }
  }, [isOpen, headings.length]);

  // 刷新后 IntersectionObserver 尚未给出信号时，至少把第一项作为默认激活项，
  // 避免打开 TOC 时全无高亮。observer 拿到信号后会自然覆盖。
  useEffect(() => {
    if (!headings.length) return;
    setActiveId((current) => current || headings[0].id);
  }, [headings]);

  useEffect(() => {
    if (!headings.length) return undefined;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (userClickedRef.current) return;
        const visible = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.push({
              id: entry.target.id,
              top: entry.boundingClientRect.top,
            });
          }
        });
        if (visible.length > 0) {
          visible.sort((a, b) => a.top - b.top);
          setActiveId(visible[0].id);
        }
      },
      {
        rootMargin: '-100px 0px -66% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    const handleScroll = () => {
      if (userClickedRef.current) return;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const atBottom = scrollTop + windowHeight >= documentHeight - 100;
      if (atBottom && headings.length > 0) {
        setActiveId(headings[headings.length - 1].id);
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [headings]);

  // popover 关闭时 display:none，scrollIntoView 是 no-op；
  // 监听 isOpen 让打开瞬间也补一次定位。
  useEffect(() => {
    if (!isOpen) return;
    if (!activeId || !listRef.current) return;
    const el = listRef.current.querySelector(`[href="#${activeId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeId, isOpen]);

  const handleClick = (event, id) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    userClickedRef.current = true;
    setActiveId(id);
    window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    setTimeout(() => {
      userClickedRef.current = false;
    }, 1000);
  };

  if (!headings.length) {
    return <div className="rm-toc-empty">该文章暂无目录</div>;
  }

  return (
    <nav className="rm-toc" aria-label="文章目录">
      <ul className="rm-toc-list" ref={listRef}>
        {headings.map(({ id, uniqueKey, text, level }) => (
          <li
            key={uniqueKey}
            className={`rm-toc-item rm-toc-level-${level} ${
              activeId === id ? 'is-active' : ''
            }`}
          >
            <a
              href={`#${id}`}
              className="rm-toc-link"
              onClick={(e) => handleClick(e, id)}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ReadingModeToc;
