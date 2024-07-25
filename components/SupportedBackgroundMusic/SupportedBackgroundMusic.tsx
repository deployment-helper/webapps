import { SUPPORTED_BACKGROUND_MUSIC } from '@/src/constants';
import {
  CheckmarkCircle24Filled,
  PlayCircle24Filled,
} from '@fluentui/react-icons';
import { useRef, useState } from 'react';
import { Voice } from '@/components/Voice';

export function SupportedBackgroundMusic({
  onUpdate,
}: ISupportedBackgroundMusicProps) {
  return (
    <div className={'p-4'}>
      <h1 className={'text-xl'}>Background Music</h1>
      <div className={'flex flex-col gap-1 pt-2.5 '}>
        {SUPPORTED_BACKGROUND_MUSIC.map((backgroundMusic) => (
          <Voice voice={backgroundMusic} onUpdateVoice={onUpdate} />
        ))}
      </div>
    </div>
  );
}

export interface ISupportedBackgroundMusicProps {
  onUpdate: (backgroundMusic: string) => void;
}
