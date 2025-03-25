import { NextPage } from 'next'
import Head from 'next/head'

interface ErrorProps {
  statusCode?: number
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <>
      <Head>
        <title>Error {statusCode} - GetIt</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {statusCode
                ? `An error ${statusCode} occurred on server`
                : 'An error occurred on client'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please try again later or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error 