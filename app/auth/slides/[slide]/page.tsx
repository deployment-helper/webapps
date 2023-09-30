"use client";
import { useEffect, useState } from "react";

import { Slide } from "@/components/Slide";
import { SlideType } from "@/src/constants";
import useSlidesStore from "@/src/store";
import { ISlide } from "@/src/types";
import Reveal from "@/reveal.js-4.6.0/dist/reveal.esm";
export const Page = ({
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
      console.log("Reveal initialized");
      //@ts-ignore
      Reveal.initialize({});
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
            <section data-autoslide="2000">Slide 1</section>
            <section data-autoslide="2000">Slide 2</section>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
