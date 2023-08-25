import Header from "@/components/header/header";
import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {}, []);

  return (
    <>
      <Head>
        <title>This is layout title</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/reveal.js@4.5.0/dist/reveal.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://unpkg.com/reveal.js@4.5.0/dist/theme/white.css"
        ></link>
      </Head>
      {children}
      <Script
        async
        src="https://unpkg.com/reveal.js@4.5.0/dist/reveal.js"
      ></Script>
    </>
  );
}
