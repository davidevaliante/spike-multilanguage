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

       
        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: App => props =>
                        styledComponentSheet.collectStyles(
                            materialUiSheets.collect(<App {...props} />),
                        ),
                })
            const initialProps = await NextDocument.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: [
                    <React.Fragment key="styles">
                        {initialProps.styles}
                        {materialUiSheets.getStyleElement()}
                        {styledComponentSheet.getStyleElement()}
                    </React.Fragment>,
                ],
            }
        } finally {
            styledComponentSheet.seal()
        }
    }

    render() {
        return (
            <Html lang="it">
                <Head>
                    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@900&family=Raleway:wght@500&display=swap" rel="stylesheet" />
                    <meta name="google-site-verification" content="UmP-j4RgASnaCO-_OIXFoGoNb1M9xd8a22uMn4T2JiI" />
                    <link rel="shortcut icon" href="/icons/favicon.ico" />
                    <meta name="theme-color" content={`${appTheme.colors.primaryDark}`} />
                    <meta name="trustpilot-one-time-domain-verification-id" content="cf1b3477-d2d7-4301-8bb2-ac990e9d75de"/>
                    <meta name='dmca-site-verification' content='Zm11U3BIcnlVMlNEcUo4SjVESEsrSS9FcUVwb0RzNVV2M3NwSDM1eFdNVT01' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}