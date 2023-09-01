import Header from "@/components/Header/Header";
import { FC } from "react";
import Server from "../apis/server";

export const Slides: FC = async () => {
  const user = await Server.getUserInfo();
  console.log(user);
  return (
    <>
      <Header
        title="Dashbord"
        type="auth"
        projectList={user.slideProjects}
        currentProject={user.slideProjects[0]}
      />
    </>
  );
};

export default Slides;
