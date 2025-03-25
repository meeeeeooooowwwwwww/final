import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ClientSearchProvider } from '../context/SearchContext'

// Google Analytics measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

// Site URL for meta tags
const SITE_URL = 'https://test.nataliegwinters.com'

export default function App({ Component, pageProps }: AppProps) {
  // Check if this is an error page
  const isErrorPage = Component.name === 'Error' || pageProps.statusCode

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#007bff" />
        <meta name="description" content="Search for videos, articles, and businesses on GetIt" />
        <meta name="keywords" content="video search, article search, business directory, content aggregator" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://test.nataliegwinters.com/" />
        <meta property="og:title" content="GetIt - Rumble Video Search" />
        <meta property="og:description" content="Search across videos, articles, and business listings in one place" />
        <meta property="og:image" content="https://test.nataliegwinters.com/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://test.nataliegwinters.com/" />
        <meta name="twitter:title" content="GetIt - Rumble Video Search" />
        <meta name="twitter:description" content="Search across videos, articles, and business listings in one place" />
        <meta name="twitter:image" content="https://test.nataliegwinters.com/og-image.jpg" />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <title>GetIt - Rumble Video Search</title>
      </Head>

      {/* Google Analytics Script */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {isErrorPage ? (
        <Component {...pageProps} />
      ) : (
        <ErrorBoundary>
          <ClientSearchProvider>
            <Component {...pageProps} />
          </ClientSearchProvider>
        </ErrorBoundary>
      )}
    </>
  )
} 