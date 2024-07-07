import { forwardRef } from 'react';
import { ILayoutProps } from '@/components/layouts/types';
import LayoutBody from '@/components/layouts/LayoutBody';
import Image from '@/components/Image/Image';
import { Title1 } from '@fluentui/react-components';

export const Layout5 = forwardRef<HTMLImageElement, ILayoutProps>(
  ({ content, sceneId, isDisplayNone, isViewOnly }: ILayoutProps, ref) => {
    return (
      <LayoutBody isNone={isDisplayNone} ref={ref} sceneId={sceneId}>
        <Image
          src={content?.image?.value as string}
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

Layout5.displayName = 'Layout5';

export default Layout5;
