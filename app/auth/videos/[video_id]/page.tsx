"use client";
import { useQueryGetScenes, useQueryGetVideos } from "@/src/query/video.query";
import { Spinner } from "@fluentui/react-components";
import { useEffect } from "react";
import Reveal from "@/reveal.js-4.6.0/dist/reveal.esm";
import Image from "next/image";
import RenderLayoutComponent from "@/components/RenderLayoutComponent/RenderLayoutComponent";

export default function VideoPreview({
  params,
}: {
  params: {
    video_id: string;
  };
}) {
  const { data: scenesResp, isLoading } = useQueryGetScenes(params.video_id);
  const videos = scenesResp?.[0].scenes;
  useEffect(() => {
    if (Reveal && videos?.length) {
      console.log("Reveal initialized");
      // @ts-ignore
      Reveal.initialize({
        width: "1280",
        height: "720",
      });
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
              width: "90vw",
              height: "90vh",
              minHeight: "600px",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              className="reveal"
              style={{
                minWidth: "500px",
                maxWidth: "100%",
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
                    data-slideid={`${scene.id}`}
                    data-name={`${scene.id}`}
                  >
                    <RenderLayoutComponent
                      layoutId={scene.layoutId}
                      sceneId={scene.id}
                      content={scene.content}
                    />
                  </section>
                ))}
                <section data-slideid={"end-1"} data-name="end-1">
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
