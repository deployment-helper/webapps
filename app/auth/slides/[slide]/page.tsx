// @ts-nocheck
"use client";
import { useEffect, useState } from "react";

import { Slide } from "@/components/Slide";
import { SlideType } from "@/src/constants";
import useSlidesStore from "@/src/store";
import { ISlide } from "@/src/types";
import Reveal from "@/reveal.js-4.6.0/dist/reveal.esm";
import { ServerClient } from "@/src/server-client";
const Page = ({
  params,
  searchParams,
}: {
  params: { slide: string };
  searchParams: { updatedAt: string; apiKey: string };
}) => {
  const { getPresentation } = useSlidesStore();
  const apiServer = useSlidesStore((store) => store.apiServer);
  const presentation = useSlidesStore(
    (store) => store.fullPresentations?.get(params.slide),
  );
  const [slides, setSlides] = useState<Array<ISlide>>([]);
  const [slidesMeta, setslidesMeta] = useState<Array<any>>([]);
  const slideTransitionData: Record<string, { dur: number }> = {};

  useEffect(() => {
    if (apiServer) {
      getPresentation(
        params.slide,
        searchParams.updatedAt,
        searchParams.apiKey,
      );
    }
  }, [
    apiServer,
    getPresentation,
    params.slide,
    searchParams.updatedAt,
    searchParams.apiKey,
  ]);

  useEffect(() => {
    console.log("Component mounted/updated");
    if (Reveal) {
      let lastSlideChangedTime = new Date().getTime();
      let totalTime = 0;
      console.log("Reveal initialized");
      Reveal.initialize({});
      Reveal.on("ready", () => {
        console.log("Slide ready");
        lastSlideChangedTime = new Date().getTime();
      });

      Reveal.on("slidechanged", (event) => {
        console.log("Slide Changed");
        console.log(event);
        const time = new Date().getTime();

        const slideId = event.previousSlide.dataset["slideid"];
        console.log(
          ` slide id ${slideId} time  ${time - lastSlideChangedTime} ms, ${
            (time - lastSlideChangedTime) / 1000
          } sec`,
        );
        slideTransitionData[slideId] = {
          dur: (time - lastSlideChangedTime) / 1000,
        };
        lastSlideChangedTime = time;

        // check for last slide
        if (event.indexh === Reveal.getTotalSlides() - 1) {
          console.log("THIS IS A LAST SLIDE");
          console.log(slideTransitionData);
          ServerClient.createVideoMetaData(
            presentation.id,
            slideTransitionData,
            apiServer,
          );
        }
      });

      Reveal.on("slidetransitionend", (event) => {
        console.log("slidetransitionend");
        console.log(event);
      });
      Reveal.on("fragmentshown", (event) => {
        console.log("fragmentshown");
        console.log(event);
      });
      Reveal.on("fragmenthidden", (event) => {
        console.log("fragmenthidden");
        console.log(event);
      });
    }
  });

  useEffect(() => {
    console.log(presentation);
    if (presentation) {
      const s3File = presentation.s3File;
      const s3FileJson = JSON.parse(s3File);
      setSlides(s3FileJson.slides);

      const s3MetaFile = presentation.s3MetaFile;
      if (s3MetaFile) {
        const s3MetaFileJson = JSON.parse(s3MetaFile);
        setslidesMeta(s3MetaFileJson.slides);
      }
    }
  }, [presentation]);

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: "600px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          className="reveal"
          style={{
            minWidth: "500px",
            width: "100%",
            height: "90vh",
          }}
        >
          <div className="slides">
            <section data-autoslide="2000" data-slideid={"start-1"}>
              START 1
            </section>
            <section data-autoslide="2000" n data-slideid={"start-2"}>
              START 2
            </section>
            {slides.map((slide, index) => (
              <>
                <Slide
                  key={slide.questionEn}
                  {...slide}
                  slideType={SlideType.QUESTION}
                  slideMeta={slidesMeta ? slidesMeta[index] : undefined}
                />
                <Slide
                  key={slide.questionEn}
                  {...slide}
                  slideType={SlideType.OPTION_LIST}
                  slideMeta={slidesMeta ? slidesMeta[index] : undefined}
                />
                <Slide
                  key={slide.questionEn}
                  {...slide}
                  slideType={SlideType.RIGHT_ANSWER}
                  slideMeta={slidesMeta ? slidesMeta[index] : undefined}
                />
                <Slide
                  key={slide.questionEn}
                  {...slide}
                  slideType={SlideType.EXPLANATION}
                  slideMeta={slidesMeta ? slidesMeta[index] : undefined}
                />
              </>
            ))}
            <section data-autoslide="2000" data-slideid={"end-1"}>
              end 1
            </section>
            <section data-autoslide="2000" n data-slideid={"end-2"}>
              end 2
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
