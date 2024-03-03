import { IInput, IScene } from "@/src/types";

export function SceneList(props: ISceneListProps) {
  return (
    <div className="flex flex-col">
      <h1>Scene List</h1>
      <div className="flex flex-wrap">
        {props.scenes.map((scene) => (
          <div key={scene.id}>
            <img
              style={{ width: "200px", cursor: "pointer" }}
              className={`p-0.5 ${
                scene.id === props.currentSceneId
                  ? "border-2 border-blue-500"
                  : ""
              }`}
              src={scene.sceneImage}
              alt={scene.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export interface ISceneListProps {
  currentSceneId: string;
  scenes: IScene[];
}
export default SceneList;
