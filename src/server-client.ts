import cookies from "@/src/cookies";
import { IPresentation, Presentation } from "./types";
import { addSlideIds } from "./helpers";
import { HttpMethod } from "./constants";

export class ServerClient {
  public static send(
    url: string,
    body?: any,
    method: HttpMethod = HttpMethod.GET,
  ): Promise<any> {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token");
    return fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }
  public static async createPresentation(
    name: string,
    projectId: string,
    presentation: Presentation,
  ) {
    const body: any = {
      name,
      projectId,
      file: addSlideIds(presentation),
    };

    const resp = await fetch("/auth/apis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = resp.status !== 201 ?  resp.json() : undefined;
    return data;
  }

  public static async createVideoMetaData(
    id: string,
    projectId: string,
    updatedAt: string,
    data: any,
    apiServer: string,
    apiKey: string,
  ) {
    const body = {
      id,
      projectId,
      updatedAt,
      data,
    };

    const url = `${apiServer}/slides/createVideoMetaData?key=${apiKey}`;
    await ServerClient.send(url, body, HttpMethod.POST);
  }

  public static async listPresentations(
    projectId: string,
    apiServer: string,
  ): Promise<any> {
    const url = `${apiServer}/slides/list?projectId=${projectId}`;
    const cookieStore = cookies();
    const token = cookieStore.get("access_token");
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return await resp.json();
  }

  public static async getPresentation(
    apiServer: string,
    pid: string,
    updateAt: string,
    apiKey?: string,
  ) {
    const url = `${apiServer}/slides/${pid}?updatedAt=${updateAt} ${
      apiKey ? "&key=" + apiKey + "" : ""
    }`;
    const cookieStore = cookies();
    const token = cookieStore.get("access_token");
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return await resp.json();
  }

  public static async generateAudio(
    apiServer: string,
    presentation: IPresentation,
  ) {
    const url = `${apiServer}/slides/generateAudios`;
    ServerClient.send(url, presentation, HttpMethod.POST);
  }

  public static async generateVideo(
      apiServer: string,
      presentation: IPresentation,
      presentationUrl:string,
  ) {
    const url = `${apiServer}/video/generate`;
    ServerClient.send(url, {...presentation,url:presentationUrl, pid:presentation.id}, HttpMethod.POST);
  }

  // generate S3 get signed url
    public static async generateS3GetSignedUrl(
        apiServer: string,
        key:string,
    ) {
        const url = `${apiServer}/auth/downloadS3ObjUrl?key=${key}`;
        const resp = await ServerClient.send(url, undefined, HttpMethod.GET);
        return await resp.json();
    }
}
