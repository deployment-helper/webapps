import { ServerClient } from '@/src/apis/server.client';
import { HttpMethod } from '@/src/constants';
import {
  ELanguage,
  EWorkerVersion,
  IGenerateVideoDto,
  IProject,
  IScene,
  ISceneResponse,
  IVideo,
} from '@/src/types/video.types';

export class VideoClient extends ServerClient {
  public static async create(data: any): Promise<IVideo> {
    const body = {
      ...data,
    };

    const resp = await VideoClient.sendToAPiServer(
      'videos',
      body,
      HttpMethod.POST,
    );
    return resp.json();
  }

  public static async get(id: string): Promise<IVideo> {
    const resp = await VideoClient.sendToAPiServer(`videos/${id}`);
    return resp.json();
  }

  public static async createWithWorkflowYoutubeVideoClone(
    data: any,
  ): Promise<IVideo> {
    const body = {
      ...data,
    };

    const resp = await VideoClient.sendToAPiServer(
      '/workflows/youtube',
      body,
      HttpMethod.POST,
    );

    return resp.json();
  }

  public static async updateVideo(
    id: string,
    name: string,
    data?: Partial<IVideo>,
  ): Promise<IVideo> {
    const body = {
      ...data,
      name,
    };

    const resp = await VideoClient.sendToAPiServer(
      `videos/${id}`,
      body,
      HttpMethod.PUT,
    );

    return resp.json();
  }

  public static async updateProject(id: string, data: any): Promise<IProject> {
    const resp = await VideoClient.sendToAPiServer(
      `projects/${id}`,
      data,
      HttpMethod.PUT,
    );

    return resp.json();
  }

  public static async getVideos(): Promise<IVideo[]> {
    const resp = await VideoClient.sendToAPiServer('videos');
    return resp.json();
  }

  public static async getProjects(): Promise<IProject[]> {
    const resp = await VideoClient.sendToAPiServer('projects');
    return resp.json();
  }

  public static async getProject(id: string): Promise<IProject> {
    const resp = await VideoClient.sendToAPiServer(`projects/${id}`);
    return resp.json();
  }

  public static async createScene(
    id: string,
    name: string,
    layoutId: string,
    data: Record<string, any>,
  ): Promise<IScene> {
    const body = {
      name,
      layoutId,
      ...data,
    };

    const resp = await VideoClient.sendToAPiServer(
      `videos/${id}/scenes`,
      body,
      HttpMethod.POST,
    );

    return resp.json();
  }

  public static async getScenes(id: string): Promise<ISceneResponse[]> {
    const resp = await VideoClient.sendToAPiServer(`videos/${id}/scenes`);
    return resp.json();
  }

  public static async updateScene(
    id: string,
    sceneId: string,
    layoutId: string,
    data: Record<string, any>,
    sceneArrayIndex?: number,
    addAfter?: boolean,
  ): Promise<ISceneResponse[]> {
    const body = {
      ...data,
      layoutId,
    };

    const resp = await VideoClient.sendToAPiServer(
      `videos/${id}/scenes/${sceneId}/${
        sceneArrayIndex === undefined ? '' : sceneArrayIndex
      }${addAfter ? '?addAfter=true' : ''}`,
      body,
      HttpMethod.PUT,
    );

    return resp.json();
  }

  public static async reorderScene(
    id: string,
    sceneId: string,
    sceneArrayIndex: number,
    newSceneArrayIndex: number,
  ): Promise<ISceneResponse[]> {
    const body = {
      newPosition: newSceneArrayIndex,
    };

    const resp = await VideoClient.sendToAPiServer(
      `videos/${id}/scenes/${sceneId}/${sceneArrayIndex}/reorder`,
      body,
      HttpMethod.PUT,
    );

    return resp.json();
  }

  public static async textToSpeech(
    text: string[],
    audioLanguage?: ELanguage,
    voiceCode?: string,
    merge = true,
    speakerRefFile?: string | null,
  ): Promise<{ type: string; data: string }[]> {
    const body = {
      text,
      audioLanguage,
      voiceCode,
      merge,
      speakerRefFile,
    };

    const resp = await VideoClient.sendToAPiServer(
      `ai/synthesis`,
      body,
      HttpMethod.POST,
    );

    return resp.json();
  }

  public static async generateVideoV2(
    id: string,
    data: Exclude<IGenerateVideoDto, 'version'>,
  ): Promise<IVideo> {
    // TODO: add description to this generated video as multiple videos can be generated
    data = {
      ...data,
      version: EWorkerVersion.V1,
    };

    const resp = await VideoClient.sendToBatchServer(
      `batch/generate/v2`,
      data,
      HttpMethod.POST,
    );

    return resp.json();
  }

  public static async delete(id: string): Promise<IVideo> {
    const resp = await VideoClient.sendToAPiServer(
      `videos/${id}`,
      {},
      HttpMethod.DELETE,
    );
    return resp.json();
  }

  public static async copy(
    id: string,
    langTo?: string,
    langFrom?: string,
  ): Promise<IVideo> {
    const body = {
      langTo,
      langFrom,
    };

    const resp = await VideoClient.sendToAPiServer(
      `videos/${id}/copy?langTo=${langTo}&langFrom=${langFrom}`,
      body,
      HttpMethod.POST,
    );

    return resp.json();
  }

  public static async createProject(
    projectName: string,
    projectDesc: string,
  ): Promise<IProject> {
    const body = {
      projectName,
      projectDesc,
    };

    const resp = await VideoClient.sendToAPiServer(
      `projects`,
      body,
      HttpMethod.POST,
    );

    return resp.json();
  }

  public static async deleteScene(
    id: string,
    sceneId: string,
    sceneArrayIndex: number,
  ): Promise<ISceneResponse[]> {
    const resp = await VideoClient.sendToAPiServer(
      `videos/${id}/scenes/${sceneId}/${sceneArrayIndex}`,
      {},
      HttpMethod.DELETE,
    );

    return resp.json();
  }

  public static async getVideosForProject(
    projectId: string,
  ): Promise<IVideo[]> {
    const resp = await VideoClient.sendToAPiServer(
      `videos/project/${projectId}`,
    );
    return resp.json();
  }

  public static async deleteArtifact(
    id: string,
    s3Key: string,
    dbKey?: string,
    keyToCompare?: string,
  ): Promise<void> {
    const resp = await VideoClient.sendToAPiServer(
      `/videos/${id}/artifact`,
      { s3Key, dbKey, keyToCompare },
      HttpMethod.DELETE,
    );
    return resp.json();
  }

  public static async getSceneImages(sceneDesc: string): Promise<string[]> {
    const body = {
      sceneDesc,
    };

    const resp = await VideoClient.sendToImageGenerationServer(
      '/ai/images/scene-images',
      body,
      HttpMethod.POST,
    );

    return resp.json();
  }
}
