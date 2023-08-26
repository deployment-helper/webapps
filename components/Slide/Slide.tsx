import { CheckmarkCircle32Filled } from "@fluentui/react-icons";

import { FC } from "react";
import { SlideProps } from "./Slide.types";
import { SlideType } from "@/src/constants";

export const Slide: FC<SlideProps> = ({
  questionEn,
  questionHi,
  options,
  rightAnswer,
  slideType,
  explanationEn,
}: SlideProps) => {
  const getSlide = () => {
    if (slideType === SlideType.QUESTION) {
      return (
        <section data-background-color="rgb(252, 211, 77)">
          <div
            data-id="question"
            className="w-full flex justify-center flex-col items-center text-6xl  bg-amber-300 border-amber-500 text-black"
          >
            <div>{questionEn}</div>
            <div>{questionHi}</div>
          </div>
        </section>
      );
    } else if (slideType === SlideType.OPTION_LIST) {
      return (
        <section data-auto-animate data-background-color="white">
          <div className="flex flex-col w-full text-left h-screen">
            <div
              data-id="question"
              className="w-full text-black text-left text-2xl bg-amber-300 h-20 flex pl-4 pt-2 pb-2 pr-4 flex-col"
            >
              <div>{questionEn}</div>
              <div>{questionHi}</div>
            </div>
            <div data-id="options" className="w-full">
              {options.map((opt) => (
                <div
                  className="w-2/3 text-black text-2xl bg-gray-50  pl-4 pt-2 pb-2 pr-4 mt-4"
                  key={opt.en}
                >
                  {opt.en}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    } else if (slideType === SlideType.RIGHT_ANSWER) {
      return (
        <section data-auto-animate data-background-color="white">
          <div className="flex flex-col w-full h-screen">
            <div
              data-id="question"
              className="w-full text-black text-2xl text-left bg-amber-300 h-20 flex pl-4 pt-2 pb-2 pr-4 flex-col"
            >
              <div>{questionEn}</div>
              <div>{questionHi}</div>
            </div>
            <div data-id="options" className="w-full">
              {options.map((opt) => (
                <div
                  className={` flex w-2/3 text-black text-2xl items-center border border-solid pl-4 pt-2 pb-2 pr-4 mt-4 ${
                    opt.isRight ? "border-green-600" : "border-red-600"
                  }`}
                  key={opt.en}
                >
                  <CheckmarkCircle32Filled
                    className={`${
                      opt.isRight ? "text-green-800" : "text-red-800"
                    }`}
                  />{" "}
                  <span className="pl-2">{opt.en}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    } else if (slideType === SlideType.EXPLANATION) {
      return (
        <section data-background-color="white">
          <div className="flex flex-row w-full h-screen">
            <div className="bg-amber-300 w-1/2 flex  text-left flex-col pl-4 pt-4">
              <div data-id="question">
                <div className="text-black text-4xl w-full">{questionEn}</div>
                <div className="text-black text-4xl w-full">{questionEn}</div>
              </div>

              <div className="pt-6">
                <div
                  data-id="options"
                  className="flex w-2/3 text-black text-2xl items-center border border-solid border-green-600"
                >
                  <CheckmarkCircle32Filled className="text-green-800" />{" "}
                  <span className="">{rightAnswer.en}</span>
                </div>
              </div>
            </div>
            <div className="text-black text-4xl w-1/2 pl-4">
              {explanationEn}
            </div>
          </div>
        </section>
      );
    } else {
      <section>InValid Slide type</section>;
    }
  };
  return <>{getSlide()}</>;
};

export default Slide;
