"use client";

import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { FC, useEffect } from "react";
import useSlidesStore from "./store";

export const AuthLayout: FC<{
  children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => {
  const { addUser } = useSlidesStore();

  // intialize local store
  useEffect(() => {
    const user = document.querySelector("[data-store]")?.textContent;
    addUser(JSON.parse(user as string));
  }, []);

  return <FluentProvider theme={teamsLightTheme}>{children}</FluentProvider>;
};

export default AuthLayout;
