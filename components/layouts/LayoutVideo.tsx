import { forwardRef } from 'react';
import { ILayoutProps } from '@/components/layouts/types';
import LayoutBody from '@/components/layouts/LayoutBody';
import { Video } from '@/components/Video/Video';

export const LayoutVideo = forwardRef<HTMLImageElement, ILayoutProps>(
  ({ content, sceneId, isDisplayNone }: ILayoutProps, ref) => {
    return (
      <LayoutBody isNone={isDisplayNone} ref={ref} sceneId={sceneId}>
        <Video src={content?.video?.value as string} isCopyable={true} />
      </LayoutBody>
    );
  },
);

LayoutVideo.displayName = 'LayoutVideo';

export default LayoutVideo;
