import { forwardRef } from 'react';
import { ILayoutProps } from '@/components/layouts/types';
import LayoutBody from '@/components/layouts/LayoutBody';
import Image from '@/components/Image/Image';

export const LayoutImage = forwardRef<HTMLImageElement, ILayoutProps>(
  (
    {
      content,
      sceneId,
      isDisplayNone,
      isViewOnly,
      onError,
      onClearError,
    }: ILayoutProps,
    ref,
  ) => {
    return (
      <LayoutBody isNone={isDisplayNone} ref={ref} sceneId={sceneId}>
        <Image
          src={content?.image?.value as string}
          isViewOnly={isViewOnly}
          isCopyable={true}
          isAIImage={true}
          onError={onError}
          onLoad={onClearError}
        />
      </LayoutBody>
    );
  },
);

LayoutImage.displayName = 'LayoutImage';

export default LayoutImage;
