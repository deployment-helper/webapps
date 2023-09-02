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
}
