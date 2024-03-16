"use client";
import { useEffect } from "react";
import SceneEditor from "@/components/SceneEditor/SceneEditor";
import SceneList from "@/components/SceneList/SceneList";
import {
  useMutationCreateScene,
  useQueryGetScenes,
} from "@/src/query/video.query";
import { VideoClient } from "@/src/apis/video.client";
import { useRouter } from "next/navigation";
import { useVideoStore } from "@/src/stores/video.store";

export default function Page({ params }: { params: { video_id: string } }) {
  const selectedLayoutId = useVideoStore((state) => state.selectedLayoutId);
  const {
    data: scenesData,
    isFetching: isScenesFetching,
    isLoading: isScenesLoading,
  } = useQueryGetScenes(params.video_id);
  const { mutate: createScene, isPending } = useMutationCreateScene();
  const router = useRouter();

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
        <SceneEditor />
      </div>
      <div className="w-8/12 bg-blue-200">
        <SceneList
          scenes={scenesData || []}
          createScene={onCreateScene}
          isCreating={isPending}
          isLoading={isScenesFetching || isScenesLoading}
        />
      </div>
    </div>
  );
}
