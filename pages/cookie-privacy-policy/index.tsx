import React, { Fragment } from 'react'
import NavbarProvider from '../../components/Navbar/NavbarProvider'
import { BodyContainer } from '../../components/Layout/Layout'
import { PRIVACY_POLICY } from './../../graphql/queries/privacypolicy'
import DynamicContent, { DynamicContentProps } from './../../components/DynamicContent/DynamicContent'
import { Seo } from './../../graphql/schema'
import { FunctionComponent } from 'react'
import { NextPageContext } from 'next'
import AquaClient from '../../graphql/aquaClient'
import Head from 'next/head'
import CustomBreadcrumbs from '../../components/Breadcrumbs/CustomBreadcrumbs'
import { getCanonicalPath } from '../../utils/Utils'

interface Props extends DynamicContentProps {
    seo: Seo
}

const index: FunctionComponent<Props> = ({ seo, content }) => {
    return (
        <Fragment>
            <Head>
                <title>{seo.seoTitle}</title>
                <meta
                    name="description"
                    content={seo.seoDescription}>
                </meta>
                <meta httpEquiv="content-language" content="it-IT"></meta>
            </Head>

            <NavbarProvider currentPage='/privacy-policy' countryCode={''}>
                <BodyContainer>
                    <div style={{ padding: '1rem' }}>
                        <CustomBreadcrumbs style={{ marginBottom: '2rem' }} from='privacy-policy' name='Privacy Policy' />
                        <DynamicContent content={content} />
                    </div>
                </BodyContainer>
            </NavbarProvider>
        </Fragment >
    )
}

export async function getServerSideProps(context: NextPageContext) {

    const aquaClient = new AquaClient()

    const privacyPageResponse = await aquaClient.query({
        query: PRIVACY_POLICY,
        variables: {}
    })

    return {
        props: {
            seo: privacyPageResponse.data.data.cookiePolicy.seo,
            content: privacyPageResponse.data.data.cookiePolicy.content
        }
    }
}

export default index
