import cookies from "@/src/cookies";
import { IPresentation } from "./types";

export class ServerClient {
  public static send(
    url: string,
    body?: any,
    method: string = "GET",
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
    file: any,
  ) {
    const body: any = {
      name,
      projectId,
      file,
    };

    const resp = await fetch("/auth/apis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = resp.json();
    return data;
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
    ServerClient.send(url, presentation, "POST");
  }
}
