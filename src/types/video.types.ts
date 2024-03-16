import { IInput } from "@/src/types/types";

export interface IVideoStore {
  selectedLayoutId: string;
  selectedSceneId: string;
  setSelectedLayoutId: (layoutId: string) => void;
  setSelectedSceneId: (sceneId: string) => void;
}

export interface IVideo {
  id: string;
  name: string;
}

export interface IScene {
  isSelected?: boolean;
  id: string;
  name: string;
  image: string;
  description: string;
  content?: Record<string, IInput>;
  onClick?: (sceneId: string) => void;
}
