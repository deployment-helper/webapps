import { FC, ReactNode } from "react";
import Server from "../apis/server";
import { Header } from "@/components/Header";

export const SlidesLayout: FC<{ children: ReactNode }> = async ({
  children,
}) => {
  const user = await Server.getUserInfo();

  return (
    <>
      <div data-store="addUser" style={{ display: "none" }}>
        {JSON.stringify(user)}
      </div>
      <Header
        title="Dashbord"
        type="auth"
        projectList={user.slideProjects}
        currentProject={user.slideProjects[0]}
        checkForCreatePath
      />
      {children}
    </>
  );
};

export default SlidesLayout;
