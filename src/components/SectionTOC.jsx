import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Slugify a section label into a stable DOM id, matching SectionHeader.
export function sectionId(label) {
  return (
    'sec-' +
    String(label)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}

// Lightweight, scroll-aware table of contents.
// `sections` is an ordered array of { id, label }.
// Floats in the left gutter on wide screens; hidden when there's no room.
export default function SectionTOC({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);
  const [topOffset, setTopOffset] = useState(16);
  const activeRef = useRef(activeId);
  activeRef.current = activeId;

  // Align the menu's top with the white content panel's top, so it starts
  // where the list does rather than at the very top of the page.
  // useLayoutEffect runs before paint so switching tabs doesn't flash the
  // menu at the fallback position and then jump it down.
  useLayoutEffect(() => {
    const measure = () => {
      const panel = document.querySelector('.main-content .panel');
      if (panel) {
        const top = panel.getBoundingClientRect().top + window.scrollY;
        setTopOffset(Math.max(16, Math.round(top)));
      }
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (!sections.length) return;

    const ids = sections.map((s) => s.id);

    // Find the nearest scrollable ancestor of the section anchors. The
    // collection list scrolls inside a `.panel` box (overflow-y: auto),
    // not the window — so we must measure against that container.
    const findScrollParent = (el) => {
      let node = el?.parentElement;
      while (node && node !== document.body) {
        const oy = getComputedStyle(node).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight) {
          return node;
        }
        node = node.parentElement;
      }
      return window;
    };

    const firstEl = document.getElementById(ids[0]);
    const scroller = findScrollParent(firstEl);
    const isWindow = scroller === window;

    // A section is "active" while the trigger line falls within its span
    // (header through its last item). The trigger line sits ~25% down the
    // scroll viewport. We pick the last header whose top is above it.
    const update = () => {
      ticking = false;
      const viewTop = isWindow ? 0 : scroller.getBoundingClientRect().top;
      const viewH = isWindow ? window.innerHeight : scroller.clientHeight;
      const line = viewTop + viewH * 0.25;

      let currentId = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top; // viewport-relative
        if (top - 8 <= line) currentId = id;
        else break;
      }
      if (currentId && currentId !== activeRef.current) setActiveId(currentId);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update(); // set initial state

    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  if (sections.length < 2) return null;

  return (
    <nav
      className="section-toc"
      style={{ top: topOffset, maxHeight: `calc(100vh - ${topOffset + 16}px)` }}
      aria-label="Sections on this page"
    >
      <ul>
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`section-toc-link${activeId === s.id ? ' active' : ''}`}
              onClick={(e) => handleClick(e, s.id)}
            >
              <span className="section-toc-label">{s.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
