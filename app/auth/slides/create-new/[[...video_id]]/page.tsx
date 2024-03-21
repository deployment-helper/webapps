"use client";
import { useEffect } from "react";
import SceneEditor from "@/components/SceneEditor/SceneEditor";
import SceneList from "@/components/SceneList/SceneList";
import {
  useMutationCreateScene,
  useMutationPostTextToSpeech,
  useQueryGetScenes,
} from "@/src/query/video.query";
import { VideoClient } from "@/src/apis/video.client";
import { useRouter } from "next/navigation";
import { useVideoStore } from "@/src/stores/video.store";
import { getLayoutContent } from "@/src/helpers";
import { Button, Spinner } from "@fluentui/react-components";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";

export default function Page({ params }: { params: { video_id: string } }) {
  const selectedLayoutId = useVideoStore((state) => state.selectedLayoutId);
  const {
    data: scenesData,
    isFetching: isScenesFetching,
    isLoading: isScenesLoading,
  } = useQueryGetScenes(params.video_id);
  // Routes
  const { mutate: createScene, isPending } = useMutationCreateScene();
  const {
    isPending: isAudioPending,
    data: audios,
    mutate,
  } = useMutationPostTextToSpeech();
  const router = useRouter();

  // Store values
  const selectedLayout = useVideoStore((state) => state.selectedLayoutId);
  const onCreateScene = () => {
    const content = getLayoutContent(selectedLayoutId);
    createScene({
      id: params.video_id,
      name: "New Scene",
      layoutId: selectedLayout,
      data: {
        content,
      },
    });
  };

  const playAll = () => {
    if (!scenesData) return;
    const texts = scenesData?.map((scene) => scene.description);
    mutate({ text: texts });
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
      <div className="w-8/12 bg-white">
        <div
          className={"flex items-end items-center justify-end pl-20 pr-20 pt-3"}
        >
          {audios && audios.length && (
            <AudioPlayer
              audios={audios.map((a) => a.data)}
              onAudioEnd={() => {}}
            />
          )}
          <Button appearance={"primary"} shape={"circular"} onClick={playAll}>
            Play All
            <div className={"pl-2"}>
              {isAudioPending && (
                <Spinner appearance={"inverted"} size={"tiny"} />
              )}
            </div>
          </Button>
        </div>
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
