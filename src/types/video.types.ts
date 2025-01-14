import { IInput } from '@/src/types/types';

export interface IVideoStore {
  selectedLayoutId: string;
  selectedSceneId: string;
  sceneContent: Record<string, IInput>;
  sceneArrayIndex: number;
  messageBar: IMessage[];
  setMessage: (message: IMessage) => void;
  removeMessage: (id: string) => void;
  currentProjectId?: string;
  setSceneContent: (
    layoutId: string,
    sceneId: string,
    sceneArrayIndex: number,
    content?: Record<string, IInput>,
  ) => void;
  setSelectedSceneId: (sceneId: string) => void;
  setCurrentProjectId: (project: string) => void;
}

export enum ELanguage {
  'Afrikaans (South Africa)' = 'af-ZA',
  'Arabic' = 'ar-XA',
  'Basque (Spain)' = 'eu-ES',
  'Bengali (India)' = 'bn-IN',
  'Bulgarian (Bulgaria)' = 'bg-BG',
  'Catalan (Spain)' = 'ca-ES',
  'Chinese (Hong Kong)' = 'yue-HK',
  'Czech (Czech Republic)' = 'cs-CZ',
  'Danish (Denmark)' = 'da-DK',
  'Dutch (Belgium)' = 'nl-BE',
  'Dutch (Netherlands)' = 'nl-NL',
  'English (Australia)' = 'en-AU',
  'English (India)' = 'en-IN',
  'English (UK)' = 'en-GB',
  'English (US)' = 'en-US',
  'Filipino (Philippines)' = 'fil-PH',
  'Finnish (Finland)' = 'fi-FI',
  'French (Canada)' = 'fr-CA',
  'French (France)' = 'fr-FR',
  'German (Germany)' = 'de-DE',
  'Greek (Greece)' = 'el-GR',
  'Gujarati (India)' = 'gu-IN',
  'Hebrew (Israel)' = 'he-IL',
  'Hindi (India)' = 'hi-IN',
  'Hungarian (Hungary)' = 'hu-HU',
  'Icelandic (Iceland)' = 'is-IS',
  'Indonesian (Indonesia)' = 'id-ID',
  'Italian (Italy)' = 'it-IT',
  'Japanese (Japan)' = 'ja-JP',
  'Kannada (India)' = 'kn-IN',
  'Korean (South Korea)' = 'ko-KR',
  'Latvian (Latvia)' = 'lv-LV',
  'Lithuanian (Lithuania)' = 'lt-LT',
  'Malay (Malaysia)' = 'ms-MY',
  'Malayalam (India)' = 'ml-IN',
  'Mandarin Chinese (China)' = 'cmn-CN',
  'Mandarin Chinese (Taiwan)' = 'cmn-TW',
  'Marathi (India)' = 'mr-IN',
  'Norwegian (Norway)' = 'nb-NO',
  'Polish (Poland)' = 'pl-PL',
  'Portuguese (Brazil)' = 'pt-BR',
  'Portuguese (Portugal)' = 'pt-PT',
  'Punjabi (India)' = 'pa-IN',
  'Romanian (Romania)' = 'ro-RO',
  'Russian (Russia)' = 'ru-RU',
  'Serbian (Cyrillic)' = 'sr-RS',
  'Slovak (Slovakia)' = 'sk-SK',
  'Spanish (Spain)' = 'es-ES',
  'Spanish (US)' = 'es-US',
  'Swedish (Sweden)' = 'sv-SE',
  'Tamil (India)' = 'ta-IN',
  'Telugu (India)' = 'te-IN',
  'Thai (Thailand)' = 'th-TH',
  'Turkish (Turkey)' = 'tr-TR',
  'Ukrainian (Ukraine)' = 'uk-UA',
  'Urdu (India)' = 'ur-IN',
  'Vietnamese (Vietnam)' = 'vi-VN',
}

export interface IProject {
  id: string;
  projectName: string;
  projectDesc?: string;
  userId: string;
  assets: string[];
  defaultLanguage?: ELanguage;
  defaultVoice?: string;
  defaultBackgroundMusic?: string;
  defaultOverlay?: string;
  defaultLayout: string;
  sceneRandomAsset?: boolean;
  videoWithDefaultSettings?: boolean;
  videoSubtitles?: boolean;
  defaultMp3SpeakingRate?: number;
  postFixSilence?: string;
  prompts?: Record<string, any>;
  createdAt: {
    _seconds: number;
  };
}

export interface IMessage {
  id: string;
  title: string;
  body: string;
  link?: {
    url: string;
    text: string;
  };
  intent: 'success' | 'error' | 'warning';
}

export interface IGeneratedVideoInfo {
  cloudFile: string;
  version: string;
}

export interface IVideo {
  audioLanguage?: ELanguage;
  backgroundMusic?: string;
  createdAt: {
    _seconds: number;
  };
  defaultAsset?: string;
  description?: string;
  generatedVideoInfo?: IGeneratedVideoInfo[];
  id: string;
  isPublished?: boolean;
  youtubeUrl?: string;
  name: string;
  overlay?: string;
  projectId?: string;
  scenesId: string;
  updatedAt: string;
  userId: string;
  voiceCode?: string;
}

export enum EWorkerVersion {
  V1 = 'v1',
  V2 = 'v2',
}

export interface IGenerateVideoDto {
  url: string;
  version?: EWorkerVersion;
  videoId: string;
}

export interface IScene {
  isSelected?: boolean;
  layoutId: string;
  id: string;
  name: string;
  image: string;
  description: string;
  content?: Record<string, IInput>;
  onClick?: (
    sceneId: string,
    layoutId: string,
    sceneArrayIndex: number,
    content?: Record<string, IInput>,
  ) => void;
}

export interface ISceneResponse {
  videoId: string;
  scenes: IScene[];
}

// TODO: This interface should extend IAsset
export interface IVoice {
  name: string;
  voiceCode: string;
  ssmlGender: 'Male' | 'Female';
  mp3: string;
  src?: string;
  rating: 'H' | 'M' | 'L';
}

export interface IAsset {
  name: string;
  src: string;
  rating: 'H' | 'M' | 'L';
}

export interface IOverlay extends IAsset {
  exampleSrc: string;
}
