"use client";
import { useEffect } from "react";
import SceneEditor from "@/components/SceneEditor/SceneEditor";
import SceneList from "@/components/SceneList/SceneList";
import {
  useMutationPostTextToSpeech,
  useMutationUpdateScene,
  useQueryGetScenes,
  useQueryGetVideo,
} from "@/src/query/video.query";
import { VideoClient } from "@/src/apis/video.client";
import { useRouter } from "next/navigation";
import { useVideoStore } from "@/src/stores/video.store";
import { getLayoutContent } from "@/src/helpers";
import { Button, Spinner } from "@fluentui/react-components";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import { ELanguage } from "@/src/types/video.types";
import { v4 as uuid } from "uuid";

export default function Page({ params }: { params: { video_id: string } }) {
  const selectedLayoutId = useVideoStore((state) => state.selectedLayoutId);
  const {
    data: scenesData,
    isFetching: isScenesFetching,
    isLoading: isScenesLoading,
  } = useQueryGetScenes(params.video_id);
  const { data: videoData } = useQueryGetVideo(params.video_id);
  const { mutate: updateScene, isPending } = useMutationUpdateScene();
  const {
    isPending: isAudioPending,
    data: audios,
    mutate,
  } = useMutationPostTextToSpeech();
  // Routes
  const router = useRouter();

  // Store values
  const selectedLayout = useVideoStore((state) => state.selectedLayoutId);
  const scenes = scenesData?.[0]?.scenes || [];
  const onCreateScene = () => {
    const content = getLayoutContent(selectedLayoutId);

    if (videoData?.scenesId === undefined) return;

    updateScene({
      id: params.video_id,
      sceneId: videoData?.scenesId,
      layoutId: selectedLayout,
      data: {
        id: uuid(),
        content,
      },
    });
  };

  const playAll = () => {
    if (!scenesData) return;
    const texts = scenes.map((scene) => scene.description);
    mutate({
      text: texts,
      audioLanguage: videoData?.audioLanguage || ELanguage.English,
    });
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
        <SceneEditor sceneDocId={videoData?.scenesId || ""} />
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
          scenes={scenes || []}
          audioLanguage={videoData?.audioLanguage}
          createScene={onCreateScene}
          isCreating={isPending}
          sceneDocId={videoData?.scenesId || ""}
          isLoading={isScenesFetching || isScenesLoading}
        />
      </div>
    </div>
  );
}
