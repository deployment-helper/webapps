import { ServerClient } from "@/src/apis/server.client";
import { HttpMethod } from "@/src/constants";
import { IVideo } from "@/src/types/video.types";
import { IScene } from "@/src/types/types";

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

  public static async createScene(id: string, name: string): Promise<IScene> {
    const body = {
      name,
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
}
