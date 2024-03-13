import { IUserWithProjectTypes } from "@/src/types/types";
import { cookies } from "next/headers";

const API_SERVER = process.env.API_SERVER;

// TODO: Add cache invalidation

export class Server {
  public static async getUserInfo(): Promise<IUserWithProjectTypes> {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token");

    const url = `${API_SERVER}/auth/me`;

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    return (await resp.json()) as IUserWithProjectTypes;
  }

  public static async createPresentation(body: any) {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token");

    const url = `${API_SERVER}/slides/create`;

    const resp = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token?.value}`,
        "Content-Type": "application/json",
      },
    });

    return resp;
  }

  public static async listPresentations(user: IUserWithProjectTypes) {
    const project = user.slideProjects[0];
    const url = `${API_SERVER}/slides/list?projectId=${project.projectId}`;
    const cookieStore = cookies();
    const token = cookieStore.get("access_token");
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
        "Content-Type": "application/json",
      },
    });

    return await resp.json();
  }
}

export default Server;
