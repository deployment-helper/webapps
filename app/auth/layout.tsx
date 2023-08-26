"use client";

import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { FC } from "react";

export const AuthLayout: FC<{
  children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => {
  return <FluentProvider theme={teamsLightTheme}>{children}</FluentProvider>;
};

export default AuthLayout;
