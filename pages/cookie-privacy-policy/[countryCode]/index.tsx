import React, { Fragment, useContext, useEffect, useState } from 'react'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'
import { BodyContainer } from '../../../components/Layout/Layout'
import { PRIVACY_POLICY } from '../../../graphql/queries/privacypolicy'
import DynamicContent, { DynamicContentProps } from '../../../components/DynamicContent/DynamicContent'
import { Seo } from '../../../graphql/schema'
import { FunctionComponent } from 'react'
import { NextPageContext, GetServerSideProps } from 'next'
import AquaClient from '../../../graphql/aquaClient'
import Head from 'next/head'
import CustomBreadcrumbs from '../../../components/Breadcrumbs/CustomBreadcrumbs'
import { getCanonicalPath, getUserCountryCode } from '../../../utils/Utils'
import { LocaleContext } from '../../../context/LocaleContext'
import { ABOUT_PAGE } from '../../../graphql/queries/about'
import FullPageLoader from '../../../components/Layout/FullPageLoader'

interface Props extends DynamicContentProps {
    seo: Seo
    content: any
    _requestedCountryCode: string
}

const index: FunctionComponent<Props> = ({ seo, content, _requestedCountryCode }) => {
    const [loading, setLoading] = useState(true)
    const { t, contextCountry, userCountry, setUserCountry, setContextCountry } = useContext(LocaleContext)

    useEffect(() => {
        setContextCountry(_requestedCountryCode)
        setLoading(false)
    }, [])

    return (
        <Fragment>
            <Head>
                <title>{seo.seoTitle}</title>
                <meta name='description' content={seo.seoDescription}></meta>
                <link
                    rel='canonical'
                    href={`https://spikeslotgratis.com/cookie-privacy-policy/${_requestedCountryCode}`}
                />
                <meta httpEquiv='content-language' content='it-IT'></meta>
            </Head>

            <NavbarProvider currentPage='/privacy-policy' countryCode={contextCountry}>
                <BodyContainer>
                    <div style={{ padding: '1rem' }}>
                        <CustomBreadcrumbs
                            style={{ marginBottom: '2rem' }}
                            from='privacy-policy'
                            name='Privacy Policy'
                        />
                        <DynamicContent content={content} />
                    </div>
                </BodyContainer>
            </NavbarProvider>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const aquaClient = new AquaClient()

    const { countryCode } = query

    const privacyPageResponse = await aquaClient.query({
        query: PRIVACY_POLICY,
        variables: {},
    })

    return {
        props: {
            seo: privacyPageResponse.data.data.cookiePolicy.seo,
            content: privacyPageResponse.data.data.cookiePolicy.content,
            _requestedCountryCode: countryCode,
        },
    }
}

export default index
