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
  slideMeta,
}: SlideProps) => {
  const getSlide = () => {
    if (slideType === SlideType.QUESTION) {
      return (
        <section
          data-autoslide={slideMeta?.allQuesDur * 1000}
          data-auto-animate
          data-auto-animate-restart
          data-background-color="white"
        >
          <div
            data-id="question"
            className="justify-cente flex w-full flex-col items-center text-6xl text-black"
          >
            <div>{questionEn}</div>
            <div>{questionHi}</div>
          </div>
        </section>
      );
    } else if (slideType === SlideType.OPTION_LIST) {
      return (
        <section
          data-autoslide={
            slideMeta?.allOptDur < 10 ? 10 * 1000 : slideMeta?.allOptDur * 1000
          }
          data-auto-animate
          data-background-color="white"
        >
          <div className="flex h-screen w-full flex-col text-left">
            <div
              data-id="question"
              className="flex h-20 w-full flex-col bg-amber-300 pb-2 pl-4 pr-4 pt-2 text-left text-2xl text-black"
            >
              <div>{questionEn}</div>
              <div>{questionHi}</div>
            </div>
            <div data-id="options" className="w-full">
              {options.map((opt) => (
                <div
                  data-autoslide="1500"
                  className="fragment mt-4 w-2/3 bg-gray-50 pb-2  pl-4 pr-4 pt-2 text-2xl text-black"
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
        <section
          data-autoslide={
            slideMeta?.rightAnswer?.dur < 5
              ? 5 * 1000
              : slideMeta?.rightAnswer?.dur * 1000
          }
          data-auto-animate
          data-background-color="white"
        >
          <div className="flex h-screen w-full flex-col">
            <div
              data-id="question"
              className="flex h-20 w-full flex-col bg-amber-300 pb-2 pl-4 pr-4 pt-2 text-left text-2xl text-black"
            >
              <div>{questionEn}</div>
              <div>{questionHi}</div>
            </div>
            <div data-id="options" className="w-full">
              {options.map((opt) => (
                <div
                  className={`mt-4 flex w-2/3 items-center border border-solid pb-2 pl-4 pr-4 pt-2 text-2xl text-black ${
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
        <section
          data-autoslide={slideMeta?.explanationDur * 1000}
          data-auto-animate
          data-background-color="white"
        >
          <div className="flex h-screen w-full flex-col">
            <div
              data-id="question"
              className="flex h-20 w-full flex-col bg-amber-300 pb-2 pl-4 pr-4 pt-2 text-left text-2xl text-black"
            >
              <div>{questionEn}</div>
              <div>{questionHi}</div>
            </div>
            <div
              data-id="options"
              className="mb-2 mt-2 flex items-center border border-solid border-green-600 pb-2  pl-2 pt-2 text-2xl text-black"
            >
              <CheckmarkCircle32Filled className="text-green-800" />{" "}
              <span className="">{rightAnswer.en}</span>
            </div>

            <div className="pl-4 pt-4 text-4xl text-black">{explanationEn}</div>
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
