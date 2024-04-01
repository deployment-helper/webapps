import cookies from "@/src/cookies";
import { IPresentation, Presentation } from "../types/types";
import {
  addSlideIds,
  checkAndSetApiKey,
  getApiServer,
  getBatchServer,
} from "../helpers";
import { HttpMethod } from "../constants";

export class ServerClient {
  public static send(
    url: string,
    body?: any,
    method: HttpMethod = HttpMethod.GET,
  ): Promise<any> {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token");
    return fetch(checkAndSetApiKey(url), {
      method,
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  public static sendToAPiServer(
    url: string,
    body?: any,
    method: HttpMethod = HttpMethod.GET,
  ): Promise<any> {
    const API_SERVER = getApiServer();

    return ServerClient.send(new URL(url, API_SERVER).href, body, method);
  }

  public static sendToBatchServer(
    url: string,
    body?: any,
    method: HttpMethod = HttpMethod.GET,
  ): Promise<any> {
    const BATCH_SERVER = getBatchServer();
    return ServerClient.send(new URL(url, BATCH_SERVER).href, body, method);
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

    const data = resp.status !== 201 ? resp.json() : undefined;
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

  /**
   * @Depricated no longer in use
   * @param apiServer
   * @param presentation
   * @param presentationUrl
   */
  public static async generateVideo(
    apiServer: string,
    presentation: IPresentation,
    presentationUrl: string,
  ) {
    const url = `${apiServer}/video/generate`;
    ServerClient.send(
      url,
      { ...presentation, url: presentationUrl, pid: presentation.id },
      HttpMethod.POST,
    );
  }

  /**
   * Generate S3 get signed url
   * @param key key should be the s3 object key ex: 'folder/file.png'
   * @param apiServer
   */
  public static async generateS3GetSignedUrl(key: string, apiServer = "") {
    const url = `${apiServer}/auth/downloadS3ObjUrl?key=${key}`;
    const resp = await ServerClient.sendToAPiServer(
      url,
      undefined,
      HttpMethod.GET,
    );
    return await resp.json();
  }

  // generate S3 put singed URL and mark object as public

  public static async generateS3PutSignedUrl(
    apiServer: string,
    key: string,
    isPublic: boolean = false,
  ) {
    const url = `${apiServer}/auth/uploadS3ObjUrl?key=${key}${
      isPublic ? "&public=true" : ""
    }`;
    const resp = await ServerClient.send(url, undefined, HttpMethod.GET);
    return await resp.json();
  }

  public static async uploadS3Object(
    apiServer: string,
    key: string,
    file: File,
    isPublic: boolean = false,
  ) {
    const resp = await ServerClient.generateS3PutSignedUrl(
      apiServer,
      key,
      isPublic,
    );

    const s3Resp = await fetch(resp.url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (s3Resp.status !== 200) {
      throw new Error("File upload error");
    }

    return resp;
  }

  public static async uploadCanvasImageToS3(
    apiServer: string,
    key: string,
    canvasDataURL: string,
    publicUrl: boolean = false,
  ) {
    const resp = await ServerClient.generateS3PutSignedUrl(
      apiServer,
      key,
      publicUrl,
    );

    // Extract base64 data from the canvas data URL
    const base64Data = canvasDataURL.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const s3Resp = await fetch(resp.url, {
      method: "PUT",
      body: buffer,
      headers: {
        "Content-Type": "image/png", // Adjust content type based on your image type
        "Content-Encoding": "base64", // Specify content encoding as base64
      },
    });

    if (s3Resp.status !== 200) {
      throw new Error("File upload error");
    }

    return resp;
  }
}
