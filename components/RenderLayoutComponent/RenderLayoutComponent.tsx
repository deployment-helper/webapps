"use client";
import { useEffect, useRef, useState } from "react";

import layouts, { ALLOWED_LAYOUTS } from "@/src/layouts";
import { ILayoutProps } from "@/components/layouts/types";
export default function RenderLayoutComponent({
  layoutId,
  sceneId,
  content,
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
          isNone={true}
          content={content}
          sceneId={sceneId}
          ref={ref}
        />
      )}
    </div>
  );
}

export interface IRenderLayoutComponentProps extends ILayoutProps {
  layoutId: string;
}
