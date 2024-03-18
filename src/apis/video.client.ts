import { ServerClient } from "@/src/apis/server.client";
import { HttpMethod } from "@/src/constants";
import { IScene, IVideo } from "@/src/types/video.types";

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

  public static async update(id: string, name: string): Promise<IVideo> {
    const body = {
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

  public static async getScenes(id: string): Promise<IScene[]> {
    const resp = await VideoClient.sendToAPiServer(`videos/${id}/scenes`);
    return resp.json();
  }

  public static async updateScene(
    id: string,
    sceneId: string,
    layoutId: string,
    data: Record<string, any>,
  ): Promise<IScene> {
    const body = {
      ...data,
      layoutId,
    };

    const resp = await VideoClient.sendToAPiServer(
      `videos/${id}/scenes/${sceneId}`,
      body,
      HttpMethod.PUT,
    );

    return resp.json();
  }

  public static async textToSpeech(
    text: string,
  ): Promise<{ type: string; data: string }> {
    const body = {
      text,
    };

    const resp = await VideoClient.sendToAPiServer(
      `ai/synthesis`,
      body,
      HttpMethod.POST,
    );

    return resp.json();
  }
}
