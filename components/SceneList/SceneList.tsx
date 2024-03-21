import Scene from "@/components/Scene/Scene";
import { Spinner } from "@fluentui/react-components";
import { ELanguage, IScene } from "@/src/types/video.types";
import { useParams } from "next/navigation";
import { useVideoStore } from "@/src/stores/video.store";
import { useEffect } from "react";
import { IInput } from "@/src/types/types";

export function SceneList(props: ISceneListProps) {
  const params = useParams();
  const setSelectedContent = useVideoStore((state) => state.setSceneContent);
  const selectedSceneId = useVideoStore((state) => state.selectedSceneId);
  const onSceneChange = (
    sceneId: string,
    layoutId: string,
    content?: Record<string, IInput>,
  ) => {
    setSelectedContent(layoutId, sceneId, content);
  };

  useEffect(() => {
    if (props.scenes.length > 0 && !selectedSceneId) {
      const scene = props.scenes[0];
      setSelectedContent(scene.layoutId, scene.id, scene.content);
    }
  }, [selectedSceneId, props.scenes, setSelectedContent]);
  return (
    <div className="flex- flex max-h-screen flex-col items-center overflow-auto pb-10 pt-10">
      <div className="flex flex-col">
        {props.scenes.map((scene) => (
          <Scene
            {...scene}
            videoId={params.video_id as string}
            audioLanguage={props.audioLanguage}
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
  audioLanguage?: ELanguage;
}
export default SceneList;
