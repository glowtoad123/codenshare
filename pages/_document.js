import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head />
            <title>Projare</title>
            <link rel="manifest" href="manifest.json" />
            <meta name="msvalidate.01" content="B913091A1850ED2E837CF410DA656F3D" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="application-name" content="Projare" />
            <meta name="apple-mobile-web-app-title" content="Projare" />
            <meta name="theme-color" content="#2f3e46" />
            <meta name="msapplication-navbutton-color" content="#2f3e46" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="msapplication-starturl" content="/" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="keywords" content="projare.site, projare, projects, code,"></meta>
            <link rel="icon"  sizes="512x512" href="/projareexp512.png" />
            <link rel="apple-touch-icon"  sizes="512x512" href="/projareexp.png" />
            <link rel="icon"  sizes="144x144" href="/projareexp.svg" />
            <link rel="apple-touch-icon"  sizes="144x144" href="/projareexp.svg" />
            <link rel="icon"  sizes="192x192" href="/projareexp.png" />
            <link rel="apple-touch-icon"  sizes="192x192" href="/projareexp.svg" />
            <noscript>Sorry but you must have javascript to use Projare</noscript>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument