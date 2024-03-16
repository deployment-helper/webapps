import Scene from "@/components/Scene/Scene";
import { Spinner } from "@fluentui/react-components";
import { IScene } from "@/src/types/video.types";
import { useParams } from "next/navigation";
import { useVideoStore } from "@/src/stores/video.store";
import { useEffect } from "react";

export function SceneList(props: ISceneListProps) {
  const params = useParams();
  const setSelectedSceneId = useVideoStore((state) => state.setSelectedSceneId);
  const selectedSceneId = useVideoStore((state) => state.selectedSceneId);
  const onSceneChange = (sceneId: string) => {
    setSelectedSceneId(sceneId);
  };

  useEffect(() => {
    if (props.scenes.length > 0 && !selectedSceneId) {
      setSelectedSceneId(props.scenes[0].id);
    }
  }, [selectedSceneId, props.scenes, setSelectedSceneId]);
  return (
    <div className="flex- flex max-h-screen flex-col items-center overflow-auto pb-10">
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
            onClick={onSceneChange}
            isSelected={scene.id === selectedSceneId}
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
  createScene: () => void;
  isCreating?: boolean;
  isLoading?: boolean;
  scenes: IScene[];
}
export default SceneList;
