import React, { useRef, useEffect } from 'react';

/**
 * HorizontalScrollSection
 * Mobile-only: renders children in a horizontal snap-scroll row.
 * On md+ breakpoints, this component renders nothing — the calling page
 * renders its own desktop grid layout separately.
 *
 * Usage in pages:
 *   // Mobile swipe row
 *   <HorizontalScrollSection>
 *     {items.map(item => <YourCard key={item.id} item={item} />)}
 *   </HorizontalScrollSection>
 *
 *   // Desktop grid
 *   <div className="hidden md:grid md:grid-cols-3 gap-8">
 *     {items.map(item => <YourCard key={item.id} item={item} />)}
 *   </div>
 */
const HorizontalScrollSection = ({ children, className = '' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const isMobile = () => window.innerWidth < 768;

    let animationFrameId;
    let lastTime = performance.now();
    let lastInteractionTime = 0;
    let isAutoScrolling = false;
    let direction = 1; // 1 = right, -1 = left
    const speed = 0.28; // slow, smooth, premium speed (pixels per frame at 60fps)

    const scroll = (timestamp) => {
      const timeSinceInteraction = timestamp - lastInteractionTime;
      const autoScrollActive = isMobile() && (timeSinceInteraction >= 2500);

      // Dynamically toggle snap-mandatory to allow smooth scroll while auto-scrolling
      if (autoScrollActive) {
        container.style.scrollSnapType = 'none';
        container.style.scrollBehavior = 'auto';
      } else {
        container.style.scrollSnapType = 'x mandatory';
      }

      if (!autoScrollActive) {
        lastTime = timestamp;
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }

      const elapsed = timestamp - lastTime;
      lastTime = timestamp;

      if (elapsed > 0) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
          isAutoScrolling = true;
          container.scrollLeft += direction * speed * (elapsed / 16.666);

          // Change direction if we reach boundaries
          if (direction === 1 && container.scrollLeft >= maxScroll - 1) {
            direction = -1;
          } else if (direction === -1 && container.scrollLeft <= 1) {
            direction = 1;
          }
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    const handleInteraction = () => {
      lastInteractionTime = performance.now();
    };

    const handleScroll = () => {
      if (isAutoScrolling) {
        isAutoScrolling = false;
      } else {
        lastInteractionTime = performance.now();
      }
    };

    const handleMouseMove = (e) => {
      if (e.buttons > 0) {
        lastInteractionTime = performance.now();
      }
    };

    // Attach interaction listeners to reset the timer
    container.addEventListener('touchstart', handleInteraction, { passive: true });
    container.addEventListener('touchmove', handleInteraction, { passive: true });
    container.addEventListener('touchend', handleInteraction, { passive: true });
    container.addEventListener('mousedown', handleInteraction, { passive: true });
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseup', handleInteraction, { passive: true });
    container.addEventListener('scroll', handleScroll, { passive: true });

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('touchstart', handleInteraction);
      container.removeEventListener('touchmove', handleInteraction);
      container.removeEventListener('touchend', handleInteraction);
      container.removeEventListener('mousedown', handleInteraction);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleInteraction);
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-1 pb-4 -mx-1 ${className}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {React.Children.map(children, (child) =>
        child ? (
          <div className="snap-start flex-shrink-0 w-[84vw] sm:w-[72vw]">
            {child}
          </div>
        ) : null
      )}
    </div>
  );
};

export default HorizontalScrollSection;
