import { useEffect, useState } from 'react';
import '../styles/globals.css'
import {NextUIProvider} from '@nextui-org/react'
import { StoreContext } from '../contexts'

function MyApp({ Component, pageProps }) {
  const [store, setStore] = useState({network: process.env.network})

  useEffect(() => {
    const cache = window.localStorage.getItem('store')
    console.log("cache ==>", cache, JSON.parse(cache))
    if (cache) {
      setStore(JSON.parse(cache))
    }
  }, [])

  return (
    <NextUIProvider>
      <StoreContext.Provider value={{store, setStore}}>
      <main className="dark text-foreground bg-background">
        <Component {...pageProps} />
      </main>
      </StoreContext.Provider>
    </NextUIProvider>
  )
}

export default MyApp;
