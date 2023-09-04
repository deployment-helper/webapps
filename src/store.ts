import {
  IPresentation,
  IProject,
  IStore,
  IUserWithProjectTypes,
} from "@/src/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ServerClient } from "./server-client";

export const useSlidesStore = create<IStore>()(
  devtools(
    persist(
      (set, get) => ({
        addServer: (server: string) =>
          set((state) => ({ ...state, apiServer: server })),
        addUser: (user) => {
          set((store) => ({
            ...store,
            user,
            currentProject: user.slideProjects[0],
          }));
        },
        addEditorFile: (content) =>
          set((store) => ({
            ...store,
            createSlide: {
              ...store.createSlide,
              editorFile: content,
            },
          })),
        listPresentations: async (projectId: string) => {
          const store = get();
          const user = store.user;

          // check for api server
          if (!store.apiServer) {
            throw Error("API server not defined");
          }

          const resp = await ServerClient.listPresentations(
            projectId,
            store.apiServer,
          );
          const items: any = resp.Items;
          const presentations = items.map((pitem: any): IPresentation => {
            const presentation: IPresentation = {
              id: pitem.id,
              project: user?.slideProjects.find(
                (sp) => sp.projectId === pitem.projectId,
              ) as IProject,
              updatedAt: new Date(Number(pitem.updatedAt)),
              createdAt: new Date(pitem.createdAt),
              name: pitem.name,
              user: user as IUserWithProjectTypes,
              s3File: pitem.s32File,
              s3MetaFile: pitem.s3MetaFile,
            };
            return presentation;
          });

          set({ ...store, presentations: presentations });
        },
      }),
      {
        name: "slide-storage",
      },
    ),
  ),
);

export default useSlidesStore;
