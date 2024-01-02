import { useState } from 'react';
import '../styles/globals.css'
import {NextUIProvider} from '@nextui-org/react'
import { StoreContext } from '../contexts'

function MyApp({ Component, pageProps }) {
  const [store, setStore] = useState({})

  return (
    <NextUIProvider>
      <StoreContext.Provider value={{store, setStore}}>
      <main className="dark text-foreground bg-transparent">
        <Component {...pageProps} />
      </main>
      </StoreContext.Provider>
    </NextUIProvider>
  )
}

export default MyApp;
