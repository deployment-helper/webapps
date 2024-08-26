import { ELanguage } from '@/src/types/video.types';
import { LANGUAGE_SUPPORTED_VOICES } from '@/src/constants';
import { Voice } from '@/components/Voice';

export const SupportedVoices = ({
  audioLanguage,
  currentVoice,
  title = 'Supported Voices',
  onUpdateVoice,
}: ISupportedVoicesProps) => {
  const supportedVoices = audioLanguage
    ? LANGUAGE_SUPPORTED_VOICES[audioLanguage]
    : undefined;

  return (
    <div className={'p-4'}>
      <h1 className={'text-xl'}>{title}</h1>
      {!supportedVoices ? (
        <div>No supported voices found for {audioLanguage}</div>
      ) : (
        <div className={'flex flex-col gap-1 pt-2.5 '}>
          {supportedVoices.map((voice) => (
            <Voice
              key={voice.src}
              voice={voice}
              onUpdateVoice={onUpdateVoice}
              isSelected={voice.voiceCode === currentVoice}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export interface ISupportedVoicesProps {
  title?: string;
  audioLanguage?: ELanguage;
  currentVoice?: string;
  onUpdateVoice: (voiceCode: string) => void;
}
