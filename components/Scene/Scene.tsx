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
      className={`flex cursor-pointer flex-col ${
        props.isSelected
          ? "border-2 border-blue-500"
          : "border-2 border-t-transparent"
      }`}
      id={props.id}
      onClick={() => props.onClick && props.onClick(props.id)}
    >
      <div className={"flex"}>
        <img
          src={props.image}
          alt={props.name}
          style={{ width: "320px", border: "1px solid" }}
        />
        <Textarea
          style={{ width: "600px", height: "190px" }}
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
