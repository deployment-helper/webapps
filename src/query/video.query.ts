import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { VideoClient } from '@/src/apis/video.client';
import { ELanguage, IVideo } from '@/src/types/video.types';
import { useVideoStore } from '@/src/stores/video.store';
import { v4 } from 'uuid';

// TODO: move project and scenes to their own files
// Video quires and mutations
export const useQueryGetVideo = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    refetchOnWindowFocus: false,
    queryFn: () => VideoClient.get(id),
  });
};

export const useMutationDownloadVideo = () => {
  const setMessage = useVideoStore((state) => state.setMessage);
  return useMutation({
    mutationFn: (key: string) => VideoClient.generateS3GetSignedUrl(key),
    onSuccess: (data) => {
      setMessage({
        id: v4(),
        title: 'Download Video',
        body: 'Video is ready for download. Click the link below to download.',
        intent: 'success',
        link: {
          url: data.url,
          text: 'Download',
        },
      });
    },
  });
};

export const useMutationUpdateVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; name: string; data?: Partial<IVideo> }) =>
      VideoClient.update(data.id, data.name, data.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['video', variables.id],
      });
    },
  });
};

// get List of video query
export const useQueryGetVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    refetchOnWindowFocus: false,
    queryFn: () => VideoClient.getVideos(),
  });
};
export const useMutationCreateVideo = () => {
  return useMutation({
    mutationFn: (data: any) => VideoClient.create(data),
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
        queryKey: ['video', variables.id, 'scenes'],
      });
    },
  });
};

export const useQueryGetScenes = (id: string) => {
  return useQuery({
    queryKey: ['video', id, 'scenes'],
    refetchOnWindowFocus: false,
    queryFn: () => VideoClient.getScenes(id),
  });
};

export const useMutationUpdateScene = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['video', 'updateScene'],
    mutationFn: (data: {
      id: string;
      sceneId: string;
      layoutId: string;
      data: Record<string, any>;
      sceneArrayIndex?: number;
      addAfter?: boolean;
    }) =>
      VideoClient.updateScene(
        data.id,
        data.sceneId,
        data.layoutId,
        data.data,
        data.sceneArrayIndex,
        data.addAfter,
      ),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['video', variables.id, 'scenes'],
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
        queryKey: ['video', variables.id, 'scenes'],
      });
    },
  });
};

// Text to speech queries
export const useMutationPostTextToSpeech = () => {
  return useMutation<
    Array<{ type: string; data: string }>,
    DefaultError,
    { text: string[]; audioLanguage: ELanguage; merge?: boolean }
  >({
    mutationFn: async (data: {
      text: string[];
      audioLanguage: ELanguage;
      merge?: boolean;
    }) => {
      const resp = await VideoClient.textToSpeech(
        data.text,
        data.audioLanguage,
        data.merge,
      );
      return resp;
    },
  });
};

// Project queries

// get List of video query
export const useQueryGetProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    refetchOnWindowFocus: false,
    queryFn: () => VideoClient.getProjects(),
  });
};

export const useMutationCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { projectName: string; projectDescription: string }) =>
      VideoClient.createProject(data.projectName, data.projectDescription),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
    },
  });
};

export const useMutationDeleteVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => VideoClient.delete(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['videos'],
      });
    },
  });
};

// video.query.ts
export const useMutationCopyVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; langTo?: string; langFrom?: string }) =>
      VideoClient.copy(data.id, data.langTo || '', data.langFrom || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['videos'],
      });
    },
  });
};

export const useMutationDeleteScene = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      sceneId: string;
      sceneArrayIndex: number;
    }) => VideoClient.deleteScene(data.id, data.sceneId, data.sceneArrayIndex),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['video', variables.id, 'scenes'],
      });
    },
  });
};

export const useQueryGetVideosForProject = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'videos'],
    refetchOnWindowFocus: false,
    queryFn: () => VideoClient.getVideosForProject(projectId),
  });
};
