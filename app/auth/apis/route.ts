import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams, host, protocol } = new URL(req.url);
  const code = searchParams.get("code");

  const resp = await fetch(
    `${process.env.API_SERVER}/auth/createToken?code=${code}`,
  );

  const data = await resp.json();

  if (resp.status !== 200) {
    const message = JSON.parse(data.message);
    redirect(`${protocol}//${host}/auth?login=${message.error}`);
  } else {
    const resp = NextResponse.redirect(`${protocol}//${host}/auth/slides`, {
      status: 302,
    });

    resp.cookies.set("id_token", data.id_token);
    resp.cookies.set("access_token", data.access_token);
    resp.cookies.set("refresh_token", data.refresh_token);
    return resp;
  }
}
