import { ServerClient } from "@/src/apis/server.client";
import { HttpMethod } from "@/src/constants";
import { IVideo } from "@/src/types/video.types";

export class VideoClient extends ServerClient {
  public static async create(
    id: string,
    projectId: string,
    updatedAt: string,
    data: any,
  ): Promise<IVideo> {
    const body = {
      id,
      projectId,
      updatedAt,
      data,
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
}
