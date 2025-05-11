'use client';
import {
  useMutationPostTextToSpeech,
  useQueryGetScenes,
  useQueryGetVideo,
} from '@/src/query/video.query';
import { Spinner } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import Reveal from 'reveal.js';
import RenderLayoutComponent from '@/components/RenderLayoutComponent/RenderLayoutComponent';
import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import { ELanguage } from '@/src/types/video.types';

export default function VideoPreview({
  params,
}: {
  params: {
    video_id: string;
  };
}) {
  const { data: video } = useQueryGetVideo(params.video_id);
  const { data: scenesResp, isLoading } = useQueryGetScenes(params.video_id);
  const videos = scenesResp?.[0].scenes;

  const [sceneIndex, setSceneIndex] = useState<number | undefined>(undefined);
  const [play, setPlay] = useState(false);
  const [isRevealInitialized, setIsRevealInitialized] = useState(false);
  const [isPrintPdf, setIsPrintPdf] = useState(false);
  const {
    isPending: isAudioPending,
    data: audios,
    mutate,
  } = useMutationPostTextToSpeech();
  useEffect(() => {
    if (Reveal && videos?.length) {
      console.log('Reveal initialized');
      // @ts-ignore
      Reveal.initialize({
        width: 1280,
        height: 720,
      }).then(() => {
        setIsRevealInitialized(true);
      });

      //Reveal js slide change listener
      Reveal.addEventListener('slidechanged', function (event: any) {
        // read data attribute of the slide
        const slideId = event.currentSlide.getAttribute('data-slideid');
        const sceneIndex = event.currentSlide.getAttribute('data-sceneindex');
        console.log('Slide changed to ', slideId);
        console.log('Slide changed to ', event.indexh);
        console.log('Scene Index ', sceneIndex);
        if (sceneIndex !== null && sceneIndex !== undefined) {
          setSceneIndex(parseInt(sceneIndex));
          setPlay(true);
        }
      });
    }
    return () => {
      isRevealInitialized && Reveal.destroy();
    };
  }, [videos]);
  // Fetch audio for the first time
  useEffect(() => {
    if (videos?.length && !audios) {
      const texts = videos.map((v) => v.description! || '');
      mutate({
        text: texts,
        audioLanguage: video?.audioLanguage || ELanguage['English (US)'],
        merge: false,
      });
    }
  }, [params.video_id, videos, audios, mutate]);

  useEffect(() => {
    // read query string value print-pdf and set a flag to print pdf
    const urlParams = new URLSearchParams(window.location.search);
    const printPdf = urlParams.has('print-pdf');
    if (printPdf) {
      setIsPrintPdf(true);
    }
  }, []);

  if (!params.video_id) return <h1>No video id provided</h1>;

  return (
    <>
      <div className="flex flex-col items-center">
        {isLoading ? (
          <Spinner />
        ) : (
          <div
            style={{
              width: '90vw',
              height: isPrintPdf ? '100%' : '90vh',
              minHeight: '600px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              className="reveal"
              style={{
                minWidth: '500px',
                maxWidth: '100%',
                width: '100%',
                height: '90vh',
              }}
            >
              <div className="slides">
                {/*
                  This slide is meant to be static, it will be shown immediately as the
                  page loads and give time to other slides to load correctly and also
                  allow sound to be played as user navigates.
                */}
                <section
                  data-slideid={'start-1'}
                  data-name="start-1"
                  data-description={'hello world'}
                  className={'bg-green-300'}
                  style={{ position: 'relative' }}
                >
                  Navigate between slides using arrow keys
                  <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                    }}
                  >
                    ➡️
                  </span>
                </section>
                {videos?.map((scene, index) => (
                  <section
                    key={scene.id}
                    data-slideid={`${scene.id}`}
                    data-name={`${scene.id}`}
                    data-description={scene.description}
                    data-sceneindex={index}
                    data-language={video?.audioLanguage || 'en-US'}
                  >
                    <RenderLayoutComponent
                      isDisplayNone={false}
                      layoutId={scene.layoutId}
                      sceneId={scene.id}
                      content={scene.content}
                    />
                  </section>
                ))}
                <section
                  data-slideid={'end-1'}
                  data-name="end-1"
                  data-description={'hello world'}
                  className={'bg-red-300'}
                  style={{ position: 'relative' }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '10px',
                    }}
                  >
                    ⬅️
                  </span>
                  The End
                </section>
              </div>
            </div>
          </div>
        )}
        {isAudioPending ? (
          <Spinner appearance={'inverted'} size={'tiny'} />
        ) : (
          <AudioPlayer
            audios={audios ? audios.map((a) => a.data) : []}
            onAudioEnd={() => {
              console.log('Audio Ended');
            }}
            nextIndex={sceneIndex}
            play={play}
            autoPlay={false}
          />
        )}
      </div>
    </>
  );
}
