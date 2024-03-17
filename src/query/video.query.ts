import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { VideoClient } from "@/src/apis/video.client";
import layouts from "@/src/layouts";
import { IInput } from "@/src/types/types";
import { int } from "utrie/dist/types/Trie";

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
    mutationFn: (data: { id: string; name: string }) =>
      VideoClient.update(data.id, data.name),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["video", variables.id],
      });
    },
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
      isInvalidate?: boolean;
    }) =>
      VideoClient.updateScene(data.id, data.sceneId, data.layoutId, data.data),
    onSuccess: (data, variables) => {
      if (variables.isInvalidate) {
        queryClient.invalidateQueries({
          queryKey: ["video", variables.id, "scenes"],
        });
      }
    },
  });
};

// Text to speech queries
export const useMutationPostTextToSpeech = () => {
  return useMutation<
    { type: string; data: string },
    DefaultError,
    { sceneId: string; text: string }
  >({
    mutationFn: async (data: { sceneId: string; text: string }) => {
      const resp = await VideoClient.textToSpeech(data.text);
      return resp;
    },
    onSuccess: (data, variables) => {
      // play data.data this is base64 audio
      const audio = new Audio(`data:audio/mp3;base64,${data.data}`);
      audio.play();
    },
  });
};
