import { IVideoStore } from '@/src/types/video.types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useVideoStore = create<IVideoStore>()(
  devtools((set, get) => ({
    selectedLayoutId: '',
    selectedSceneId: '',
    sceneArrayIndex: -1,
    sceneContent: {},
    messageBar: [],
    currentProjectId: undefined,
    videoErrors: [],
    setMessage: (message) => {
      set((state) => ({
        ...state,
        messageBar: [...state.messageBar, message],
      }));
    },

    removeMessage: (id) => {
      set((state) => ({
        ...state,
        messageBar: state.messageBar.filter((message) => message.id !== id),
      }));
    },

    setSceneContent: (layoutId, sceneId, sceneArrayIndex, content) => {
      set((state) => ({
        ...state,
        selectedLayoutId: layoutId,
        selectedSceneId: sceneId,
        sceneArrayIndex,
        sceneContent: content,
      }));
    },
    setSelectedSceneId: (sceneId) => {
      set((state) => ({
        ...state,
        selectedSceneId: sceneId,
      }));
    },
    setCurrentProjectId: (project) => {
      set((state) => ({
        ...state,
        currentProjectId: project,
      }));
    },
    setSceneDesc: (desc) => {
      set((state) => ({
        ...state,
        sceneDesc: desc,
      }));
    },
    setVideoErrors: (errors) => {
      set((state) => ({
        ...state,
        videoErrors: errors,
      }));
    },
    clearSceneError: (sceneId) => {
      set((state) => ({
        ...state,
        videoErrors:
          state.videoErrors?.filter((error) => error.sceneId !== sceneId) || [],
      }));
    },
  })),
);
