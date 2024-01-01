import '../styles/globals.css'
import {NextUIProvider} from '@nextui-org/react'

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <main className="dark text-foreground bg-transparent">
        <Component {...pageProps} />
      </main>
    </NextUIProvider>
  )
}

export default MyApp;
