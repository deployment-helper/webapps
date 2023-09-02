import { IStore, IUserWithProjectTypes } from "@/src/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useSlidesStore = create<IStore>()(
  devtools(
    persist(
      (set) => ({
        addUser: (user) => set((store) => ({ ...store, user })),
        addEditorFile: (content) =>
          set((store) => ({
            ...store,
            createSlide: {
              ...store.createSlide,
              editorFile: content,
            },
          })),
      }),
      {
        name: "slide-storage",
      },
    ),
  ),
);

export default useSlidesStore;
