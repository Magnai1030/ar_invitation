import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="h-full">
        <Head>
          {/* Google fonts for the script title */}
          <link rel="preconnect" href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;600;800&display=swap"/>
        </Head>
        <body className="h-full text-white/90 bg-aurora animate-glow antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
