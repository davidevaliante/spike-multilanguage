import React, { Fragment } from 'react'
import AquaClient from '../../graphql/aquaClient'
import { NextPageContext } from 'next'
import { CONTACTS } from './../../graphql/queries/contacts'
import DynamicContent, { DynamicContentProps } from './../../components/DynamicContent/DynamicContent'
import { Seo } from './../../graphql/schema'
import { FunctionComponent } from 'react'
import NavbarProvider from '../../components/Navbar/NavbarProvider'
import { BodyContainer } from '../../components/Layout/Layout'
import CustomBreadcrumbs from '../../components/Breadcrumbs/CustomBreadcrumbs'
import MailForm from '../../components/MailForm/MailForm'
import Head from 'next/head'
import { getCanonicalPath } from '../../utils/Utils'


interface Props extends DynamicContentProps {
    seo: Seo
}

const index: FunctionComponent<Props> = ({  content }) => {
    
    return (
        <Fragment>
            <Head>
                <link rel="canonical" href={getCanonicalPath()} />
            </Head>
            <NavbarProvider currentPage='/contacts' countryCode={''}>
            <BodyContainer>
                <div style={{ padding: '1rem', width: '100%' }}>
                    <CustomBreadcrumbs style={{ marginBottom: '2rem' }} from='contacts' name='Contatti' />
                    {content !== null && <DynamicContent content={content} />}
                    <MailForm />
                </div>
            </BodyContainer>
        </NavbarProvider>
        </Fragment>
      
    )
}

export async function getServerSideProps(context: NextPageContext) {

    const aquaClient = new AquaClient()

    const aboutPageResponse = await aquaClient.query({
        query: CONTACTS,
        variables: {}
    })

    return {
        props: {
            seo: aboutPageResponse.data.data.contact.seo,
            content: aboutPageResponse.data.data.contact.content
        }
    }
}

export default index
