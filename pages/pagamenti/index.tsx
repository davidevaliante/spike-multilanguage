import React, { FunctionComponent, Fragment } from 'react'
import NavbarProvider from '../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn, RightColumn } from '../../components/Layout/Layout'
import AquaClient from '../../graphql/aquaClient'
import { PAYMENT_METHOD_GENERAL_PAGE_BY_COUNTRY } from './../../graphql/queries/singles'
import { Seo, Bonus } from '../../graphql/schema'
import DynamicContent, { DynamicArticle, DynamicBonusList, DynamicSlotList, DynamicVideo } from '../../components/DynamicContent/DynamicContent'
import { HOME_BONUS_LIST } from '../../graphql/queries/bonus'
import ApolloBonusCardRevealComponent from '../../components/Cards/BonusCardReveal'
import Head from 'next/head'
import { ApolloBonusCardReveal } from '../../data/models/Bonus'
import { getCanonicalPath } from '../../utils/Utils'

interface Props {
    pageData: {
        seo: Seo,
        content: (DynamicArticle | DynamicBonusList | DynamicSlotList | DynamicVideo)[]
    },
    countryCode:string,
    sideBonuses: Bonus[]
}

const GeneralPaymentPage: FunctionComponent<Props> = ({ pageData, sideBonuses,countryCode }) => {

    return (
        <Fragment>
            <Head>
                <title>{pageData.seo.seoTitle}</title>
                <link rel="canonical" href={getCanonicalPath()} />

                <meta
                    name="description"
                    content={pageData.seo.seoDescription}>
                </meta>
                <meta httpEquiv="content-language" content="it-IT"></meta>
            </Head>

            <NavbarProvider currentPage='/payment-general' countryCode={countryCode}>
                <BodyContainer>
                    <MainColumn>
                        <div style={{ padding: '1rem' }}>
                            <DynamicContent content={pageData.content} />
                        </div>

                    </MainColumn>

                    <RightColumn>
                        <div style={{ top: '0' }} className='bonus-column-container'>
                            {sideBonuses && sideBonuses.map(bo => <ApolloBonusCardRevealComponent key={bo.name} bonus={bo as ApolloBonusCardReveal} />)}
                        </div>
                    </RightColumn>

                </BodyContainer>
            </NavbarProvider>
        </Fragment>
    )
}

export async function getServerSideProps({ query }) {

    const publicIp = require('public-ip')

    let ip: any
    ip = await publicIp.v4()

    const res = await fetch('http://ip-api.com/json/' + ip)
    
    const country: any = await res.json()

    const countryCode = country.countryCode.toLowerCase()

    const aquaClient = new AquaClient()
 
    const pageResponse = await aquaClient.query({
        query: PAYMENT_METHOD_GENERAL_PAGE_BY_COUNTRY,
        variables: {
            countryCode: countryCode
        }
    })

    let data1:any
    if (pageResponse.data.data.paymentGenerals[0] == undefined) {
        data1 = await aquaClient.query({
        query: PAYMENT_METHOD_GENERAL_PAGE_BY_COUNTRY,
        variables: {
            countryCode: 'row'
        }
    }) }

    const homeBonuses = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: countryCode
        }
    })

    let data2:any
    if (pageResponse.data.data.paymentGenerals[0] == undefined) {
        data2 = await aquaClient.query({
            query: HOME_BONUS_LIST,
            variables: {
                countryCode: 'row'
            }
    })}

    return {
        props: {
            pageData: pageResponse.data.data.paymentGenerals[0]?pageResponse.data.data.paymentGenerals[0]:data1.data.paymentGenerals[0],
            sideBonuses: homeBonuses.data.data.homes[0].bonuses?homeBonuses.data.data.homes[0].bonuses:data2.data.homes[0].bonuses,
            countryCode:countryCode
        }
    }
}

export default GeneralPaymentPage
