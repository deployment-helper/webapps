import { IInput } from "@/src/types/types";
import { type } from "doctrine";

export interface IVideoStore {
  selectedLayoutId: string;
  selectedSceneId: string;
  sceneContent: Record<string, IInput>;
  setSelectedLayoutId: (layoutId: string) => void;
  setSelectedSceneId: (sceneId: string) => void;
  setSceneContent: (content?: Record<string, IInput>) => void;
}

export interface IVideo {
  id: string;
  name: string;
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
    content?: Record<string, IInput>,
  ) => void;
}
