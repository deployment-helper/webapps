import { IBackgroundMusic, IVoice } from '@/src/types/video.types';
import {
  CheckmarkCircle24Filled,
  PlayCircle24Filled,
} from '@fluentui/react-icons';
import { useRef, useState } from 'react';

export const Voice = ({
  voice,
  onUpdateVoice,
}: IVoiceProps<IVoice | IBackgroundMusic>) => {
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
      className={`flex justify-between bg-gray-200 p-1 align-middle hover:bg-gray-300 ${
        isPlaying ? 'border-2 border-gray-500' : ''
      }`}
    >
      <div>
        <div>
          {voice.name}{' '}
          <span className={'bg-green-200 p-0.5 font-bold'}>{voice.rating}</span>
        </div>
      </div>

      <div className={'flex gap-1'}>
        <PlayCircle24Filled
          onClick={playAudio}
          className={`cursor-pointer ${
            isPlaying ? 'text-violet-900' : 'text-violet-700'
          }`}
        />
        <CheckmarkCircle24Filled
          onClick={() =>
            onUpdateVoice((voice as IVoice).voiceCode || (voice.src as string))
          }
          className={'cursor-pointer text-green-600'}
        />
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
}
