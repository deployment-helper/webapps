import { forwardRef, useRef } from 'react';
import { ILayoutProps } from '@/components/layouts/types';
import LayoutBody from '@/components/layouts/LayoutBody';
import useResizeFont from '@/hooks/useResizeFont';

interface ITitleProps extends ILayoutProps {
  backgroundColor?: string;
}

export const Title = forwardRef<HTMLDivElement, ITitleProps>(
  (
    { content, sceneId, isDisplayNone, backgroundColor = 'rgb(124 58 237 / var(--tw-bg-opacity))' }: ITitleProps,
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fontSize = useResizeFont(containerRef.current);

    return (
      <LayoutBody isNone={isDisplayNone} ref={ref} sceneId={sceneId}>
        <div
          className="flex h-full w-full items-center justify-center "
          style={{ backgroundColor }}
          ref={containerRef}
        >
          <div className="text-center" style={{ fontSize, color: 'white' }}>
            {content?.title?.value}
          </div>
        </div>
      </LayoutBody>
    );
  },
);

Title.displayName = 'Title';

export default Title;
