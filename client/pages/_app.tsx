import "../styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { authContext } from "../lib/auth";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (projectId: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((projectId) => projectId);

  return getLayout(
    <authContext.Provider value={null}>
      <Component {...pageProps} />
    </authContext.Provider>
  );
}
