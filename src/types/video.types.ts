import { IInput } from "@/src/types/types";
import { type } from "doctrine";

export interface IVideoStore {
  selectedLayoutId: string;
  selectedSceneId: string;
  sceneContent: Record<string, IInput>;
  sceneArrayIndex: number;
  messageBar: IMessage[];
  setMessage: (message: IMessage) => void;
  removeMessage: (id: string) => void;
  setSceneContent: (
    layoutId: string,
    sceneId: string,
    sceneArrayIndex: number,
    content?: Record<string, IInput>,
  ) => void;
}

export enum ELanguage {
  Hindi = "hi-IN",
  English = "en-US",
}

export interface IProject {
  id: string;
  projectName: string;
  userId: string;
}

export interface IMessage {
  id: string;
  title: string;
  body: string;
  link?: {
    url: string;
    text: string;
  };
  intent: "success" | "error" | "warning";
}

export interface IGeneratedVideoInfo {
  cloudFile: string;
  version: string;
}

export interface IVideo {
  id: string;
  name: string;
  description?: string;
  audioLanguage?: ELanguage;
  createdAt: string;
  updatedAt: string;
  userId: string;
  scenesId: string;
  generatedVideoInfo?: IGeneratedVideoInfo[];
}

export enum EWorkerVersion {
  V1 = "v1",
  V2 = "v2",
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
