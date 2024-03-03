import { IScene } from "@/src/types";
import Scene from "@/components/Scene/Scene";

export function SceneList(props: ISceneListProps) {
  return (
    <div className="flex flex-col">
      <h1>Scene List</h1>
      <div className="flex flex-col">
        {props.scenes.map((scene) => (
          <Scene
            {...scene}
            key={scene.id}
            onClick={props.onSceneChange}
            isSelected={scene.id === props.currentSceneId}
          />
        ))}
      </div>
      <button
        className="rounded-md bg-blue-500 p-2 text-white"
        onClick={props.createScene}
      >
        Create Scene
      </button>
    </div>
  );
}

export interface ISceneListProps {
  currentSceneId?: string;
  scenes: IScene[];
  onSceneChange: (sceneId: string) => void;
  createScene: () => void;
}
export default SceneList;
