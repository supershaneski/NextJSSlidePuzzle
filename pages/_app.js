import App from 'next/app';
import Head from 'next/head';
import '../style/app.css';

export default function MyApp({ Component, pageProps }) {
    const siteTitle = process.env.siteTitle;
    return (
        <>
        <Head>
            <title>{ siteTitle }</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <main>
            <Component { ...pageProps } />
        </main>
        <style jsx>
            {`
            main {
                position: absolute;
                left: 0px;
                top: 0px;
                width: 100%;
                height: 100%;
            }
            `}
        </style>
        </>
    )
}

MyApp.getInitialProps = async (appContext) => {
    // get pageprops
    const appProps = await App.getInitialProps(appContext);
    return {
        ...appProps
    }
}