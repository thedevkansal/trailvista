import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';

export const EASE_OUT = [0.16, 1, 0.3, 1];

/**
 * Section heading with a masked rise: each line slides up from behind its own
 * baseline once, the first time it scrolls into view. Pass lines as an array
 * so the break points are deliberate.
 */
export const RevealHeading = ({ lines, as: Tag = 'h2', className = '', delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const reduce = useReducedMotion();

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={reduce ? false : { y: '105%' }}
            animate={inView ? { y: '0%' } : undefined}
            transition={{ duration: 0.9, delay: delay + i * 0.08, ease: EASE_OUT }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

/** Fades content in once when it enters the viewport. */
export const FadeIn = ({ children, as = 'div', delay = 0, y = 16, className = '', ...rest }) => {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
};

/** Counts from 0 to `to` the first time it is seen. */
export const CountUp = ({ to, decimals = 0, prefix = '', suffix = '', duration = 1.6 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return undefined;
    const controls = animate(0, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  const formatted = value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className="tv-num">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
