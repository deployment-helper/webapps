// @ts-nocheck
"use client";
import { useEffect, useState } from "react";

import { Slide } from "@/components/Slide";
import { SlideType } from "@/src/constants";
import useSlidesStore from "@/src/stores/store";
import { ISlide } from "@/src/types/types";
import Reveal from "@/reveal.js-4.6.0/dist/reveal.esm";
import { ServerClient } from "@/src/apis/server.client";

// TODO: This approach is not used anymore. We can remove this file.
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
  const [time, setTime] = useState("0");
  const [currentSlideTime, setCurrentSlideTime] = useState(0);
  let currentSideStartTime = new Date();
  const updateVideoMetaData = () => {
    ServerClient.createVideoMetaData(
      presentation.item.id,
      presentation.item.projectId,
      presentation.item.updatedAt,
      slideTransitionData,
      apiServer,
      searchParams.apiKey,
    );
  };

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

  const startTimer = () => {
    const startTime = new Date();
    setInterval(() => {
      const currentTime = new Date();
      setTime((currentTime.getTime() - startTime.getTime()) / 1000);
      setCurrentSlideTime(
        (currentTime.getTime() - currentSideStartTime.getTime()) / 1000,
      );
    }, 200);
  };

  useEffect(() => {
    console.log("Component mounted/updated");
    if (Reveal) {
      let lastSlideChangedTime = new Date().getTime();
      let totalTime = 0;
      console.log("Reveal initialized");
      // startTimer();
      Reveal.initialize({});
      Reveal.on("ready", () => {
        console.log("Slide ready");
        lastSlideChangedTime = new Date().getTime();
      });

      Reveal.on("slidechanged", (event) => {
        console.log("Slide Changed");
        console.log(event);
        const time = new Date().getTime();
        currentSideStartTime = new Date();
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
          console.info("THIS IS A LAST SLIDE");
          updateVideoMetaData();
        }
      });
    }
  }, []);

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
            <section data-slideid={"start-1"} data-name="start-1">
              START 1
            </section>
            <section data-slideid={"start-2"} data-name="start-2">
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
            <section data-slideid={"end-1"} data-name="end-1">
              end 1
            </section>
            <section data-slideid={"end-2"} data-name="end-2">
              end 2
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
