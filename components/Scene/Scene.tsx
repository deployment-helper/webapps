import { ChangeEvent, useState } from "react";
import { debounce } from "lodash";
import { Textarea } from "@fluentui/react-components";
import { useMutationUpdateScene } from "@/src/query/video.query";
import { IScene } from "@/src/types/video.types";

let mutateDebounce: any = undefined;
export const Scene = (props: ISceneProps) => {
  const { mutate: updateScene } = useMutationUpdateScene();

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

  return (
    <div
      className={`m-1 flex cursor-pointer flex-col border-r-2 p-2 ${
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
          style={{ width: "600px", height: "190px" }}
          className={"border-none"}
          defaultValue={props.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            onInputChange(e, "description")
          }
        >
          {props.description}
        </Textarea>
      </div>
    </div>
  );
};

export interface ISceneProps extends IScene {
  videoId: string;
}
export default Scene;
