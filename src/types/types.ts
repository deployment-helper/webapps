// TODO: naming of types need to revist
export interface Option {
  en: string;
  hi?: string;
  isRight?: boolean;
  audioDurEn?: number;
  audioDurHi?: number;
}

export interface ISlide {
  id?: string;
  questionEn: string;
  questionHi?: string;
  audioDurEn?: number;
  audioDurHi?: number;
  rightAnswer: Option;
  explanationEn: string;
  explanationHi?: string;
  audioDurExplanationEn?: number;
  audioDurExplanationHi?: number;
  options: Array<Option>;
}

export interface Presentation {
  name: string;
  nameHi?: string;
  slides: Array<ISlide>;
  desc: string;
  descHi?: string;
  audioDurTitleEn: number;
  audioDurTitleHi?: number;
  audioDurDescEn: number;
  audioDurDescHi?: number;
  projectId?: string;
  presentationId?: string;
}

export interface User {
  name: string;
  email: string;
  image: string;
}

export interface IProject {
  projectId: string;
  projectName: string;
}

export enum ProjectTypes {
  slideProjects = "slideProjects",
}
export interface IUser {
  email: string;
  updatedAt: Date;
  userId: string;
  name?: string;
  createdAt?: Date;
}

export type IUserWithProjectTypes = {
  [key in ProjectTypes]: Array<IProject>;
} & IUser;

export interface IPresentation {
  project: IProject;
  projectId?: string;
  updatedAt: string;
  createdAt: string;
  id: string;
  name: string;
  s3File: string;
  s3MetaFile: string;
  user: IUserWithProjectTypes;
  isAudioGenerated?: boolean;
  isVideoGenerated?: boolean;
  s3VideoFile?: string;
}

export interface IStore {
  apiServer?: string;
  batchApiServer?: string;
  currentProject?: IProject;
  user?: IUserWithProjectTypes;
  presentations?: Array<IPresentation>;
  fullPresentations?: Map<string, any>;
  createSlide?: {
    editorFile: any;
  };
  s3PublicUrls?: Record<string, string>;
  addServer(server: string, batchApiServer: string): void;
  addEditorFile(content: any): void;
  addUser(user: IUserWithProjectTypes): void;
  listPresentations(projectId: string): void;
  getPresentation(pid: string, updateAt: string, apiKey?: string): void;
  getS3PublicUrl(key: string): void;
  uploadS3Object(file: File, key: string, isPublic: boolean): Promise<any>;
  removeS3PublicUrl(key: string): void;
  removeS3PublicUrl(key: string): void;
}

// Video types
export interface IInput {
  type: "input" | "image";
  name: string;
  value?: string;
  placeholder?: string;
}
export interface ILayout {
  image: string;
  id: string;
  componentName: string;
  contentTemplate: Record<string, IInput>;
}

interface exportDefault {
  Presentation: Presentation;
  Slide: ISlide;
  Option: Option;
  IProject: IProject;
  IStore: IStore;
}

export default exportDefault;
