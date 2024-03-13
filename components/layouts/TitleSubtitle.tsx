import LayoutBody from "@/components/layouts/LayoutBody";
import { forwardRef, MutableRefObject } from "react";
import { IInput } from "@/src/types/types";

export const TitleSubtitle = forwardRef<HTMLDivElement, ITitleSubtitleProps>(
  (props: ITitleSubtitleProps, ref) => {
    return (
      <LayoutBody isNone={props.isNone} ref={ref} sceneId={props.sceneId}>
        <div className="flex flex-col">
          <div className="text-9xl font-bold">{props.content.title.value}</div>
          <div className="pt-1 text-5xl ">{props.content.subtitle.value}</div>
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

export default TitleSubtitle;
