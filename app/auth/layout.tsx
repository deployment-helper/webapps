'use client';

import {
  FluentProvider,
  teamsLightTheme,
  Toaster,
} from '@fluentui/react-components';
import { useEffect } from 'react';
import useSlidesStore from '../../src/stores/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TOAST_ID } from '@/components/MyToast/MyToast.hook';
import { MyMessageBar } from '@/components/MyMessageBar';
const queryClient = new QueryClient();

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { addUser, addServer } = useSlidesStore();
  // @Deprecated this initialization is deprecated will be removed in future
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
        <FluentProvider theme={teamsLightTheme}>
          <MyMessageBar />
          <Toaster toasterId={TOAST_ID} />
          {children}
        </FluentProvider>
      </QueryClientProvider>
    </>
  );
}

export default AuthLayout;
