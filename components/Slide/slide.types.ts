import { SlideType } from "@/src/constants";
import { ISlide } from "@/src/types";

export interface SlideProps extends ISlide {
  slideType: SlideType;
}
