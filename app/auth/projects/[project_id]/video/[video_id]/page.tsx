'use client';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Link from 'next/link';
import {
  HeadphonesSoundWave32Filled,
  HeadphonesSoundWave32Regular,
  Image32Filled,
  Image32Regular,
  PersonVoice24Filled,
  PersonVoice24Regular,
  Play20Filled,
} from '@fluentui/react-icons';

import SceneList from '@/components/SceneList/SceneList';
import {
  useMutationPostTextToSpeech,
  useMutationReorderScenes,
  useMutationUpdateScene,
  useQueryGetScenes,
  useQueryGetVideo,
} from '@/src/query/video.query';
import { VideoClient } from '@/src/apis/video.client';
import { useRouter } from 'next/navigation';
import { useVideoStore } from '@/src/stores/video.store';
import { generatePreviewUrl, getLayoutContent } from '@/src/helpers';
import { Body1Strong, Button, Spinner } from '@fluentui/react-components';
import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import { ELanguage } from '@/src/types/video.types';

import { useMyToastController } from '@/components/MyToast';
import LayoutSelector from '@/components/LayoutSelector/LayoutSelector';

export default function Page({
  params,
}: {
  params: { video_id: string; project_id: string };
}) {
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
  const { mutate: reorderScene } = useMutationReorderScenes();
  // Routes
  const router = useRouter();

  const { dispatchToast } = useMyToastController();

  // Store values
  const selectedLayout = useVideoStore((state) => state.selectedLayoutId);
  const setCurrentProject = useVideoStore((state) => state.setCurrentProjectId);

  const [trayOptions, setTrayOptions] = useState<'scenes' | 'voices' | 'music'>(
    'scenes',
  );

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
    const texts = scenes.map((scene) => scene.description! || '');
    mutate({
      text: texts,
      audioLanguage: videoData?.audioLanguage || ELanguage['English (India)'],
    });
  };

  const onSceneReorder = (
    sceneArrayIndex: number,
    newSceneArrayIndex: number,
  ) => {
    reorderScene({
      id: params.video_id,
      sceneId: videoData?.scenesId || '',
      sceneArrayIndex,
      newSceneArrayIndex,
    });
  };

  const createVideo = async () => {
    VideoClient.generateVideoV2(params.video_id as string, {
      videoId: params.video_id as string,
      url: generatePreviewUrl(params.video_id as string, true),
    });
    dispatchToast({
      title: 'Video is being created',
      body: 'You will be notified once the video is ready for download.',
      intent: 'success',
    });
  };

  useEffect(() => {
    async function fetchVideo() {
      const video = await VideoClient.create('New Video');
      await router.push(`/auth/slides/create-new/${video.id}`);
    }

    if (!params.video_id) {
      fetchVideo();
    }
  }, [params.video_id]);

  useEffect(() => {
    setCurrentProject(params.project_id);
  }, [params.project_id]);

  return (
    <div className="flex  h-screen w-full">
      <div className="w-9/12 bg-white">
        <div className={'flex items-end justify-start gap-1 pl-20 pr-20 pt-3'}>
          {audios && audios.length && (
            <AudioPlayer
              audios={audios.map((a) => a.data)}
              onAudioEnd={() => {}}
            />
          )}
          <Button onClick={playAll}>
            Play All
            <div className={'pl-2'}>
              {isAudioPending && (
                <Spinner appearance={'inverted'} size={'tiny'} />
              )}
            </div>
          </Button>
          <Button>
            <Link target={'_blank'} href={`/auth/videos/${params.video_id}`}>
              <Body1Strong>Preview</Body1Strong>
            </Link>
          </Button>
          <Button appearance={'primary'} onClick={createVideo}>
            Create Video
            <Play20Filled className="cursor-pointer" />
          </Button>
        </div>
        <SceneList
          scenes={scenes || []}
          audioLanguage={videoData?.audioLanguage}
          createScene={onCreateScene}
          isCreating={isPending}
          sceneDocId={videoData?.scenesId || ''}
          isLoading={isScenesFetching || isScenesLoading}
          onSceneReorder={onSceneReorder}
        />
      </div>
      <div className={' flex w-3/12 justify-end'}>
        <div className="w-9/12 border bg-gray-100">
          <LayoutSelector sceneDocId={videoData?.scenesId || ''} />
        </div>
        <div className="flex w-2/12 flex-col items-center gap-2 bg-gray-100 pt-2">
          <div
            className={`flex cursor-pointer flex-col items-center  border-2 p-2 ${
              trayOptions === 'scenes' && 'bg-gray-300'
            }`}
            onClick={() => setTrayOptions('scenes')}
          >
            {trayOptions === 'scenes' ? <Image32Filled /> : <Image32Regular />}
            Scenes
          </div>
          <div
            className={`flex cursor-pointer flex-col items-center border-2  p-2 ${
              trayOptions === 'voices' && 'bg-gray-300'
            }`}
            onClick={() => setTrayOptions('voices')}
          >
            {trayOptions === 'voices' ? (
              <PersonVoice24Filled />
            ) : (
              <PersonVoice24Regular />
            )}
            Voices
          </div>
          <div
            className={`flex cursor-pointer flex-col items-center border-2  p-2 ${
              trayOptions === 'music' && 'bg-gray-300'
            }`}
            onClick={() => setTrayOptions('music')}
          >
            {trayOptions === 'music' ? (
              <HeadphonesSoundWave32Filled />
            ) : (
              <HeadphonesSoundWave32Regular />
            )}
            Music
          </div>
        </div>
      </div>
    </div>
  );
}
