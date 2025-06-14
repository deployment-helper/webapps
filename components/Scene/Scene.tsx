'use client';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { Spinner, Textarea } from '@fluentui/react-components';
import {
  useMutationDeleteScene,
  useMutationPostTextToSpeech,
  useMutationUpdateScene,
} from '@/src/query/video.query';
import { ELanguage, IScene } from '@/src/types/video.types';
import {
  AddCircle24Filled,
  Delete20Filled,
  PlayCircleHint24Regular,
  ReOrderDotsVertical24Filled,
} from '@fluentui/react-icons';
import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import RenderLayoutComponent from '@/components/RenderLayoutComponent/RenderLayoutComponent';
import { getSpeakerRefFile } from '@/src/helpers';
import { useVideoStore } from '@/src/stores/video.store';
import { IClearError, IError } from '@/src/types/common.types';

let mutateDebounce: any = undefined;
export const Scene = (props: ISceneProps) => {
  const setSceneDesc = useVideoStore((state) => state.setSceneDesc);

  const descRef = useRef<HTMLTextAreaElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const [isHover, setIsHover] = useState(false);
  const [sceneCSSClasses, setSceneCSSClasses] = useState('');

  const { mutate: updateScene } = useMutationUpdateScene();
  const {
    mutate: postTextToSpeech,
    data: audios,
    isPending,
  } = useMutationPostTextToSpeech();
  const deleteMutation = useMutationDeleteScene();

  const onHover = () => {
    setIsHover(true);
  };
  const onLeave = () => {
    setIsHover(false);
  };
  const onInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string,
  ) => {
    if (mutateDebounce) {
      mutateDebounce.cancel();
    }

    mutateDebounce = debounce(updateScene, 1000);

    mutateDebounce({
      id: props.videoId,
      sceneId: props.sceneDocId,
      layoutId: props.layoutId,
      sceneArrayIndex: props.sceneArrayIndex,
      data: { [name]: e.target.value },
    });

    setSceneDesc(e.target.value);
  };

  const playDescription = () => {
    const text = descRef.current?.value;
    const speakerRefFile = getSpeakerRefFile(
      props.audioLanguage as ELanguage,
      props.voiceCode as string,
    );
    postTextToSpeech({
      text: [text || ''],
      audioLanguage: props.audioLanguage || ELanguage['English (US)'],
      voiceCode: props.voiceCode as string,
      speakerRefFile,
    });
  };

  const deleteScene = () => {
    if (confirm('Are you sure to delete this scene?')) {
      if (props.isDirty) {
        // Clear any errors that are tied to current scene before deleting
        props.onClearError(props.id);
      }

      deleteMutation.mutate({
        id: props.videoId,
        sceneId: props.sceneDocId,
        sceneArrayIndex: props.sceneArrayIndex,
      });
    }
  };

  const onAudioEnd = () => {
    console.log('Audio ended');
  };

  useEffect(() => {
    if (props.isDirty) {
      setSceneCSSClasses(
        `border-2 ${
          props.isSelected
            ? 'border-red-500'
            : ' border-red-300 hover:border-red-500'
        } `,
      );
    } else {
      setSceneCSSClasses(
        `border-2  ${
          props.isSelected ? 'border-violet-500' : 'hover:border-violet-300'
        } `,
      );
    }
  }, [props.isSelected, props.isDirty]);

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      data-index={props.sceneArrayIndex}
      draggable={true}
      onDragStart={(e) => props.onDragStart(e, props.id)}
      onDrop={props.onDrop}
      onDragOver={props.onDragOver}
      className={'scene relative flex items-center'}
    >
      {/*ReOrder handle*/}
      <div
        className={
          'relative flex w-10 cursor-grab flex-col items-center justify-center'
        }
      >
        {props.isSelected || isHover ? (
          <ReOrderDotsVertical24Filled className={'right-8'} />
        ) : (
          <ReOrderDotsVertical24Filled
            className={'right-8'}
            style={{ visibility: 'hidden' }}
          />
        )}
      </div>
      {/*Scene body start*/}
      <div
        className={`m-1 flex cursor-pointer flex-col border-r-2 p-2 pr-0 ${sceneCSSClasses}`}
        id={props.id}
        onClick={() =>
          props.onClick &&
          props.onClick(
            props.id,
            props.layoutId,
            props.sceneArrayIndex,
            props.content,
            props.description,
          )
        }
      >
        <div className={`flex`}>
          <div
            style={{
              width: '220px',
              height: '120px',
            }}
            ref={ref}
          >
            <RenderLayoutComponent
              layoutId={props.layoutId}
              sceneId={props.id}
              content={props.content}
              parentEl={ref?.current}
              onError={(error) => {
                props.onError && props.onError(props.id, error);
              }}
              onClearError={() => {
                props.onClearError && props.onClearError(props.id);
              }}
            />
          </div>

          <Textarea
            ref={descRef}
            style={{ width: '600px', height: '120px' }}
            className={'border-none'}
            defaultValue={props.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onInputChange(e, 'description')
            }
          >
            {props.description}
          </Textarea>
          <div
            className={
              'relative flex w-10 flex-col items-center justify-center gap-3.5'
            }
          >
            {props.isSelected || isHover ? (
              <>
                {deleteMutation.isPending ? (
                  <Spinner size={'tiny'} />
                ) : (
                  <Delete20Filled
                    onClick={deleteScene}
                    className={'block text-red-700'}
                  />
                )}
                {isPending ? (
                  <div className={'right-0'}>
                    <Spinner size={'tiny'} />
                  </div>
                ) : (
                  <PlayCircleHint24Regular
                    className={'block text-violet-700'}
                    onClick={playDescription}
                  />
                )}
              </>
            ) : null}
          </div>
          {(props.isSelected || isHover) && (
            <div className={'absolute -bottom-1.5 flex w-full justify-center'}>
              <AddCircle24Filled
                className={'text-green-600'}
                onClick={() => props.onCreateScene(true, props.sceneArrayIndex)}
              />
            </div>
          )}
        </div>
        {audios && audios.length && (
          <AudioPlayer audios={[audios[0].data]} onAudioEnd={onAudioEnd} />
        )}
        {/*  Drop marker*/}
        {props.markerIndex !== undefined &&
          props.markerIndex === props.sceneArrayIndex && (
            <div
              className={
                'mt-5 flex  h-5 items-center justify-center border-2 bg-blue-200 text-white'
              }
            >
              {props.markerIndex + 1}
            </div>
          )}
      </div>
      {/*  Scene body end*/}
    </div>
  );
};

export interface ISceneProps extends IScene {
  audioLanguage?: ELanguage;
  markerIndex?: number;
  onClearError: IClearError;
  onCreateScene: (addAfter: boolean, sceneArrayIndex?: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onError: IError;
  sceneArrayIndex: number;
  sceneDocId: string;
  videoId: string;
  voiceCode?: string;
}

export default Scene;
