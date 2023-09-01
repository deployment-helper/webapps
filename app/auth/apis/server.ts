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
}

export default Server;
