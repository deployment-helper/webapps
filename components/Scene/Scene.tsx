"use client";
import { ChangeEvent, useRef, useState } from "react";
import { debounce } from "lodash";
import { Spinner, Textarea } from "@fluentui/react-components";
import {
  useMutationPostTextToSpeech,
  useMutationUpdateScene,
} from "@/src/query/video.query";
import { ELanguage, IScene } from "@/src/types/video.types";
import {
  PlayCircleHint24Regular,
  ReOrderDotsVertical24Filled,
} from "@fluentui/react-icons";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";

let mutateDebounce: any = undefined;
export const Scene = (props: ISceneProps) => {
  const { mutate: updateScene } = useMutationUpdateScene();
  const {
    mutate: postTextToSpeech,
    data: audios,
    isPending,
  } = useMutationPostTextToSpeech();
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [isHover, setIsHover] = useState(false);

  const onHover = () => {
    setIsHover(true);
  };
  const onLeave = () => {
    setIsHover(false);
  };
  const onInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    if (mutateDebounce) {
      mutateDebounce.cancel();
    }

    mutateDebounce = debounce(updateScene, 1000);

    mutateDebounce({
      id: props.videoId,
      sceneId: props.sceneDocId,
      layoutId: props.layoutId,
      sceneArrayIndex: props.sceneArrayIndex,
      data: { [name]: e.target.value },
    });
  };

  const playDescription = () => {
    const text = descRef.current?.value;
    postTextToSpeech({
      text: [text || ""],
      audioLanguage: props.audioLanguage || ELanguage.English,
    });
  };

  const onAudioEnd = () => {
    console.log("Audio ended");
  };

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      data-index={props.sceneArrayIndex}
      draggable={true}
      onDragStart={(e) => props.onDragStart(e, props.id)}
      onDrop={props.onDrop}
      onDragOver={props.onDragOver}
      className={"scene flex items-center "}
    >
      <div
        className={
          "relative flex w-10 cursor-grab flex-col items-center justify-center"
        }
      >
        {props.isSelected || isHover ? (
          <ReOrderDotsVertical24Filled className={"right-8"} />
        ) : (
          <ReOrderDotsVertical24Filled
            className={"right-8"}
            style={{ visibility: "hidden" }}
          />
        )}
      </div>
      {/*Scene body start*/}
      <div
        className={`m-1 flex cursor-pointer flex-col border-r-2 p-2 pr-0 ${
          props.isSelected
            ? "border-2 border-blue-200"
            : "border-2 border-blue-50 hover:border-blue-200"
        }`}
        id={props.id}
        onClick={() =>
          props.onClick &&
          props.onClick(
            props.id,
            props.layoutId,
            props.sceneArrayIndex,
            props.content,
          )
        }
      >
        <div className={"flex"}>
          <img src={props.image} alt={props.name} style={{ width: "320px" }} />

          <Textarea
            ref={descRef}
            style={{ width: "600px", height: "190px" }}
            className={"border-none"}
            defaultValue={props.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onInputChange(e, "description")
            }
          >
            {props.description}
          </Textarea>
          <div
            className={
              "relative flex w-10 flex-col items-center justify-center"
            }
          >
            <div>
              {props.isSelected || isHover ? (
                isPending ? (
                  <div className={"right-0"}>
                    <Spinner size={"tiny"} />
                  </div>
                ) : (
                  <PlayCircleHint24Regular
                    onClick={playDescription}
                    className={"absolute right-0"}
                  />
                )
              ) : null}
            </div>
          </div>
        </div>
        {audios && audios.length && (
          <AudioPlayer audios={[audios[0].data]} onAudioEnd={onAudioEnd} />
        )}
        {/*  Drop marker*/}
        {props.markerIndex !== undefined &&
          props.markerIndex === props.sceneArrayIndex && (
            <div
              className={
                "mt-5 flex  h-5 items-center justify-center border-2 bg-blue-200 text-white"
              }
            >
              {props.markerIndex + 1}
            </div>
          )}
      </div>
      {/*  Scene body end*/}
    </div>
  );
};

export interface ISceneProps extends IScene {
  videoId: string;
  sceneArrayIndex: number;
  markerIndex?: number;
  sceneDocId: string;
  audioLanguage?: ELanguage;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}
export default Scene;
