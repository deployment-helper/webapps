import { FC } from "react";
import { SlideProps } from "./slide.types";
import { SlideType } from "@/src/constants";

export const Slide: FC<SlideProps> = ({
  questionEn,
  questionHi,
  slideType,
}: SlideProps) => {
  const getSlide = () => {
    if (slideType === SlideType.QUESTION) {
      return <section>Question</section>;
    } else if (slideType === SlideType.OPTION_LIST) {
      return <section> Option List</section>;
    } else if (slideType === SlideType.EXPLANATION) {
      return <section>Explanation</section>;
    }
  };
  return <>{getSlide()}</>;
};

export default Slide;
