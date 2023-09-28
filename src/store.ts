import {
  IPresentation,
  IProject,
  IStore,
  IUserWithProjectTypes,
} from "@/src/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ServerClient } from "./server-client";

// TODO: code duplication
export const useSlidesStore = create<IStore>()(
  devtools(
    (set, get) => ({
      addServer: (server: string) =>
        set((state) => ({ ...state, apiServer: server })),
      addUser: (user) => {
        set((store) => ({
          ...store,
          user,
          currentProject: user.slideProjects
            ? user.slideProjects[0]
            : undefined,
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
            projectId: pitem.projectId,
            project: user?.slideProjects.find(
              (sp) => sp.projectId === pitem.projectId,
            ) as IProject,
            updatedAt: pitem.updatedAt,
            createdAt: pitem.createdAt,
            name: pitem.name,
            user: user as IUserWithProjectTypes,
            s3File: pitem.s3File,
            s3MetaFile: pitem.s3MetaFile,
            isAudioGenerated: pitem.isAudioGenerated,
          };
          return presentation;
        });

        set({ ...store, presentations: presentations });
      },
      getPresentation: async (pid: string, updateAt: string) => {
        const store = get();
        const user = store.user;

        // check for api server
        if (!store.apiServer) {
          throw Error("API server not defined");
        }
        const resp = await ServerClient.getPresentation(
          store.apiServer,
          pid,
          updateAt,
        );
        let fullPresentations = store.fullPresentations
          ? store.fullPresentations
          : new Map<string, any>();

        fullPresentations.set(pid, resp);

        set({
          ...store,
          fullPresentations: fullPresentations,
        });
      },
    }),
    {
      name: "slide-storage",
    },
  ),
);

export default useSlidesStore;
