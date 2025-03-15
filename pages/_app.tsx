import { AppProps } from "next/app";
import Layout from "../src/components/Layout";
import { UserProvider } from "@/context/UserContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </Layout>
  );
};

export default MyApp;
