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
  useMutationUpdateVideo,
  useQueryGetScenes,
  useQueryGetVideo,
} from '@/src/query/video.query';
import { VideoClient } from '@/src/apis/video.client';
import { useRouter } from 'next/navigation';
import { useVideoStore } from '@/src/stores/video.store';
import { generatePreviewUrl, getLayoutContent } from '@/src/helpers';
import { Body1Strong, Button, Spinner } from '@fluentui/react-components';
import { ELanguage, IVoice } from '@/src/types/video.types';

import { useMyToastController } from '@/components/MyToast';
import LayoutSelector from '@/components/LayoutSelector/LayoutSelector';
import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import { SupportedVoices } from '@/components/SupportedVoices/SupportedVoices';
import { SupportedBackgroundMusic } from '@/components/SupportedBackgroundMusic';

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
  const { mutate: updateVideo } = useMutationUpdateVideo();
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

  const [trayOption, setTrayOption] = useState<'scenes' | 'voices' | 'music'>(
    'scenes',
  );

  const scenes = scenesData?.[0]?.scenes || [];

  const onCreateScene = (addAfter = false, sceneArrayIndex?: number) => {
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
      addAfter,
      sceneArrayIndex,
    });
  };

  const playAll = () => {
    if (!scenesData) return;
    const texts = scenes.map((scene) => scene.description! || '');
    mutate({
      text: texts,
      audioLanguage: videoData?.audioLanguage || ELanguage['English (India)'],
      voiceCode: videoData?.voiceCode as string,
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

  const onUpdateVoice = (voiceCode: string) => {
    updateVideo({
      id: videoData?.id as string,
      name: videoData?.name as string,
      data: {
        ...videoData,
        voiceCode: voiceCode,
      },
    });
  };
  const onUpdateBackground = (bgSrc: string) => {
    updateVideo({
      id: videoData?.id as string,
      name: videoData?.name as string,
      data: {
        ...videoData,
        backgroundMusic: bgSrc,
      },
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
        <div
          className={
            'flex items-end justify-start justify-between gap-1 pl-20 pr-20 pt-3'
          }
        >
          <div className={'flex items-end justify-start gap-1'}>
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
          <div className={'flex items-end justify-start gap-1 align-middle'}>
            <Body1Strong># {scenes.length || 0}</Body1Strong>
          </div>
        </div>
        <div
          className={
            'flex items-end justify-start justify-between gap-1 pl-20 pr-20 pt-3'
          }
        >
          {audios && audios.length && (
            <AudioPlayer
              audios={audios.map((a) => a.data)}
              onAudioEnd={() => {}}
            />
          )}
        </div>
        <SceneList
          scenes={scenes || []}
          audioLanguage={videoData?.audioLanguage}
          voiceCode={videoData?.voiceCode}
          createScene={onCreateScene}
          isCreating={isPending}
          sceneDocId={videoData?.scenesId || ''}
          isLoading={isScenesFetching || isScenesLoading}
          onSceneReorder={onSceneReorder}
        />
      </div>
      {/*Right section*/}
      <div className={' flex w-3/12 justify-end'}>
        <div className="w-9/12 border bg-gray-100">
          {trayOption === 'scenes' && (
            <LayoutSelector sceneDocId={videoData?.scenesId || ''} />
          )}
          {trayOption === 'voices' && (
            <SupportedVoices
              onUpdateVoice={onUpdateVoice}
              audioLanguage={videoData?.audioLanguage}
              currentVoice={videoData?.voiceCode}
            />
          )}
          {trayOption === 'music' && (
            <SupportedBackgroundMusic
              onUpdate={onUpdateBackground}
              currentBackgroundMusic={videoData?.backgroundMusic}
            />
          )}
        </div>

        {/*Tray options*/}
        <div className="flex w-2/12 flex-col items-center gap-2 bg-gray-100 pt-2">
          <div
            className={`flex cursor-pointer flex-col items-center  border-2 p-2 ${
              trayOption === 'scenes' && 'bg-gray-300'
            }`}
            onClick={() => setTrayOption('scenes')}
          >
            {trayOption === 'scenes' ? <Image32Filled /> : <Image32Regular />}
            Scenes
          </div>
          <div
            className={`flex cursor-pointer flex-col items-center border-2  p-2 ${
              trayOption === 'voices' && 'bg-gray-300'
            }`}
            onClick={() => setTrayOption('voices')}
          >
            {trayOption === 'voices' ? (
              <PersonVoice24Filled />
            ) : (
              <PersonVoice24Regular />
            )}
            Voices
          </div>
          <div
            className={`flex cursor-pointer flex-col items-center border-2  p-2 ${
              trayOption === 'music' && 'bg-gray-300'
            }`}
            onClick={() => setTrayOption('music')}
          >
            {trayOption === 'music' ? (
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
