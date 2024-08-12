import { ELanguage, IAsset, IOverlay, IVoice } from '@/src/types/video.types';

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

export const SUPPORTED_BACKGROUND_MUSIC: Array<IAsset> = [
  {
    name: 'Deep meditation',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/background-music/deep-meditation-192828.mp3',
    rating: 'H',
  },
  {
    name: 'BioDynamic Impact Braam Tonal Dark',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/background-music/biodynamic-impact-braam-tonal-dark-176441.mp3',
    rating: 'H',
  },
  {
    name: 'Production Elements Impactor E',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/background-music/production-elements-impactor-e-188986.mp3',
    rating: 'H',
  },
  {
    name: 'calm-65770',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/background-music/calm-65770.mp3',
    rating: 'H',
  },
  {
    name: 'A calm ambient atmosphere',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/background-music/a-calm-ambient-atmosphere-158464.mp3',
    rating: 'H',
  },
  {
    name: 'Ambient Piano Logo',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/background-music/ambient-piano-logo-165357.mp3',
    rating: 'H',
  },
  {
    name: 'Uplifting Pad Texture',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/background-music/uplifting-pad-texture-113842.mp3',
    rating: 'H',
  },
  {
    name: 'Calming Music',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/background-music/calm-music-64526.mp3',
    rating: 'H',
  },
];

export const WORKFLOWS: Array<{
  id: string;
  name: string;
  url: string;
  desc?: string;
}> = [
  {
    id: 'youtube-video-clone',
    name: 'Youtube video clone',
    url: '/workflows/youtube-video-clone',
    desc: 'Clone of youtube video for given URL',
  },
  {
    id: 'google-slides-to-video',
    name: 'Google slides to video',
    url: '/workflows/google-slides-to-video',
    desc: 'Convert google slides to video',
  },
  {
    id: 'html-page-to-video',
    name: 'HTML page to video',
    url: '/workflows/html-page-to-video',
    desc: 'Convert HTML page to video',
  },
];

export const OVERLAYS: Array<IOverlay> = [
  {
    name: 'Smoke1',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/123dc96f-520a-484f-a803-2c9868c7b692.mov',
    exampleSrc:
      'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/b205cff9-cd15-4c77-8c56-c56ec6ecf18b.mp4',
    rating: 'M',
  },
  {
    name: 'Orange Dust Particles',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/c873647f-e108-4561-a203-7327873b2469.mov',
    exampleSrc:
      'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/9dca1792-fa98-410c-a7e9-1c5f9d8978c0.mp4',
    rating: 'M',
  },
  {
    name: 'Confetti',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/7aebc7e3-86a8-4e2b-9994-634e7aeda3f2.mov',
    exampleSrc:
      'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/d12baf21-5d23-4c6c-af3d-95b47ef9bd73.mp4',
    rating: 'M',
  },
  {
    name: 'Star 1',
    src: 'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/29a9bebd-9534-45e6-b377-5986897ceae7.mov',
    exampleSrc:
      'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/8d3282ad-3f8b-4286-bc52-2714860504bf.mp4',
    rating: 'M',
  },
];

export const SUPPORTED_WORKFLOWS: Array<string> = ['youtube-video-clone'];
