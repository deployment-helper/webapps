export interface Option {
  en: string;
  hi?: string;
  isRight?: boolean;
  audioDurEn?: number;
  audioDurHi?: number;
}

export interface ISlide {
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
  titleEn: string;
  titleHi?: string;
  slides: Array<ISlide>;
  descEn: string;
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
}

export interface IStore {
  apiServer?: string;
  currentProject?: IProject;
  user?: IUserWithProjectTypes;
  presentations?: Array<IPresentation>;
  fullPresentations?: Map<string, any>;
  createSlide?: {
    editorFile: any;
  };
  addServer(server: string): void;
  addEditorFile(content: any): void;
  addUser(user: IUserWithProjectTypes): void;
  listPresentations(projectId: string): void;
  getPresentation(pid: string, updateAt: string): void;
}

interface exoportDefault {
  Presentation: Presentation;
  Slide: ISlide;
  Option: Option;
  IPoject: IProject;
  IStore: IStore;
}

export default exoportDefault;
