import Scene from "@/components/Scene/Scene";
import { Spinner } from "@fluentui/react-components";
import { IScene } from "@/src/types/video.types";
import { useParams } from "next/navigation";

export function SceneList(props: ISceneListProps) {
  const params = useParams();

  return (
    <div className="flex- flex flex-col items-center">
      <div className="flex">
        <h1 className="text-4xl">Scenes List</h1>{" "}
        {props.isLoading && <Spinner size="large" />}
      </div>
      <div className="flex flex-col">
        {props.scenes.map((scene) => (
          <Scene
            {...scene}
            videoId={params.video_id as string}
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
        {props.isCreating ? <Spinner size="small" /> : "Create Scene"}
      </button>
    </div>
  );
}

export interface ISceneListProps {
  currentSceneId?: string;
  createScene: () => void;
  isCreating?: boolean;
  isLoading?: boolean;
  scenes: IScene[];
  onSceneChange: (sceneId: string) => void;
}
export default SceneList;
