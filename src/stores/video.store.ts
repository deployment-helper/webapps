import { IVideoStore } from "@/src/types/video.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useVideoStore = create<IVideoStore>()(
  devtools((set, get) => ({
    selectedLayoutId: "",
    selectedSceneId: "",
    setSelectedLayoutId: (layoutId: string) =>
      set((state) => ({ ...state, selectedLayoutId: layoutId })),
    setSelectedSceneId: (sceneId: string) =>
      set((state) => ({ ...state, selectedSceneId: sceneId })),
  })),
);
