import { forwardRef } from "react";
import { ILayoutProps } from "@/components/layouts/types";
import LayoutBody from "@/components/layouts/LayoutBody";

export const Image = forwardRef<HTMLImageElement, ILayoutProps>(
  (props: ILayoutProps, ref) => {
    return (
      <LayoutBody isNone={props.isNone} ref={ref} sceneId={props.sceneId}>
        <div className="flex">
          <img
            crossOrigin={"anonymous"}
            src={props.content.image.value}
            alt={props.content.image.name}
            className={"max-h-full"}
          />
        </div>
      </LayoutBody>
    );
  },
);

export default Image;
