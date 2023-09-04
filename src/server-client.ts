import cookies from "@/src/cookies";

export class ServerClient {
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
}
