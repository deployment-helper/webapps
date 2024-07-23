import { ELanguage, IVoice } from '@/src/types/video.types';
import { LANGUAGE_SUPPORTED_VOICES } from '@/src/constants';
import { Voice } from '@/components/Voice';

export const SupportedVoices = ({
  audioLanguage,
  onUpdateVoice,
}: ISupportedVoicesProps) => {
  const supportedVoices = audioLanguage
    ? LANGUAGE_SUPPORTED_VOICES[audioLanguage]
    : undefined;

  return (
    <div className={'p-4'}>
      <h1 className={'text-xl'}>Supported Voices</h1>
      {!supportedVoices ? (
        <div>No supported voices found for {audioLanguage}</div>
      ) : (
        <div className={'flex flex-col gap-1 pt-2.5 '}>
          {supportedVoices.map((voice) => (
            <Voice voice={voice} onUpdateVoice={onUpdateVoice} />
          ))}
        </div>
      )}
    </div>
  );
};

export interface ISupportedVoicesProps {
  audioLanguage?: ELanguage;
  onUpdateVoice: (voice: IVoice) => void;
}
