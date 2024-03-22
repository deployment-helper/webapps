import { IVideoStore } from "@/src/types/video.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useVideoStore = create<IVideoStore>()(
  devtools((set, get) => ({
    selectedLayoutId: "",
    selectedSceneId: "",
    sceneArrayIndex: -1,
    sceneContent: {},
    setSceneContent: (layoutId, sceneId, sceneArrayIndex, content) => {
      set((state) => ({
        ...state,
        selectedLayoutId: layoutId,
        selectedSceneId: sceneId,
        sceneArrayIndex,
        sceneContent: content,
      }));
    },
  })),
);
