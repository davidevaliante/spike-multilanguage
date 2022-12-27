import React, { Fragment, useState, useEffect, useContext } from 'react'
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
import { getCanonicalPath, getUserCountryCode } from '../../utils/Utils'
import FullPageLoader from '../../components/Layout/FullPageLoader'
import { LocaleContext } from '../../context/LocaleContext'
import { HOME } from '../../graphql/queries/home'
import axios from 'axios'

interface Props extends DynamicContentProps {
    seo: Seo
}

const index: FunctionComponent<Props> = ({ content }) => {
    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getGeoData()
    }, [])

    const getGeoData = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        setUserCountry(geoLocatedCountryCode)

        if (geoLocatedCountryCode !== 'it') setContextCountry('row')
        else setContextCountry('it')
        setLoading(false)
    }

    return (
        <Fragment>
            <Head>
                <title>Contacts</title>
                <meta
                    name='description'
                    content={`Contatta SPIKE tramite mail oppure tramite i canali social più utilizzati`}
                ></meta>

                <link rel='canonical' href={`https://spikeslotgratis.com/contatti`} />
            </Head>
            <NavbarProvider currentPage='/contacts' countryCode={contextCountry}>
                <BodyContainer>
                    <div style={{ padding: '1rem', width: '100%' }}>
                        <CustomBreadcrumbs style={{ marginBottom: '2rem' }} from='contacts' name={t('Contacts')} />
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
        variables: {},
    })

    return {
        props: {
            seo: aboutPageResponse.data.data.contact.seo,
            content: aboutPageResponse.data.data.contact.content,
        },
    }
}

export default index
