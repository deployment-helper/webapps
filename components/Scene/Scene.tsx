import { IScene } from "@/src/types/types";

export const Scene = (props: ISceneProps) => {
  return (
    <div
      className={`flex cursor-pointer flex-col ${
        props.isSelected ? "border-2 border-blue-500" : ""
      }`}
      id={props.id}
      onClick={() => props.onClick && props.onClick(props.id)}
    >
      <h1>{props.name}</h1>
      <div className={"flex"}>
        <img src={props.image} alt={props.name} style={{ maxWidth: "300px" }} />
        <textarea>{props.description}</textarea>
      </div>
    </div>
  );
};

export type ISceneProps = IScene;
export default Scene;
