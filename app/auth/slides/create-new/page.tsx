"use client";

import SceneEditor, {
  ISceneEditorProps,
} from "@/components/SceneEditor/SceneEditor";
import SceneList from "@/components/SceneList/SceneList";
import { IScene } from "@/src/types";

export default function Page() {
  // Page layout three column horizontal layout
  const sceneEditorProps: ISceneEditorProps = {
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
  };

  let scenes: IScene[] = [
    {
      id: "1",
      title: "Scene 1",
      sceneImage: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="flex  h-screen w-full">
      <div className="w-1/12 bg-red-200 text-center">Scene</div>
      <div className="w-1/4 bg-green-200">
        <SceneEditor {...sceneEditorProps} />
      </div>
      <div className="w-8/12 bg-blue-200">
        <SceneList scenes={scenes} currentSceneId={"1"} />
      </div>
    </div>
  );
}
