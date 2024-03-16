import LayoutBody from "@/components/layouts/LayoutBody";
import { forwardRef, MutableRefObject } from "react";
import { IInput } from "@/src/types/types";

export const TitleSubtitle = forwardRef<HTMLDivElement, ITitleSubtitleProps>(
  ({ content, isNone, sceneId }: ITitleSubtitleProps, ref) => {
    return (
      <LayoutBody isNone={isNone} ref={ref} sceneId={sceneId}>
        <div className="flex flex-col">
          <div className="text-9xl font-bold">{content?.title?.value}</div>
          <div className="pt-1 text-5xl ">{content?.subtitle?.value}</div>
        </div>
      </LayoutBody>
    );
  },
);

export interface ITitleSubtitleProps {
  sceneId: string;
  isNone?: boolean;
  content: Record<string, IInput>;
}

TitleSubtitle.displayName = "TitleSubtitle";
export default TitleSubtitle;
