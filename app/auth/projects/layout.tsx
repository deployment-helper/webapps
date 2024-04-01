import { Header } from "@/components/Header";
import { ReactNode } from "react";
import { useQueryGetProjects } from "@/src/query/video.query";

export default function VideosLayout({ children }: { children: ReactNode }) {
  const { data } = useQueryGetProjects();
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
          projectList={data || []}
          currentProject={undefined}
          checkForCreatePath
        />
        {children}
      </div>
    </>
  );
}
