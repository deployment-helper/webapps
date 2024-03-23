import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { VideoClient } from "@/src/apis/video.client";
import { useState } from "react";
import { ELanguage, IVideo } from "@/src/types/video.types";

// Video quires and mutations
export const useQueryGetVideo = (id: string) => {
  return useQuery({
    queryKey: ["video", id],
    queryFn: () => VideoClient.get(id),
  });
};

export const useMutationUpdateVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; name: string; data?: Partial<IVideo> }) =>
      VideoClient.update(data.id, data.name, data.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["video", variables.id],
      });
    },
  });
};

// get List of video query
export const useQueryGetVideos = () => {
  return useQuery({
    queryKey: ["videos"],
    queryFn: () => VideoClient.getVideos(),
  });
};
export const useMutationCreateVideo = () => {
  return useMutation({
    mutationFn: (name: string) => VideoClient.create(name),
  });
};

// Scene queries and mutations
export const useMutationCreateScene = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      layoutId: string;
      data: Record<string, any>;
    }) => VideoClient.createScene(data.id, data.name, data.layoutId, data.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["video", variables.id, "scenes"],
      });
    },
  });
};

export const useQueryGetScenes = (id: string) => {
  return useQuery({
    queryKey: ["video", id, "scenes"],
    queryFn: () => VideoClient.getScenes(id),
  });
};

export const useMutationUpdateScene = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["video", "updateScene"],
    mutationFn: (data: {
      id: string;
      sceneId: string;
      layoutId: string;
      data: Record<string, any>;
      sceneArrayIndex?: number;
    }) =>
      VideoClient.updateScene(
        data.id,
        data.sceneId,
        data.layoutId,
        data.data,
        data.sceneArrayIndex,
      ),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["video", variables.id, "scenes"],
      });
    },
  });
};

export const useMutationReorderScenes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      sceneId: string;
      sceneArrayIndex: number;
      newSceneArrayIndex: number;
    }) =>
      VideoClient.reorderScene(
        data.id,
        data.sceneId,
        data.sceneArrayIndex,
        data.newSceneArrayIndex,
      ),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["video", variables.id, "scenes"],
      });
    },
  });
};

// Text to speech queries
export const useMutationPostTextToSpeech = () => {
  return useMutation<
    Array<{ type: string; data: string }>,
    DefaultError,
    { text: string[]; audioLanguage: ELanguage }
  >({
    mutationFn: async (data: { text: string[]; audioLanguage: ELanguage }) => {
      const resp = await VideoClient.textToSpeech(
        data.text,
        data.audioLanguage,
      );
      return resp;
    },
  });
};
