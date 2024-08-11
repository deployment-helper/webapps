import { IAsset, IVoice } from '@/src/types/video.types';
import {
  CheckmarkCircle24Filled,
  PauseCircle24Filled,
  PlayCircle24Filled,
} from '@fluentui/react-icons';
import { useRef, useState } from 'react';
import { Tag } from '@fluentui/react-tags';
// TODO: Rename this component to AudioCard
export const Voice = ({
  isSelected,
  voice,
  onUpdateVoice,
}: IVoiceProps<IVoice | IAsset>) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playAudio = () => {
    const audio = audioRef.current as any;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    audio.currentTime = 0;
    audio.play();
    setIsPlaying(true);
  };

  return (
    <div
      className={`flex justify-between bg-violet-50 p-1 align-middle hover:bg-violet-100 ${
        isPlaying ? 'border-2 border-violet-200' : ''
      }`}
    >
      <div>
        <div className={'flex items-center gap-1'}>
          {voice.name} <Tag appearance={'brand'}>{voice.rating}</Tag>
          {isSelected && (
            <div className={'rounded border-2 border-violet-500'}>
              <Tag appearance={'brand'} className={'bg-amber-100'}>
                Current
              </Tag>
            </div>
          )}
        </div>
      </div>

      <div className={'flex items-center gap-1'}>
        {isPlaying ? (
          <PauseCircle24Filled
            onClick={playAudio}
            className={'cursor-pointer text-violet-400'}
          />
        ) : (
          <PlayCircle24Filled
            onClick={playAudio}
            className={`cursor-pointer text-violet-400`}
          />
        )}
        {!isSelected && (
          <CheckmarkCircle24Filled
            onClick={() =>
              onUpdateVoice(
                (voice as IVoice).voiceCode || (voice.src as string),
              )
            }
            className={'cursor-pointer text-green-600'}
          />
        )}

        <audio
          ref={audioRef}
          hidden={true}
          onEnded={() => {
            setIsPlaying(false);
          }}
          src={voice.src || (voice as IVoice).mp3}
          controls
        />
      </div>
    </div>
  );
};

export interface IVoiceProps<T> {
  voice: T;
  onUpdateVoice: (keyInfo: string) => void;
  isSelected?: boolean;
}
