"use client";
import { useEffect, useState } from "react";

import SceneEditor, {
  ISceneEditorProps,
} from "@/components/SceneEditor/SceneEditor";
import SceneList from "@/components/SceneList/SceneList";
import {
  useMutationCreateScene,
  useQueryGetScenes,
  useQueryGetVideo,
} from "@/src/query/video.query";
import { VideoClient } from "@/src/apis/video.client";
import { useRouter } from "next/navigation";
import { IScene } from "@/src/types/video.types";

export default function Page({ params }: { params: { video_id: string } }) {
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
  const { data: video } = useQueryGetVideo(params.video_id);
  const {
    data: scenesData,
    isFetching: isScenesFetching,
    isLoading: isScenesLoading,
  } = useQueryGetScenes(params.video_id);
  const { mutate: createScene, isPending } = useMutationCreateScene();
  const router = useRouter();
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

  const onCreateScene = () => {
    createScene({ id: params.video_id, name: "New Scene" });
  };

  useEffect(() => {
    async function fetchVideo() {
      const video = await VideoClient.create("New Video");
      await router.push(`/auth/slides/create-new/${video.id}`);
    }

    if (!params.video_id) {
      fetchVideo();
    }
  }, [params.video_id]);
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
          scenes={scenesData || []}
          currentSceneId={currentSceneId}
          onSceneChange={onSceneChange}
          createScene={onCreateScene}
          isCreating={isPending}
          isLoading={isScenesFetching || isScenesLoading}
        />
      </div>
    </div>
  );
}
