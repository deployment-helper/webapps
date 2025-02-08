'use client';
import { useEffect, useRef, useState } from 'react';

import layouts, { ALLOWED_LAYOUTS } from '@/src/layouts';
import { ILayoutProps } from '@/components/layouts/types';

export default function RenderLayoutComponent({
  layoutId,
  sceneId,
  content,
  onError,
  parentEl,
  isDisplayNone = false,
}: IRenderLayoutComponentProps) {
  const [LayoutReactComponent, setLayoutReactComponent] = useState<
    React.FunctionComponent<any> | undefined
  >(undefined);
  const ref = useRef<HTMLDivElement | null>(null);

  // Dynamically import layout component for selected layout
  useEffect(() => {
    const layout = layouts.find((layout) => layout.id === layoutId);

    if (!layout || !ALLOWED_LAYOUTS.includes(layoutId)) return;

    const LayoutReactComponent =
      require(`@/components/layouts/${layout?.componentName}`).default;
    setLayoutReactComponent(LayoutReactComponent);
  }, [layoutId]);

  return (
    <div>
      {content && LayoutReactComponent && (
        <LayoutReactComponent
          isNone={isDisplayNone}
          isViewOnly={true}
          content={content}
          sceneId={sceneId}
          parentEl={parentEl}
          ref={ref}
          onError={onError}
        />
      )}
    </div>
  );
}

export interface IRenderLayoutComponentProps extends ILayoutProps {
  layoutId: string;
  isDisplayNone?: boolean;
  parentEl?: HTMLElement | null;
  onError?: (error: string) => void;
}
