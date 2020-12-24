import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
            <title>Codenshare</title>
            <link rel="manifest" href="manifest.json" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="application-name" content="Codenshare" />
            <meta name="apple-mobile-web-app-title" content="Codenshare" />
            <meta name="theme-color" content="#2f3e46" />
            <meta name="msapplication-navbutton-color" content="#2f3e46" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="msapplication-starturl" content="/" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="Description" content="this is a project that allows users to share their projects, what they used to create their projects, and the status of their projects." />
            <link rel="icon"  sizes="512x512" href="/maskable_icon.png" />
            <link rel="apple-touch-icon"  sizes="512x512" href="/maskable_icon.png" />
            <link rel="icon"  sizes="144x144" href="/maskable_icon.png" />
            <link rel="apple-touch-icon"  sizes="144x144" href="/maskable_icon.png" />
            <link rel="icon"  sizes="192x192" href="/maskable_icon.png" />
            <link rel="apple-touch-icon"  sizes="192x192" href="/maskable_icon.png" />
            <link rel="stylesheet" href="./styles.css" />
            <noscript>Sorry but you must have javascript to use Codenshare</noscript>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument