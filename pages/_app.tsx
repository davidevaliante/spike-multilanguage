import App from 'next/app'
import React, { FunctionComponent, Fragment } from 'react'
import { ThemeProvider } from 'styled-components'
import { styledTheme, GlobalStyle } from '../theme/theme'
import { Reset } from 'styled-reset'
import Head from 'next/head'
import { ThemeProvider as MaterialThemeProvider } from '@material-ui/core/styles'
import { materialTheme } from './../theme/theme'
import 'react-multi-carousel/lib/styles.css'
import 'video.js/dist/video-js.css'
import { cookieContext } from '../context/CookieContext'
import { useMyCookies } from '../hooks/useMyCookies'
import { LocaleContextProvider } from '../context/LocaleContext'
import NextNProgress from 'nextjs-progressbar'

// added next progress
const ContextProvider: FunctionComponent = ({ children }) => {
    const cookieAcceptedStatus = useMyCookies()

    return (
        <Fragment>
            <LocaleContextProvider>
                <cookieContext.Provider value={cookieAcceptedStatus}>{children}</cookieContext.Provider>
            </LocaleContextProvider>
        </Fragment>
    )
}

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props
        return (
            <ContextProvider>
                <MaterialThemeProvider theme={materialTheme}>
                    <ThemeProvider theme={styledTheme}>
                        <Head>
                            {/*    <script async src='https://www.googletagmanager.com/gtag/js?id=G-VW9JVLDQEM' /> */}
                            {/*     <script type='text/javascript' src='https://cdn.ywxi.net/js/1.js' async></script> */}
                            {/**/}
                            {/*     <script */}
                            {/*         dangerouslySetInnerHTML={{ */}
                            {/*             __html: ` */}
                            {/*     (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': */}
                            {/*     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], */}
                            {/*     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= */}
                            {/*     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); */}
                            {/*     })(window,document,'script','dataLayer','GTM-M729KQK'); */}
                            {/* `, */}
                            {/*         }} */}
                            {/*     /> */}

                            {/*     <script */}
                            {/*         dangerouslySetInnerHTML={{ */}
                            {/*             __html: ` */}
                            {/*     (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': */}
                            {/*     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], */}
                            {/*     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= */}
                            {/*     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); */}
                            {/*     })(window,document,'script','dataLayer','GTM-5FV2NFS'); */}
                            {/* `, */}
                            {/*         }} */}
                            {/*     /> */}
                            {/**/}
                            {/*     <script */}
                            {/*         dangerouslySetInnerHTML={{ */}
                            {/*             __html: ` */}
                            {/*             window.dataLayer = window.dataLayer || []; */}
                            {/*             function gtag(){dataLayer.push(arguments);} */}
                            {/*             gtag('js', new Date()); */}
                            {/*             gtag('config', 'G-VW9JVLDQEM'); */}
                            {/*         `, */}
                            {/*         }} */}
                            {/*     /> */}

                            <script async src='https://www.googletagmanager.com/gtag/js?id=G-DSMJL6Q2B3'></script>
                            <script
                                dangerouslySetInnerHTML={{
                                    __html: `window.dataLayer = window.dataLayer || [];
                                              function gtag(){dataLayer.push(arguments);}
                                              gtag('js', new Date());

                                              gtag('config', 'G-DSMJL6Q2B3');`,
                                }}
                            ></script>
                        </Head>
                        <Reset />
                        <NextNProgress />

                        <GlobalStyle />
                        <Component {...pageProps} />
                    </ThemeProvider>
                </MaterialThemeProvider>
            </ContextProvider>
        )
    }
}

export default MyApp
