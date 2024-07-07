import { forwardRef } from 'react';
import { ILayoutProps } from '@/components/layouts/types';
import LayoutBody from '@/components/layouts/LayoutBody';

export const Image = forwardRef<HTMLImageElement, ILayoutProps>(
  ({ content, sceneId, isDisplayNone }: ILayoutProps, ref) => {
    return (
      <LayoutBody isNone={isDisplayNone} ref={ref} sceneId={sceneId}>
        <img
          height={'100%'}
          src={content?.image?.value}
          alt={content?.image?.name}
          className={'max-h-full'}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: '100%',
            height: '100%',
            margin: 0,
          }}
        />
      </LayoutBody>
    );
  },
);

Image.displayName = 'Image';

export default Image;
