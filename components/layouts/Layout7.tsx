import { forwardRef } from 'react';
import { ILayoutProps } from '@/components/layouts/types';
import LayoutBody from '@/components/layouts/LayoutBody';
import Image from '@/components/Image/Image';
import { usePrintPdf } from '@/hooks/usePrintPdf';
/**
 * @deprecated
 * This layout is deprecated and will be removed in the future.
 */
export const Layout5 = forwardRef<HTMLImageElement, ILayoutProps>(
  ({ content, sceneId, isDisplayNone, isViewOnly }: ILayoutProps, ref) => {
    const isPrintPdf = usePrintPdf();
    console.log('isPrintPdf', isPrintPdf);
    return (
      <LayoutBody isNone={isDisplayNone} ref={ref} sceneId={sceneId}>
        {isPrintPdf ? (
          <div style={{ width: '1280px', height: '720px' }}>
            <img
              style={{ maxWidth: '800px', margin: 'auto' }}
              src={content?.image?.value as string}
            />
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%' }}>
            <Image
              src={content?.image?.value as string}
              isViewOnly={isViewOnly}
            />
          </div>
        )}
      </LayoutBody>
    );
  },
);

Layout5.displayName = 'Layout5';

export default Layout5;
