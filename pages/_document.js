import React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components'
import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/core/styles'
import { appTheme } from './../theme/theme'

export default class Document extends NextDocument {
    static async getInitialProps(ctx) {
        const styledComponentSheet = new StyledComponentSheets()
        const materialUiSheets = new MaterialUiServerStyleSheets()
        const originalRenderPage = ctx.renderPage

        let lang

        if (ctx.req && ctx.req.path) {
            const path = ctx.req.path
            const pathElements = path.split('/')

            if (pathElements.length == 2 && pathElements[0] === '' && pathElements[1] === '') lang = 'it'
            else lang = pathElements[pathElements.length - 1] === 'row' ? 'en' : pathElements[pathElements.length - 1]

            if (lang === 'contatti') lang = 'it'
            if (lang === 'migliori-bonus-casino') lang = 'it'
            if (lang === '[countryCode]') lang = 'it'
        }

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        styledComponentSheet.collectStyles(materialUiSheets.collect(<App {...props} />)),
                })
            const initialProps = await NextDocument.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: [
                    <React.Fragment key='styles'>
                        {initialProps.styles}
                        {materialUiSheets.getStyleElement()}
                        {styledComponentSheet.getStyleElement()}
                    </React.Fragment>,
                ],
                lang,
            }
        } finally {
            styledComponentSheet.seal()
        }
    }

    render() {
        return (
            <Html lang={this.props.lang}>
                <Head>
                    <link href='https://fonts.googleapis.com/css2?family=Chango&display=swap' rel='stylesheet' />
                    <link
                        href='https://fonts.googleapis.com/css2?family=Raleway:wght@500&display=swap'
                        rel='stylesheet'
                    />
                    <link
                        href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap'
                        rel='stylesheet'
                    />
                    <meta name='google-site-verification' content='UmP-j4RgASnaCO-_OIXFoGoNb1M9xd8a22uMn4T2JiI' />
                    <meta name='p:domain_verify' content='a7b2e062354fa66c7fb685954f19b59c' />
                    <meta name='google-site-verification' content='_maV3qnMr5AqgbcA7gTfXevByYIF51pIOAz53I7fUT8' />

                    <meta name='google-site-verification' content='kU73ZYb-Ba00h5JjmFvafeGVULp8CliZ2iISLaqpZQU' />
                    <meta
                        name='ahrefs-site-verification'
                        content='2fd03c1d788b13e3dcc769b798f8a0e531d15bac894624a407318cf3d32ee33d'
                    />

                    {/* bing */}
                    <meta name='msvalidate.01' content='CE86F0A0304551BBC9E14834122107F6' />

                    <link rel='shortcut icon' href='/icons/favicon.ico' />
                    <meta name='theme-color' content={`${appTheme.colors.primaryDark}`} />
                    <meta
                        name='trustpilot-one-time-domain-verification-id'
                        content='cf1b3477-d2d7-4301-8bb2-ac990e9d75de'
                    />
                    <meta
                        name='dmca-site-verification'
                        content='Zm11U3BIcnlVMlNEcUo4SjVESEsrSS9FcUVwb0RzNVV2M3NwSDM1eFdNVT01'
                    />
                </Head>
                <body>
                    <noscript
                        dangerouslySetInnerHTML={{
                            __html: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M729KQK"
                height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
                        }}
                    ></noscript>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
