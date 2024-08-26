import { SUPPORTED_BACKGROUND_MUSIC } from '@/src/constants';
import { Voice } from '@/components/Voice';

export function SupportedBackgroundMusic({
  currentBackgroundMusic,
  title = 'Background Music',
  onUpdate,
}: ISupportedBackgroundMusicProps) {
  return (
    <div className={'p-4'}>
      <h1 className={'text-xl'}>{title}</h1>
      <div className={'flex flex-col gap-1 pt-2.5 '}>
        {SUPPORTED_BACKGROUND_MUSIC.map((backgroundMusic) => (
          <Voice
            key={backgroundMusic.src}
            voice={backgroundMusic}
            onUpdateVoice={onUpdate}
            isSelected={backgroundMusic.src === currentBackgroundMusic}
          />
        ))}
      </div>
    </div>
  );
}

export interface ISupportedBackgroundMusicProps {
  onUpdate: (backgroundMusic: string) => void;
  title?: string;
  currentBackgroundMusic?: string;
}
