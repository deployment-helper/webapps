import { FC, ReactNode } from "react";
import Server from "../apis/server";
import { Header } from "@/components/Header";

export const SlidesLayout: FC<{ children: ReactNode }> = async ({
  children,
}) => {
  const user = await Server.getUserInfo();

  return (
    <>
      <div className="flex flex-col items-center">
        <div style={{ display: "none" }}>
          <div data-store="addUser">{JSON.stringify(user)}</div>
          <div data-store="apiServer">{process.env.API_SERVER}</div>
          <div data-store="batchApiServer">{process.env.BATCH_API_SERVER}</div>
        </div>

        <Header
          title="Dashbord"
          type="auth"
          projectList={user.slideProjects}
          currentProject={
            user.slideProjects && user.slideProjects.length
              ? user.slideProjects[0]
              : undefined
          }
          checkForCreatePath
        />
        {children}
      </div>
    </>
  );
};

export default SlidesLayout;
