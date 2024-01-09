import { useEffect, useState } from "react";
import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { StoreContext } from "../contexts";
import fclConfig from "../utils/config";
import { load } from "../account";
import { Toaster, toast } from "sonner";

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
        richColors
        position="top-center"
        toastOptions={{
          style: {
            background: '#18181b',
            borderColor: "#3f3f46",
            color: '#d1d5db'
          },
          className: 'class',
        }}
      />
      <StoreContext.Provider value={{ store, setStore }}>
        <main className="dark text-foreground bg-background">
          <Component {...pageProps} />
        </main>
      </StoreContext.Provider>
    </NextUIProvider>
  );
}

export default MyApp;
