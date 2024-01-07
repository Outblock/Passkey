import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html className="bg-black dark-them" style={{colorScheme: "dark-theme"}} lang="en">
        <Head>
        <meta name="description" content="The next generation wallet on flow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}