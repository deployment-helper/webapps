import { ELanguage, IVoice } from '@/src/types/video.types';

export enum Theme {
  BLUE = 'BLUE',
  YELLOW = 'YELLOW',
}

export enum SlideType {
  QUESTION = 'QUESTION',
  OPTION_LIST = 'OPTION_LIST',
  RIGHT_ANSWER = 'RIGHT_ANSWER',
  EXPLANATION = 'EXPLANATION',
}

export const TOASTER_ID = 'defaultToaster';

export const DEFAULT_THEME = Theme.BLUE;

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE', // You can add more methods as needed
}

export const SUPPORTED_LANGUAGES: Record<
  string,
  { label: string; value: ELanguage }
> = {
  ...Object.entries(ELanguage).reduce(
    (acc, [key, value]) => {
      acc[key] = { label: key, value: value as ELanguage };
      return acc;
    },
    {} as Record<string, { label: string; value: ELanguage }>,
  ),
};

export const LANGUAGE_SUPPORTED_VOICES: Partial<
  Record<ELanguage, Array<IVoice>>
> = {
  [ELanguage['English (US)']]: [
    {
      name: 'Journey-D',
      voiceCode: 'en-US-Journey-D',
      ssmlGender: 'Male',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/en-us-Journey-D.wav',
      rating: 'H',
    },
    {
      name: 'Journey-F',
      voiceCode: 'en-US-Journey-F',
      ssmlGender: 'Female',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/en-us-Journey-F.wav',
      rating: 'H',
    },
    {
      name: 'Neural2-C',
      voiceCode: 'en-US-Neural2-C',
      ssmlGender: 'Female',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/en-us-Neural2-C.wav',
      rating: 'M',
    },
    {
      name: 'Neural2-D',
      voiceCode: 'en-US-Neural2-D',
      ssmlGender: 'Male',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/en-us-Neural2-D.wav',
      rating: 'M',
    },
    {
      name: 'Polyglot-1',
      voiceCode: 'en-US-Polyglot-1',
      ssmlGender: 'Male',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/en-us-Polyglot-1.wav',
      rating: 'M',
    },
    {
      name: 'Wavenet-C',
      voiceCode: 'en-US-Wavenet-C',
      ssmlGender: 'Female',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/en-us-wavenet-C.wav',
      rating: 'M',
    },
  ],
  [ELanguage['Hindi (India)']]: [
    {
      name: 'Neural2-C',
      voiceCode: 'hi-IN-Neural2-C',
      ssmlGender: 'Female',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/hi-IN-Neural2-C.wav',
      rating: 'H',
    },
    {
      name: 'Neural2-D',
      voiceCode: 'hi-IN-Neural2-D',
      ssmlGender: 'Female',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/hi-IN-Neural2-D.wav',
      rating: 'H',
    },
    {
      name: 'Neural2-A',
      voiceCode: 'hi-IN-Neural2-A',
      ssmlGender: 'Female',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/hi-IN-Neural2-A.wav',
      rating: 'H',
    },
    {
      name: 'Neural2-B',
      voiceCode: 'hi-IN-Neural2-B',
      ssmlGender: 'Male',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/hi-IN-Neural2-B.wav',
      rating: 'H',
    },
    {
      name: 'Wavenet-F',
      voiceCode: 'hi-IN-Wavenet-F',
      ssmlGender: 'Male',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/Wavenet-F.wav',
      rating: 'M',
    },
    {
      name: 'Wavenet-E',
      voiceCode: 'hi-IN-Wavenet-E',
      ssmlGender: 'Female',
      mp3: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/text-to-voice-samples/hi-IN-Wavenet-E.wav',
      rating: 'M',
    },
  ],
};

export const SUPPORTED_BACKGROUND_MUSIC: Array<{
  name: string;
  src: string;
  rating: 'H' | 'M' | 'L';
}> = [
  {
    name: 'Deep meditation',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/background-music/deep-meditation-192828.mp3',
    rating: 'H',
  },
];
