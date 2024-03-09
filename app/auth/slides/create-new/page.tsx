"use client";
import { useState } from "react";

import SceneEditor, {
  ISceneEditorProps,
} from "@/components/SceneEditor/SceneEditor";
import SceneList from "@/components/SceneList/SceneList";
import { IScene } from "@/src/types";

export default function Page() {
  const [currentSceneId, setCurrentSceneId] = useState<string>();
  const [scenes, setScenes] = useState<IScene[]>([]);
  const [sceneEditorProps, setSceneEditorProps] = useState<ISceneEditorProps>({
    currentLayoutId: "layout1",
    currentSceneId: "scene1",
    layouts: [
      {
        id: "layout1",
        componentName: "TitleSubtitle",
        image: "/layout1.png",
        content: {
          title: {
            type: "input",
            name: "title",
            value: "Title",
            placeholder: "Title",
          },
          subtitle: {
            type: "input",
            name: "subtitle",
            value: "Subtitle",
            placeholder: "Subtitle",
          },
        },
      },
      {
        id: "layout2",
        componentName: "Image",
        image: "/layout2.png",
        content: {
          image: {
            type: "image",
            name: "image",
            value: "https://via.placeholder.com/150",
            placeholder: "Image",
          },
        },
      },
      {
        id: "layout3",
        componentName: "Title",
        image: "/layout3.png",
        content: {
          title: {
            type: "input",
            name: "title",
            value: "Title",
            placeholder: "Title",
          },
        },
      },
    ],
  });

  const onSceneChange = (sceneId: string) => {
    setCurrentSceneId(sceneId);
    setSceneEditorProps((prev) => ({ ...prev, currentSceneId: sceneId }));
  };

  const onSceneContentChange = (sceneId: string, image: string) => {
    const newScenes = scenes.map((scene) => {
      if (scene.id === sceneId) {
        return { ...scene, image };
      }
      return scene;
    });
    setScenes(newScenes);
  };

  const createScene = () => {
    const newScene: IScene = {
      id: `scene${scenes.length + 1}`,
      name: `Scene ${scenes.length + 1}`,
      image: "https://via.placeholder.com/150",
      description: "Add a description here.",
    };
    setScenes((prev) => [...prev, newScene]);

    if (!currentSceneId) {
      setCurrentSceneId(newScene.id);
    }
  };

  return (
    <div className="flex  h-screen w-full">
      <div className="w-1/12 bg-red-200 text-center">Scene</div>
      <div className="w-1/4 bg-green-200">
        <SceneEditor
          {...sceneEditorProps}
          onSceneContentChange={onSceneContentChange}
        />
      </div>
      <div className="w-8/12 bg-blue-200">
        <SceneList
          scenes={scenes}
          currentSceneId={currentSceneId}
          onSceneChange={onSceneChange}
          createScene={createScene}
        />
      </div>
    </div>
  );
}
