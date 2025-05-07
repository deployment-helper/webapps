'use client';
import { ComponentType, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Link from 'next/link';
import {
  HeadphonesSoundWave32Regular,
  Image32Regular,
  PersonVoice24Regular,
  Play20Filled,
  SlideSettings24Regular,
} from '@fluentui/react-icons';

import SceneList from '@/components/SceneList/SceneList';
import {
  useMutationPostTextToSpeech,
  useMutationReorderScenes,
  useMutationUpdateScene,
  useMutationUpdateVideo,
  useQueryGetProject,
  useQueryGetScenes,
  useQueryGetVideo,
} from '@/src/query/video.query';
import { VideoClient } from '@/src/apis/video.client';
import { useRouter } from 'next/navigation';
import { useVideoStore } from '@/src/stores/video.store';
import {
  generatePreviewUrl,
  getLayout,
  getSpeakerRefFile,
  splitIntoLines,
  updateDefaultAsset,
} from '@/src/helpers';
import {
  Body1Strong,
  Button,
  Spinner,
  Title1,
} from '@fluentui/react-components';
import { ELanguage } from '@/src/types/video.types';

import { useMyToastController } from '@/components/MyToast';
import LayoutSelector from '@/components/LayoutSelector/LayoutSelector';
import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import { SupportedVoices } from '@/components/SupportedVoices/SupportedVoices';
import { SupportedBackgroundMusic } from '@/components/SupportedBackgroundMusic';
import CopyIcon from '@/components/CopyIcon/CopyIcon';
import VideoSettings from '@/components/VideoSettings/VideoSettings';
import { ReusableDialog } from '@/components/Dialog';

export default function Page({
  params,
}: {
  params: { video_id: string; project_id: string };
}) {
  // Routes
  const router = useRouter();
  const { dispatchToast } = useMyToastController();

  const [hoverState, setHoverState] = useState<Record<string, boolean>>({});
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isVideoLanguageError, setIsVideoLanguageError] = useState(false);
  const TRAY_OPTIONS_MUSIC = 'music';
  const TRAY_OPTIONS_SCENES = 'scenes';
  const TRAY_OPTIONS_VOICES = 'voices';
  const TRAY_OPTIONS_SETTINGS = 'settings';
  type TrayOptions =
    | typeof TRAY_OPTIONS_MUSIC
    | typeof TRAY_OPTIONS_SCENES
    | typeof TRAY_OPTIONS_VOICES
    | typeof TRAY_OPTIONS_SETTINGS;
  const [trayOption, setTrayOption] =
    useState<TrayOptions>(TRAY_OPTIONS_SCENES);

  // Store values
  const selectedLayoutId = useVideoStore((state) => state.selectedLayoutId);
  const setCurrentProject = useVideoStore((state) => state.setCurrentProjectId);
  const videoErrors = useVideoStore((state) => state.videoErrors);

  const TRAY_OPTIONS: Array<{
    name: TrayOptions;
    Icon: ComponentType;
    label: string;
  }> = [
    {
      name: 'scenes',
      Icon: Image32Regular,
      label: 'Scenes',
    },
    {
      name: 'voices',
      Icon: PersonVoice24Regular,
      label: 'Voices',
    },
    {
      name: 'music',
      Icon: HeadphonesSoundWave32Regular,
      label: 'Music',
    },
    {
      name: 'settings',
      Icon: SlideSettings24Regular,
      label: 'Settings',
    },
  ];

  const {
    data: scenesData,
    isFetching: isScenesFetching,
    isLoading: isScenesLoading,
  } = useQueryGetScenes(params.video_id);
  const { data: videoData } = useQueryGetVideo(params.video_id);
  const { data: projectData } = useQueryGetProject(params.project_id);

  const { mutate: updateScene, isPending } = useMutationUpdateScene();
  const { mutate: updateVideo } = useMutationUpdateVideo();
  const {
    isPending: isAudioPending,
    data: audios,
    mutate,
  } = useMutationPostTextToSpeech();
  const { mutate: reorderScene } = useMutationReorderScenes();

  const scenes = scenesData?.[0]?.scenes || [];
  const defaultProjectLayout =
    projectData?.sceneRandomAsset && projectData?.defaultLayout;
  const defaultAssets = videoData?.defaultAsset
    ? [videoData?.defaultAsset]
    : projectData?.assets;

  const onCreateSceneFromText = (text: string) => {
    const scenesDesc = splitIntoLines(text);
    const _layoutId = selectedLayoutId || defaultProjectLayout || '';
    const layoutsWithContent = scenesDesc.map((sceneDesc) =>
      getLayout(_layoutId, projectData?.sceneRandomAsset, defaultAssets, {
        desc: sceneDesc,
      }),
    );

    if (videoData?.scenesId === undefined) return;
    updateScene({
      id: params.video_id,
      sceneId: videoData?.scenesId,
      layoutId: _layoutId,
      data: {
        scenes: layoutsWithContent.map((layout, index) => ({
          id: uuid(),
          content: layout?.content,
          image: layout?.image,
          description: scenesDesc[index],
          layoutId: _layoutId,
        })),
      },
    });
  };

  const onCreateScene = (addAfter = false, sceneArrayIndex?: number) => {
    const _layoutId = selectedLayoutId || defaultProjectLayout || '';
    const _layout = getLayout(
      _layoutId,
      projectData?.sceneRandomAsset,
      videoData?.defaultAsset ? [videoData?.defaultAsset] : projectData?.assets,
    );
    if (videoData?.scenesId === undefined) return;
    updateScene({
      id: params.video_id,
      sceneId: videoData?.scenesId,
      layoutId: _layoutId,
      data: {
        id: uuid(),
        content: _layout?.content,
        image: _layout?.image,
      },
      addAfter,
      sceneArrayIndex,
    });
  };

  const playAll = () => {
    if (!scenesData) return;
    const texts = scenes.map((scene) => scene.description! || '');
    const speakerRefFile = getSpeakerRefFile(
      videoData?.audioLanguage as ELanguage,
      videoData?.voiceCode as string,
    );

    mutate({
      text: texts,
      audioLanguage: videoData?.audioLanguage || ELanguage['English (US)'],
      voiceCode: videoData?.voiceCode as string,
      speakerRefFile,
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
    if (videoErrors?.length || isVideoLanguageError) {
      setIsErrorDialogOpen(true);
      return;
    }

    // Update video status to in_progress
    updateVideo({
      id: params.video_id,
      name: videoData?.name || '',
      data: {
        ...videoData,
        status: 'in_progress',
      },
    });

    const speakerRefFile = getSpeakerRefFile(
      videoData?.audioLanguage as ELanguage,
      videoData?.voiceCode || '',
    );
    VideoClient.generateVideoV2(params.video_id as string, {
      videoId: params.video_id as string,
      speakerRefFile,
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

  const onUpdateDefaultAsset = (
    defaultAsset: string,
    isUpdateExistingScenes?: boolean,
  ) => {
    updateVideo({
      id: videoData?.id as string,
      name: videoData?.name as string,
      data: {
        ...videoData,
        defaultAsset,
      },
    });
    if (isUpdateExistingScenes) {
      updateExistingScenes(defaultAsset);
    }
  };

  const updateExistingScenes = (defaultAsset: string) => {
    const updatedScenes = updateDefaultAsset(scenes, defaultAsset);
    const _layoutId = updatedScenes[0].layoutId;
    updateScene({
      id: params.video_id,
      sceneId: videoData?.scenesId || '',
      layoutId: _layoutId,
      data: {
        scenes: updatedScenes,
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

  useEffect(() => {
    if (!videoData?.audioLanguage || !videoData?.voiceCode) {
      setIsVideoLanguageError(true);
    } else {
      setIsVideoLanguageError(false);
    }
  }, [videoData?.audioLanguage, videoData?.voiceCode]);
  return (
    <div className="flex  h-screen w-full">
      <div className="w-9/12 bg-white">
        {(videoErrors?.length && isErrorDialogOpen && (
          <ReusableDialog
            open={isErrorDialogOpen}
            title={'Video Creation Error'}
            onClose={() => {
              setIsErrorDialogOpen(false);
            }}
          >
            <>
              <ul className={'list-inside list-disc pl-5 text-red-700'}>
                <li>
                  <Body1Strong>
                    This video cannot be generated as some image/video are not
                    loading. Please check red bordered scenes on the page.
                  </Body1Strong>
                </li>
                {isVideoLanguageError && (
                  <li>
                    <Body1Strong>
                      Video language or voice is not selected.
                    </Body1Strong>
                  </li>
                )}
              </ul>
            </>
          </ReusableDialog>
        )) ||
          ''}
        {/*Sub Header*/}
        <div
          className={
            'flex items-end justify-start justify-between gap-1 pl-20 pr-20 pt-3'
          }
        >
          <div className={'flex items-end justify-start gap-1'}>
            <Button disabled={isAudioPending} onClick={playAll}>
              Play All
              <div className={'pl-2'}>
                {isAudioPending && (
                  <Spinner appearance={'primary'} size={'tiny'} />
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
          <div className={'flex flex-col gap-2'}>
            <div
              className={'relative'}
              onMouseOver={() => {
                setHoverState({ ...hoverState, videoName: true });
              }}
              onMouseLeave={() => {
                setHoverState({ ...hoverState, videoName: false });
              }}
            >
              <Title1>{videoData?.name}</Title1>
              {hoverState?.videoName && (
                <CopyIcon copyText={videoData?.name || ''} />
              )}
            </div>
            <div
              className={'relative'}
              onMouseOver={() => {
                setHoverState({ ...hoverState, videoDesc: true });
              }}
              onMouseLeave={() => {
                setHoverState({ ...hoverState, videoDesc: false });
              }}
            >
              <Body1Strong title={videoData?.description}>
                {`${videoData?.description?.substr(0, 100)}...`}
              </Body1Strong>
              {hoverState?.videoDesc && (
                <CopyIcon copyText={videoData?.description || ''} />
              )}
            </div>
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
          createBulkScenes={onCreateSceneFromText}
          isCreating={isPending}
          sceneDocId={videoData?.scenesId || ''}
          isLoading={isScenesFetching || isScenesLoading}
          onSceneReorder={onSceneReorder}
        />
      </div>
      {/*Right section*/}
      <div className={' flex w-3/12 justify-end'}>
        {/*TODO: Use inline drawer from fluent UI*/}
        <div className="w-9/12 border bg-gray-100">
          {trayOption === TRAY_OPTIONS_SCENES && (
            <LayoutSelector
              sceneDocId={videoData?.scenesId || ''}
              name={videoData?.name}
              description={videoData?.description}
              visualPrompt={videoData?.visualPrompt}
            />
          )}
          {trayOption === TRAY_OPTIONS_VOICES && (
            <SupportedVoices
              onUpdateVoice={onUpdateVoice}
              audioLanguage={videoData?.audioLanguage}
              currentVoice={videoData?.voiceCode}
            />
          )}
          {trayOption === TRAY_OPTIONS_MUSIC && (
            <SupportedBackgroundMusic
              onUpdate={onUpdateBackground}
              currentBackgroundMusic={videoData?.backgroundMusic}
            />
          )}
          {trayOption === TRAY_OPTIONS_SETTINGS && (
            <VideoSettings
              currentDefaultAsset={videoData?.defaultAsset}
              onUploadSuccess={onUpdateDefaultAsset}
            />
          )}
        </div>

        {/*Tray options*/}
        <div className="flex w-2/12 flex-col items-center gap-2 bg-gray-100 pt-2">
          {TRAY_OPTIONS.map((option) => (
            <div
              key={option.name}
              className={`flex cursor-pointer flex-col items-center border-2 p-2 ${
                trayOption === option.name && 'bg-gray-300'
              }`}
              onClick={() => setTrayOption(option.name)}
            >
              {trayOption === option.name ? <option.Icon /> : <option.Icon />}
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
