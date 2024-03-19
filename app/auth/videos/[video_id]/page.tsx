"use client";
import { useQueryGetScenes, useQueryGetVideos } from "@/src/query/video.query";
import { Spinner } from "@fluentui/react-components";
import { useEffect } from "react";
import Reveal from "@/reveal.js-4.6.0/dist/reveal.esm";
import Image from "next/image";

export default function VideoPreview({
  params,
}: {
  params: {
    video_id: string;
  };
}) {
  const { data: videos, isLoading } = useQueryGetScenes(params.video_id);
  useEffect(() => {
    if (Reveal && videos?.length) {
      console.log("Reveal initialized");
      // @ts-ignore
      Reveal.initialize({});
    }
  }, [videos]);
  if (!params.video_id) return <h1>No video id provided</h1>;

  return (
    <>
      <div className="flex flex-col items-center">
        {isLoading ? (
          <Spinner />
        ) : (
          <div
            style={{
              width: "900vw",
              height: "900vh",
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
                {videos?.map((scene, index) => (
                  <section
                    key={scene.id}
                    data-slideid={scene.id}
                    data-name={scene.name}
                  >
                    {/*TODO: should use next/image*/}
                    <img src={scene.image} alt={scene.name} />
                  </section>
                ))}
                <section data-slideid={"start-1"} data-name="start-1">
                  End 1
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
