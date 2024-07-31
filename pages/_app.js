import { useEffect, useState } from "react";
import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { StoreContext } from "../contexts";
import fclConfig from "../utils/config";
import { load } from "../account";
import toast, { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  const [store, setStore] = useState({ network: process.env.network });

  useEffect(() => {
    fclConfig();
    const cache = load();
    console.log("cache ==>", cache);
    if (cache) {
      setStore(cache);
    }
  }, []);

  return (
    <NextUIProvider>
      <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: '#282828',
          color: '#fff',
        },
      }}/>
      <StoreContext.Provider value={{ store, setStore }}>
        <main className="dark text-foreground bg-background">
          <Component {...pageProps} />
        </main>
      </StoreContext.Provider>
    </NextUIProvider>
  );
}

export default MyApp;
