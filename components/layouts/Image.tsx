import { forwardRef } from "react";
import { ILayoutProps } from "@/components/layouts/types";
import LayoutBody from "@/components/layouts/LayoutBody";

export const Image = forwardRef<HTMLImageElement, ILayoutProps>(
  ({ content, sceneId, isNone }: ILayoutProps, ref) => {
    return (
      <LayoutBody isNone={isNone} ref={ref} sceneId={sceneId}>
        <div className="flex">
          <img
            crossOrigin={"anonymous"}
            src={content?.image?.value}
            alt={content?.image?.name}
            className={"max-h-full"}
          />
        </div>
      </LayoutBody>
    );
  },
);

Image.displayName = "Image";

export default Image;
