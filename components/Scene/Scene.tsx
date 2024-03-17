import { ChangeEvent, useRef, useState } from "react";
import { debounce } from "lodash";
import { Spinner, Textarea } from "@fluentui/react-components";
import {
  useMutationPostTextToSpeech,
  useMutationUpdateScene,
} from "@/src/query/video.query";
import { IScene } from "@/src/types/video.types";
import { PlayCircleHint24Regular } from "@fluentui/react-icons";

let mutateDebounce: any = undefined;
export const Scene = (props: ISceneProps) => {
  const { mutate: updateScene } = useMutationUpdateScene();
  const { mutate: postTextToSpeech, isPending } = useMutationPostTextToSpeech();
  const descRef = useRef<HTMLTextAreaElement>(null);
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
      sceneId: props.id,
      data: { [name]: e.target.value },
    });
  };

  const playDescription = () => {
    const text = descRef.current?.value;
    postTextToSpeech({
      sceneId: props.id,
      text: text || "",
    });
  };

  return (
    <div
      className={`m-1 flex cursor-pointer flex-col border-r-2 p-2 pr-0 ${
        props.isSelected
          ? "border-2 border-blue-200"
          : "border-2 border-blue-50 hover:border-blue-200"
      }`}
      id={props.id}
      onClick={() =>
        props.onClick && props.onClick(props.id, props.layoutId, props.content)
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
        <div className={"relative flex w-10 items-center"}>
          {props.isSelected ? (
            isPending ? (
              <div className={"absolute right-0"}>
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
  );
};

export interface ISceneProps extends IScene {
  videoId: string;
}
export default Scene;
