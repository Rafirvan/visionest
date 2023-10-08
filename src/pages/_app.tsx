import { type AppType } from "next/app";
import { trpc } from "~/utils/api";
import "@uploadthing/react/styles.css";
import "~/styles/globals.css";
import Head from "next/head";
import Layout from "~/components/layout";
import { useRouter } from "next/router";
import { ClerkProvider } from "@clerk/nextjs";
import { AnimatePresence } from "framer-motion";
import "~/components/backgrounds/vision.css"


const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter()
  return (
    <>
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'self'; img-src https://*; child-src 'none'; connect-src vitals.vercel-insights.com https://pagespeed.web.dev/" />
      <Head>
        <link rel="icon" href="/Onest.png" />
        <title>Visionest</title>
      </Head>

      <ClerkProvider {...pageProps}>

        <Layout>
        <AnimatePresence mode="wait">
            <Component {...pageProps} key={router.route} />
      </AnimatePresence>
        </Layout>

      </ClerkProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);



