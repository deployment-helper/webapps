import {
  IPresentation,
  IProject,
  IStore,
  IUserWithProjectTypes,
} from "@/src/types/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ServerClient } from "@/src/apis/server.client";

// TODO: code duplication
export const useSlidesStore = create<IStore>()(
  devtools(
    (set, get) => ({
      addServer: (server: string, batchApiServer: string) =>
        set((state) => ({
          ...state,
          apiServer: server,
          batchApiServer: batchApiServer,
        })),
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
            isVideoGenerated: pitem.isVideoGenerated,
            s3VideoFile: pitem.s3VideoFile,
          };
          return presentation;
        });

        set({ ...store, presentations: presentations });
      },
      getPresentation: async (
        pid: string,
        updateAt: string,
        apiKey?: string,
      ) => {
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
          apiKey,
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
      // public URL for existing S3 files to download and view for some time
      getS3PublicUrl: async (key: string) => {
        const store = get();
        const resp: { url: string } = await ServerClient.generateS3GetSignedUrl(
          key,
          store.apiServer as string,
        );

        let s3PublicUrls = store.s3PublicUrls ? store.s3PublicUrls : {};
        s3PublicUrls[key] = resp.url;
        set({
          ...store,
          s3PublicUrls: s3PublicUrls,
        });
        setTimeout(() => {
          store.removeS3PublicUrl(key);
        }, 3600 * 1000);
      },

      // upload S3 file and get public URL
      uploadS3Object: async (file: any, key: string, isPublic = false) => {
        const store = get();
        const resp = await ServerClient.uploadS3Object(
          store.apiServer as string,
          key,
          file,
          isPublic,
        );
        let s3PublicUrls = store.s3PublicUrls ? store.s3PublicUrls : {};
        s3PublicUrls[key] = resp.publicUrl;
        set({
          ...store,
          s3PublicUrls: s3PublicUrls,
        });
      },
      // remove single S3 public url from store
      removeS3PublicUrl: async (key: string) => {
        const store = get();
        let s3PublicUrls = store.s3PublicUrls ? store.s3PublicUrls : {};
        delete s3PublicUrls[key];
        set({
          ...store,
          s3PublicUrls: s3PublicUrls,
        });
      },
    }),
    {
      name: "slide-storage",
    },
  ),
);

export default useSlidesStore;
