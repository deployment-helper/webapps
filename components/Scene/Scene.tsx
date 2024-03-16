import { ChangeEvent, useState } from "react";
import { debounce } from "lodash";
import { Input, Textarea } from "@fluentui/react-components";
import { useMutationUpdateScene } from "@/src/query/video.query";
import { IScene } from "@/src/types/video.types";

let mutateDebounce: any = undefined;
export const Scene = (props: ISceneProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const { mutate: updateScene } = useMutationUpdateScene();

  const onClick = (e: React.MouseEvent | React.FocusEvent) => {
    setIsEditable(true);
  };

  const onBlur = (e: React.FocusEvent) => {
    setIsEditable(false);
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
      <h1 onClick={onClick}>
        {isEditable ? (
          <Input
            defaultValue={props.name}
            onClick={onClick}
            onBlur={onBlur}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onInputChange(e, "name")
            }
          />
        ) : (
          props.name
        )}
      </h1>
      <div className={"flex"}>
        <img
          src={props.image}
          alt={props.name}
          style={{ width: "300px", height: "170px", border: "1px solid" }}
        />
        <Textarea
          style={{ width: "300px", height: "170px" }}
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
