import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import Server from "./server";

// create token from authrization code
export async function GET(req: NextRequest) {
  const { searchParams, host, protocol } = new URL(req.url);
  const code = searchParams.get("code");
  // TODO: We can move this call to server.ts file
  const resp = await fetch(
    `${process.env.API_SERVER}/auth/createToken?code=${code}`,
    { next: { revalidate: 3600 } },
  );

  const data = await resp.json();

  if (resp.status !== 200) {
    const message = JSON.parse(data.message);
    redirect(`${protocol}//${host}/auth?login=${message.error}`);
  } else {
    const resp = NextResponse.redirect(`${protocol}//${host}/auth/videos`, {
      status: 302,
    });

    resp.cookies.set("id_token", data.id_token);
    resp.cookies.set("access_token", data.access_token);
    resp.cookies.set("refresh_token", data.refresh_token);
    return resp;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);
  const resp = await Server.createPresentation(body);

  return new NextResponse("", { status: resp.status });
}
