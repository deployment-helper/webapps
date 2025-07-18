import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { VideoClient } from '@/src/apis/video.client';
import { ELanguage, IProject, IVideo } from '@/src/types/video.types';
import { useVideoStore } from '@/src/stores/video.store';
import { v4 } from 'uuid';

export function getProjectVideoQueryKey(projectId: string) {
  return ['project', projectId, 'videos'];
}

export function getProjectsQueryKey() {
  return ['projects'];
}

// TODO: move project and scenes to their own files
// Video quires and mutations
export const useQueryGetVideo = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    refetchOnWindowFocus: false,
    queryFn: () => VideoClient.get(id),
  });
};

export const useMutationS3GetSignedUrl = () => {
  const setMessage = useVideoStore((state) => state.setMessage);
  return useMutation({
    mutationFn: (key: string) => VideoClient.generateS3GetSignedUrl(key),
    onSuccess: (data) => {
      setMessage({
        id: v4(),
        title: '',
        body: 'Your download is ready. Click the download link  to start the download.',
        intent: 'success',
        link: {
          url: data.url,
          text: 'Download Link',
        },
      });
    },
  });
};

export const useMutationUpdateVideo = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; name: string; data?: Partial<IVideo> }) =>
      VideoClient.updateVideo(data.id, data.name, data.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['video', variables.id],
      });
      onSuccess?.();
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

export const useMutationCreateVideoWithWorkflowYoutubeVideoClone = (
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      VideoClient.createWithWorkflowYoutubeVideoClone(data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: getProjectVideoQueryKey(data.projectId),
      });
      if (onSuccess) onSuccess();
    },
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
    {
      text: string[];
      audioLanguage: ELanguage;
      voiceCode?: string;
      merge?: boolean;
      speakerRefFile?: string | null;
    }
  >({
    mutationFn: async (data: {
      text: string[];
      audioLanguage: ELanguage;
      voiceCode?: string;
      merge?: boolean;
      speakerRefFile?: string | null;
    }) => {
      const resp = await VideoClient.textToSpeech(
        data.text,
        data.audioLanguage,
        data.voiceCode,
        data.merge,
        data.speakerRefFile,
      );
      return resp;
    },
  });
};

// Multi-voice text to speech mutation
export const useMutationPostTextToSpeechMultiVoice = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void,
) => {
  return useMutation<
    Array<{ type: string; data: string }>,
    DefaultError,
    {
      conversationText: string;
    }
  >({
    mutationFn: async (data: { conversationText: string }) => {
      const resp = await VideoClient.textToSpeechMultiVoice(
        data.conversationText,
      );
      return resp;
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};

// Project queries

// get List of video query
export const useQueryGetProjects = () => {
  return useQuery({
    queryKey: getProjectsQueryKey(),
    refetchOnWindowFocus: false,
    queryFn: () => VideoClient.getProjects(),
  });
};

export const useQueryGetProject = (id: string) => {
  return useQuery<IProject>({
    queryKey: ['project', id],
    refetchOnWindowFocus: false,
    queryFn: () => VideoClient.getProject(id),
  });
};

export const useMutationCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { projectName: string; projectDescription: string }) =>
      VideoClient.createProject(data.projectName, data.projectDescription),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectsQueryKey(),
      });
    },
  });
};

export const useMutationUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => VideoClient.updateProject(data.id, data),
    onSuccess: (data, variables) => {
      // Invalidate projects list
      queryClient.invalidateQueries({
        queryKey: getProjectsQueryKey(),
      });

      // Invalidate specific project data
      queryClient.invalidateQueries({
        queryKey: ['project', variables.id],
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
        queryKey: getProjectVideoQueryKey(data.projectId || ''),
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
    queryKey: getProjectVideoQueryKey(projectId),
    refetchOnWindowFocus: false,
    queryFn: () => VideoClient.getVideosForProject(projectId),
  });
};

export const useMutationDeleteArtifact = (
  onSuccess?: (variables: any) => void,
) => {
  return useMutation({
    mutationFn: (data: {
      id: string;
      s3Key: string;
      dbKey?: string;
      keyToCompare?: string;
    }) =>
      VideoClient.deleteArtifact(
        data.id,
        data.s3Key,
        data.dbKey,
        data.keyToCompare,
      ),
    onSuccess: (data, variables, context) => {
      onSuccess?.(variables);
    },
  });
};

export const useMutationGetSceneImages = () => {
  return useMutation({
    mutationFn: (data: { sceneDesc: string; visualDesc?: string }) =>
      VideoClient.getSceneImages(data.sceneDesc, data.visualDesc),
  });
};

// write a mutation to upload the video with following parameters
// branch - string, title - string, desc - string, thumbnail_url - string, video_url - string, video_id - string

export const useMutationUploadVideo = (
  onComplete: (state: 'success' | 'error', data: any) => void,
) => {
  return useMutation({
    mutationFn: (data: {
      id: string;
      branch: string;
      title: string;
      desc: string;
    }) => VideoClient.uploadVideo(data.id, data.branch, data.title, data.desc),
    onSettled(data, error, variables, context) {
      onComplete(error ? 'error' : 'success', error || data);
    },
  });
};

export const useMutationGenerateMCQ = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void,
) => {
  return useMutation({
    mutationFn: (data: {
      projectId: string;
      systemPrompt: string;
      assetFiles: string[];
      userPrompt: string;
    }) =>
      VideoClient.generateMCQ(
        data.projectId,
        data.systemPrompt,
        data.assetFiles,
        data.userPrompt,
      ),
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};
