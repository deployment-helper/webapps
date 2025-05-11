import { forwardRef, useEffect, useRef, useState } from 'react';
import usePrintPdf from '@/hooks/usePrintPdf';

export const LayoutBody = forwardRef<HTMLDivElement, ILayoutBodyProps>(
  (props, ref) => {
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const BASE_WIDTH = 1280;
    const BASE_HEIGHT = 720;

    const isPrintPdf = usePrintPdf();

    useEffect(() => {
      const updateScale = () => {
        if (containerRef.current) {
          const container = containerRef.current.parentElement;
          if (container) {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const widthScale = containerWidth / BASE_WIDTH;
            const heightScale = containerHeight / BASE_HEIGHT;

            // Calculate scale while maintaining aspect ratio
            const newScale = Math.min(widthScale, heightScale, 1);
            setScale(newScale);
          }
        }
      };

      updateScale();
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }, []);

    const contentStyle = {
      width: `${BASE_WIDTH}px`,
      height: `${BASE_HEIGHT}px`,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    };

    const containerStyle = {
      width: `${BASE_WIDTH * scale}px`,
      height: `${BASE_HEIGHT * scale}px`,
      overflow: 'hidden',
    };

    const setRefs = (node: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      containerRef.current = node;
    };

    return props.isNone ? (
      <div style={{ width: '0px', height: '0px', overflow: 'hidden' }}>
        <div
          ref={setRefs}
          id={props.sceneId}
          style={contentStyle}
          className={`relative flex ${isPrintPdf ? '' : 'border-2'} bg-white`}
        >
          {props.children}
        </div>
      </div>
    ) : (
      <div style={containerStyle} ref={setRefs}>
        <div
          id={props.sceneId}
          style={contentStyle}
          className={`relative flex ${isPrintPdf ? '' : 'border-2'} bg-white`}
        >
          {props.children}
        </div>
      </div>
    );
  },
);

export interface ILayoutBodyProps {
  isNone?: boolean;
  children: React.ReactNode;
  sceneId: string;
}

LayoutBody.displayName = 'LayoutBody';

export default LayoutBody;
