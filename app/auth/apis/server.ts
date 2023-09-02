import { cookies } from "next/headers";

const API_SERVER = process.env.API_SERVER;

// TODO: Add cache invalidation

export class Server {
  public static async getUserInfo() {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token");

    const url = `${API_SERVER}/auth/me`;

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    return await resp.json();
  }

  public static async createPresentation(body: any) {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token");
    console.log(body);
    const url = `${API_SERVER}/slides/createPresentation`;

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
}

export default Server;
