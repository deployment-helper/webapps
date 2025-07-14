import { forwardRef } from 'react';
import { ILayoutProps } from '@/components/layouts/types';
import LayoutBody from '@/components/layouts/LayoutBody';
import { Video } from '@/components/Video/Video';
import useResizeFont from '@/hooks/useResizeFont';

/**
 * Video and title layout
 */
export const Layout6 = forwardRef<HTMLImageElement, ILayoutProps>(
  (
    {
      content,
      sceneId,
      isDisplayNone,
      isViewOnly,
      parentEl,
      onError,
      onClearError,
    }: ILayoutProps,
    ref,
  ) => {
    const fontSize = useResizeFont(parentEl, {
      small: '5rem',
      medium: '10rem',
      large: '15rem',
    });

    return (
      <LayoutBody isNone={isDisplayNone} ref={ref} sceneId={sceneId}>
        <Video
          src={content?.video?.value as string}
          isCopyable={true}
          isViewOnly={isViewOnly}
          onError={onError}
          onLoad={onClearError}
        />
        <div
          className={' absolute flex h-full w-full items-center justify-center'}
        >
          <div
            style={{ fontSize: fontSize }}
            className={'align-center p-2 text-white'}
          >
            {content?.title?.value}
          </div>
        </div>
      </LayoutBody>
    );
  },
);

Layout6.displayName = 'Layout6';

export default Layout6;
