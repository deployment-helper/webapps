import {
  CheckmarkCircle32Filled,
  DismissCircle32Filled,
} from "@fluentui/react-icons";

import { FC } from "react";
import { SlideProps } from "./Slide.types";
import { SlideType } from "@/src/constants";
import { marked } from "marked";

export const Slide: FC<SlideProps> = ({
  questionEn,
  questionHi,
  options,
  rightAnswer,
  slideType,
  explanationEn,
  slideMeta,
  id,
}: SlideProps) => {
  const getSlide = () => {
    if (slideType === SlideType.QUESTION) {
      return (
        <section
          data-transition="fade-in fade-out"
          data-auto-animate-restart
          data-background-color="white"
          data-slideid={`${id}-question`}
          data-audioUrl={slideMeta?.questionEn?.file}
        >
          <div
            data-id="question"
            className="justify-cente flex w-full flex-col items-center text-6xl text-black"
          >
            <div
              dangerouslySetInnerHTML={{ __html: marked.parse(questionEn) }}
            ></div>
            <div
              dangerouslySetInnerHTML={{
                __html: marked.parse(questionHi as string),
              }}
            />
          </div>
        </section>
      );
    } else if (slideType === SlideType.OPTION_LIST) {
      return (
        <section
          data-transition="fade-in fade-out"
          data-background-color="white"
          data-slideid={`${id}-option-list`}
          data-audioUrl={slideMeta?.questionEn?.file}
        >
          <div className="flex h-screen w-full flex-col text-left">
            <div
              data-id="question"
              className="flex  w-full flex-col bg-amber-300 pb-2 pl-4 pr-4 pt-2 text-left text-2xl text-black"
            >
              <div
                dangerouslySetInnerHTML={{ __html: marked.parse(questionEn) }}
              ></div>
              <div
                dangerouslySetInnerHTML={{
                  __html: marked.parse(questionHi as string),
                }}
              />
            </div>
            <div data-id="options" className="w-full">
              {options.map((opt: any, index) => (
                <div
                  className="mt-4 w-2/3 bg-gray-50 pb-2  pl-4 pr-4 pt-2 text-2xl text-black"
                  key={opt.en}
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(opt.en),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      );
    } else if (slideType === SlideType.RIGHT_ANSWER) {
      return (
        <section
          data-transition="fade-in fade-out"
          data-background-color="white"
          data-slideid={`${id}-right-answer`}
          data-audioUrl={slideMeta?.rightAnswer?.file}
        >
          <div className="flex h-screen w-full flex-col">
            <div
              data-id="question"
              className="flex  w-full flex-col bg-amber-300 pb-2 pl-4 pr-4 pt-2 text-left text-2xl text-black"
            >
              <div
                dangerouslySetInnerHTML={{ __html: marked.parse(questionEn) }}
              ></div>
              <div
                dangerouslySetInnerHTML={{
                  __html: marked.parse(questionHi as string),
                }}
              />
            </div>
            <div data-id="options" className="w-full">
              {options.map((opt) => (
                <div
                  className={`mt-4 flex w-2/3 items-center border border-solid pb-2 pl-4 pr-4 pt-2 text-2xl text-black ${
                    opt.isRight ? "border-green-600" : "border-red-600"
                  }`}
                  key={opt.en}
                >
                  {opt.isRight ? (
                    <CheckmarkCircle32Filled className="text-green-800" />
                  ) : (
                    <DismissCircle32Filled className="text-red-800" />
                  )}{" "}
                  <span
                    className="pl-2"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(opt.en),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    } else if (slideType === SlideType.EXPLANATION) {
      return (
        <section
          data-transition="fade-in fade-out"
          data-background-color="white"
          data-slideid={`${id}-explation`}
          data-audioUrl={slideMeta?.explanationEn?.file}
        >
          <div className="flex h-screen w-full flex-col">
            <div
              data-id="question"
              className="flex  w-full flex-col bg-amber-300 pb-2 pl-4 pr-4 pt-2 text-left text-2xl text-black"
            >
              <div
                dangerouslySetInnerHTML={{ __html: marked.parse(questionEn) }}
              ></div>
              <div
                dangerouslySetInnerHTML={{
                  __html: marked.parse(questionHi as string),
                }}
              />
            </div>
            <div
              data-id="options"
              className="mb-2 mt-2 flex items-center border border-solid border-green-600 pb-2  pl-2 pt-2 text-2xl text-black"
            >
              <CheckmarkCircle32Filled className="text-green-800" />{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: marked.parse(rightAnswer.en),
                }}
              />
            </div>

            <div
              className="pl-4 pt-4 text-4xl text-black"
              dangerouslySetInnerHTML={{
                __html: marked.parse(explanationEn),
              }}
            />
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
