import Mark from 'mark.js';
import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export function HighlightSearchResults() {
  const location = useLocation();
  const {
    siteConfig: { baseUrl }
  } = useDocusaurusContext();

  const markRef = useRef(null);
  const timerRef = useRef(null);
  const lastWordRef = useRef('');

  const clearHighlights = useCallback(() => {
    if (markRef.current) {
      markRef.current.unmark({ ignoreJoiners: true });
      markRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    document.removeEventListener('click', clearHighlights, true);
    window.removeEventListener('scroll', clearHighlights);
    document.removeEventListener('keydown', clearHighlights, true);
  }, []);

  useEffect(() => {
    const word = location.state?.highlightState?.wordToHighlight;

    if (word && word.length > 0 && word !== lastWordRef.current) {
      lastWordRef.current = word;

      clearHighlights();

      const root = document.getElementsByTagName('article')[0] ?? document.getElementsByTagName('main')[0];
      if (!root) return;

      const mark = new Mark(root);
      mark.mark(word, { ignoreJoiners: true });
      markRef.current = mark;

      timerRef.current = setTimeout(() => {
        document.addEventListener('click', clearHighlights, { capture: true, once: true });
        window.addEventListener('scroll', clearHighlights, { once: true, passive: true });
        document.addEventListener('keydown', clearHighlights, { capture: true, once: true });
      }, 500);
    }
  });

  useEffect(() => {
    lastWordRef.current = '';
    return clearHighlights;
  }, [location.pathname, clearHighlights]);

  return null;
}
