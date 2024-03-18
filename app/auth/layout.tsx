"use client";

import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { FC, useEffect } from "react";
import useSlidesStore from "../../src/stores/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();
export const AuthLayout: FC<{
  children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => {
  const { addUser, addServer } = useSlidesStore();

  // initialize local store
  useEffect(() => {
    const user = document.querySelector("[data-store='addUser']")?.textContent;
    if (user && user?.length) {
      addUser(JSON.parse(user as string));
    }
    const apiServer = document.querySelector("[data-store='apiServer']")
      ?.textContent;
    const batchApiServer = document.querySelector(
      "[data-store='batchApiServer']",
    )?.textContent;
    if (apiServer && batchApiServer) {
      addServer(apiServer, batchApiServer);
    }
  }, [addServer, addUser]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <FluentProvider theme={teamsLightTheme}>{children}</FluentProvider>
      </QueryClientProvider>
    </>
  );
};

export default AuthLayout;
