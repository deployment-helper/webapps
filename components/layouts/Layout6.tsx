import { forwardRef } from 'react';
import { ILayoutProps } from '@/components/layouts/types';
import LayoutBody from '@/components/layouts/LayoutBody';
import { Video } from '@/components/Video/Video';
import { Title1 } from '@fluentui/react-components';

export const Layout6 = forwardRef<HTMLImageElement, ILayoutProps>(
  ({ content, sceneId, isDisplayNone, isViewOnly }: ILayoutProps, ref) => {
    return (
      <LayoutBody isNone={isDisplayNone} ref={ref} sceneId={sceneId}>
        <Video
          src={content?.video?.value as string}
          isCopyable={true}
          isViewOnly={isViewOnly}
        />
        <div
          className={' absolute flex h-full w-full items-center justify-center'}
        >
          <Title1 className={'text-white'}>{content?.title?.value}</Title1>
        </div>
      </LayoutBody>
    );
  },
);

Layout6.displayName = 'Layout6';

export default Layout6;
