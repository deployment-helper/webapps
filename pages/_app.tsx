import RootLayout from "@/components/layout";
import { AppProps } from "next/app";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

import dynamic from "next/dynamic";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FluentProvider theme={teamsLightTheme}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </FluentProvider>
  );
}
