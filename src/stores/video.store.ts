import { IVideoStore } from "@/src/types/video.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useVideoStore = create<IVideoStore>()(
  devtools((set, get) => ({
    selectedLayoutId: "",
    selectedSceneId: "",
    sceneContent: {},
    setSceneContent: (layoutId, sceneId, content) => {
      set((state) => ({
        ...state,
        selectedLayoutId: layoutId,
        selectedSceneId: sceneId,
        sceneContent: content,
      }));
    },
  })),
);
