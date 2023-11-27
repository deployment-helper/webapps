"use client";

import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { FC, useEffect } from "react";
import useSlidesStore from "../../src/store";

export const AuthLayout: FC<{
  children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => {
  const { addUser, addServer } = useSlidesStore();

  // intialize local store
  useEffect(() => {
    const user = document.querySelector("[data-store='addUser']")?.textContent;
    if (user && user?.length) {
      addUser(JSON.parse(user as string));
    }
    const apiServer = document.querySelector("[data-store='apiServer']")
      ?.textContent;
    const batchApiServer = document.querySelector("[data-store='batchApiServer']")
      ?.textContent;
    if (apiServer && batchApiServer) {
      addServer(apiServer,batchApiServer);
    }
  }, [addServer, addUser]);

  return <FluentProvider theme={teamsLightTheme}>{children}</FluentProvider>;
};

export default AuthLayout;
