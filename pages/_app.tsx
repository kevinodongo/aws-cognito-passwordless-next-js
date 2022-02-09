import '../styles/globals.css'
import type { AppProps } from 'next/app'

// intialize amplify
import { Amplify } from "aws-amplify";
Amplify.configure({
  Auth: {
    region: process.env.NEXT_COGNITO_REGION,
    userPoolId: process.env.NEXT_USERPOOL_ID,
    userPoolWebClientId: process.env.NEXT_USERPOOLWEBCLIENT_ID
  }, ssr: true
});

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
