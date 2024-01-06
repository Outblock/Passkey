import { useEffect, useState } from 'react';
import '../styles/globals.css'
import { NextUIProvider } from '@nextui-org/react'
import { StoreContext } from '../contexts'

function MyApp({ Component, pageProps }) {
  const [store, setStore] = useState({network: process.env.network})

  useEffect(() => {
    console.log("cache 11 ==>")
    const cache = window.localStorage.getItem('store')
    const object = JSON.parse(cache)
    console.log("cache ==>", object)
    if (cache) {
      setStore(object)
    }

    if (window.localStorage.getItem('enableBiometric') == null) {
      window.localStorage.setItem('enableBiometric', true)
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
