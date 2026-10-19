import React, { useEffect, useRef, useState } from 'react';

/**
 * HorizontalScrollSection
 * Mobile-only: renders children in a swipeable snap row with a thin progress
 * rail underneath. It never moves on its own. On md+ this renders nothing;
 * the calling page renders its own desktop grid.
 */
const HorizontalScrollSection = ({ children, className = '', itemClassName = 'w-[84vw] sm:w-[72vw]' }) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState({ start: 0, size: 1 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const update = () => {
      const max = el.scrollWidth;
      if (!max) return;
      setProgress({ start: el.scrollLeft / max, size: el.clientWidth / max });
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className={`md:hidden ${className}`}>
      <div
        ref={containerRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {React.Children.map(children, (child) =>
          child ? <div className={`flex-shrink-0 snap-start ${itemClassName}`}>{child}</div> : null
        )}
      </div>
      {progress.size < 1 && (
        <div className="relative mx-auto mt-5 h-0.5 w-24 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <div
            className="absolute inset-y-0 rounded-full bg-white/70 transition-[left] duration-150"
            style={{ left: `${progress.start * 100}%`, width: `${progress.size * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollSection;
