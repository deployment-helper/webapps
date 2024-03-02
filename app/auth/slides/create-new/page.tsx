"use client";

import SceneEditor, {
  ISceneEditorProps,
} from "@/components/SceneEditor/SceneEditor";

export default function Page() {
  // Page layout three column horizontal layout
  const sceneEditorProps: ISceneEditorProps = {
    currentLayoutId: "layout1",
    layouts: [
      {
        id: "layout1",
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
        image: "/layout2.png",
        content: {
          image: {
            type: "image",
            name: "image",
            value: "Image",
            placeholder: "Image",
          },
        },
      },
      {
        id: "layout3",
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

  return (
    <div className="flex  h-screen w-full">
      <div className="w-1/12 bg-red-200 text-center">Scene</div>
      <div className="w-1/4 bg-green-200">
        <SceneEditor {...sceneEditorProps} />
      </div>
      <div className="w-8/12 bg-blue-200"></div>
    </div>
  );
}
