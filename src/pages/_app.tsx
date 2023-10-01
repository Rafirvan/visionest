import { type AppType } from "next/app";
import { trpc } from "~/utils/api";
import "@uploadthing/react/styles.css";
import "~/styles/globals.css";
import Head from "next/head";
import Layout from "~/components/layout";
import { useRouter } from "next/router";

import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  const Router = useRouter()
  return (
    <>
      <Head>
        <link rel="icon" href="/icon.png" />
        <title>Visionest</title>

      </Head>
      <ClerkProvider {...pageProps}>

        <Layout>
          <Component {...pageProps} />
        </Layout>

      </ClerkProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);



