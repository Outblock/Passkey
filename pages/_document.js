import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html className="bg-black dark-them" style={{colorScheme: "dark-theme"}} lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}