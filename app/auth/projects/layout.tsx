import { Header } from "@/components/Header";
import { ReactNode } from "react";
import HttpClient from "@/app/auth/apis/server";

async function getProjects() {
  const resp = await HttpClient.getProjects();
  return resp;
}

export default async function VideosLayout({
  children,
}: {
  children: ReactNode;
}) {
  const projects = await getProjects();
  return (
    <>
      <div className="flex flex-col items-center">
        <div style={{ display: "none" }}>
          <div data-store="apiServer">{process.env.API_SERVER}</div>
          <div data-store="batchApiServer">{process.env.BATCH_API_SERVER}</div>
        </div>

        <Header
          title="Dashbord"
          type="auth"
          projectList={projects || []}
          currentProject={undefined}
          checkForCreatePath
        />
        {children}
      </div>
    </>
  );
}
