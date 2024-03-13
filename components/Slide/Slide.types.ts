import { SlideType } from "@/src/constants";
import { ISlide } from "@/src/types/types";

export interface SlideProps extends ISlide {
  slideType: SlideType;
  slideMeta?: any;
}
