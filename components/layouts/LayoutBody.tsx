import { forwardRef } from 'react';

export const LayoutBody = forwardRef<HTMLDivElement, ILayoutBodyProps>(
  (props, ref) => {
    // this component should have height and width as per 16:9 aspect ratio
    /**
     * High Definition (HD):
     * 1024 x 576 (WSVGA)
     * 1280 x 720 (HD/WXGA)
     * 1366 x 768 (WXGA)
     * 1600 x 900 (HD+)
     * 1920 x 1080 (Full HD)
     */

    return (
      <div
        style={
          props.isNone ? { width: '0px', height: '0px', overflow: 'auto' } : {}
        }
      >
        <div
          ref={ref}
          id={props.sceneId}
          style={{ width: '100%' }}
          className={'relative flex justify-center border-2 bg-white'}
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
