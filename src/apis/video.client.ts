import { ServerClient } from "@/src/apis/server.client";
import { HttpMethod } from "@/src/constants";
import {
  ELanguage,
  IScene,
  ISceneResponse,
  IVideo,
} from "@/src/types/video.types";

export class VideoClient extends ServerClient {
  public static async create(name: string): Promise<IVideo> {
    const body = {
      name,
    };

    const resp = await VideoClient.sendToAPiServer(
      "videos",
      body,
      HttpMethod.POST,
    );
    return resp.json();
  }

  public static async get(id: string): Promise<IVideo> {
    const resp = await VideoClient.sendToAPiServer(`videos/${id}`);
    return resp.json();
  }

  public static async update(
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

  public static async getVideos(): Promise<IVideo[]> {
    const resp = await VideoClient.sendToAPiServer("videos");
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
  ): Promise<ISceneResponse[]> {
    const body = {
      ...data,
      layoutId,
    };

    const resp = await VideoClient.sendToAPiServer(
      `videos/${id}/scenes/${sceneId}/${
        sceneArrayIndex === undefined ? "" : sceneArrayIndex
      }`,
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
  ): Promise<{ type: string; data: string }[]> {
    const body = {
      text,
      audioLanguage,
    };

    const resp = await VideoClient.sendToAPiServer(
      `ai/synthesis`,
      body,
      HttpMethod.POST,
    );

    return resp.json();
  }
}
