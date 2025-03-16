import { forwardRef, useRef } from 'react';
import { ILayoutProps } from '@/components/layouts/types';
import LayoutBody from '@/components/layouts/LayoutBody';
import Image from '@/components/Image/Image';
import useResizeFont from '@/hooks/useResizeFont';

export const Layout5 = forwardRef<HTMLImageElement, ILayoutProps>(
  (
    { content, sceneId, isDisplayNone, isViewOnly, onError }: ILayoutProps,
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fontSize = useResizeFont(containerRef.current);

    return (
      <LayoutBody isNone={isDisplayNone} ref={ref} sceneId={sceneId}>
        <Image
          src={content?.image?.value as string}
          isCopyable={true}
          isViewOnly={isViewOnly}
          onError={onError}
        />
        <div
          ref={containerRef}
          className={'absolute flex h-full w-full items-center justify-center'}
        >
          <div className={'text-center text-white'} style={{ fontSize }}>
            {content?.title?.value}
          </div>
        </div>
      </LayoutBody>
    );
  },
);

Layout5.displayName = 'Layout5';

export default Layout5;
