import { SlideType } from "@/src/constants";
import { Slide } from "@/src/types";

export interface SlideProps extends Slide {
  slideType: SlideType;
}
