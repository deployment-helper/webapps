import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VideoClient } from "@/src/apis/video.client";

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

export const useMutationCreateScene = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; name: string }) =>
      VideoClient.createScene(data.id, data.name),
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
    mutationFn: (data: {
      id: string;
      sceneId: string;
      data: Record<string, any>;
    }) => VideoClient.updateScene(data.id, data.sceneId, data.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["video", variables.id, "scenes"],
      });
    },
  });
};
