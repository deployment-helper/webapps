'use client';
import { useEffect, useRef, useState } from 'react';
import layouts, { ALLOWED_LAYOUTS } from '@/src/layouts';
import { ILayoutProps } from '@/components/layouts/types';

export default function RenderLayoutComponent({
  layoutId,
  sceneId,
  content,
  onError,
  onClearError,
  parentEl,
  isDisplayNone = false,
}: IRenderLayoutComponentProps) {
  const [error, setError] = useState<Error | null>(null);
  const [LayoutReactComponent, setLayoutReactComponent] =
    useState<React.ComponentType<ILayoutProps> | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  // Dynamically import layout component for selected layout
  useEffect(() => {
    const layout = layouts.find((layout) => layout.id === layoutId);

    if (!layout || !ALLOWED_LAYOUTS.includes(layoutId)) {
      setError(new Error(`Invalid layout ID: ${layoutId}`));
      onError?.(`Invalid layout ID: ${layoutId}`);
      return;
    }

    // Clear any previous errors
    setError(null);
    onClearError?.();

    // Use dynamic import for better code splitting
    const loadComponent = async () => {
      try {
        const component = await import(
          `@/components/layouts/${layout.componentName}`
        );
        setLayoutReactComponent(() => component.default);
      } catch (err) {
        console.error('Failed to load layout component:', err);
        setError(err as Error);
        onError?.(`Failed to load layout: ${layout.componentName}`);
      }
    };

    loadComponent();
  }, [layoutId]);

  if (error) {
    return <div className="error-state">Failed to load layout component</div>;
  }

  return (
    <>
      {content && LayoutReactComponent && (
        <LayoutReactComponent
          isNone={isDisplayNone}
          isViewOnly={true}
          content={content}
          sceneId={sceneId}
          parentEl={parentEl}
          ref={ref}
          onError={onError}
          onClearError={onClearError}
        />
      )}
    </>
  );
}

export interface IRenderLayoutComponentProps extends ILayoutProps {
  layoutId: string;
  isDisplayNone?: boolean;
  parentEl?: HTMLElement | null;
}
