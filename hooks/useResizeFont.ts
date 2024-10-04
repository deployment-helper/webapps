import { useCallback, useEffect, useState } from 'react';

const useResizeFont = (
  el?: HTMLElement | null,
  breakpoints?: { [key: string]: string },
) => {
  const defaultBreakpoints = {
    default: '1rem',
    small: '1rem',
    medium: '2rem',
    large: '3rem',
  };
  const defaultFontSize = '2rem';
  breakpoints = breakpoints || defaultBreakpoints;
  const [fontSize, setFontSize] = useState<string>(defaultFontSize);

  const handleResize = useCallback(() => {
    if (el) {
      const width = el.offsetWidth;
      if (width < 300) {
        setFontSize(breakpoints?.small || defaultFontSize);
      } else if (width < 500) {
        setFontSize(breakpoints?.medium || defaultFontSize);
      } else {
        setFontSize(breakpoints?.large || defaultFontSize);
      }
    }
  }, [el, breakpoints]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (el) {
      resizeObserver.observe(el);
    }
    return () => {
      if (el) {
        resizeObserver.unobserve(el);
      }
    };
  }, [el, handleResize]);

  return fontSize;
};

export default useResizeFont;
