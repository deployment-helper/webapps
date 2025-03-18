'use client';

import {
  FluentProvider,
  teamsLightTheme,
  Toaster,
  useId,
} from '@fluentui/react-components';
import { useEffect } from 'react';
import useSlidesStore from '../../src/stores/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useMyToastController, {
  TOAST_ID,
} from '@/components/MyToast/MyToast.hook';
import { MyMessageBar } from '@/components/MyMessageBar';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { addUser, addServer } = useSlidesStore();
  const { dispatchToast } = useMyToastController();
  // @Deprecated this initialization is deprecated will be removed in future
  // initialize local store
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError: (error) => {
          dispatchToast({
            title: 'Server Error',
            body: 'Something went wrong :(',
            intent: 'error',
          });
        },
      },
    },
  });
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
