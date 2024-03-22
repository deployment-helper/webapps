import { IInput } from "@/src/types/types";
import { type } from "doctrine";

export interface IVideoStore {
  selectedLayoutId: string;
  selectedSceneId: string;
  sceneContent: Record<string, IInput>;
  sceneArrayIndex: number;
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

export interface IVideo {
  id: string;
  name: string;
  description?: string;
  audioLanguage?: ELanguage;
  createdAt: string;
  updatedAt: string;
  userId: string;
  scenesId: string;
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
