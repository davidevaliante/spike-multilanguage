import React, { FunctionComponent } from 'react'
import { Seo } from '../../graphql/schema'
import { NextPageContext } from 'next'
import AquaClient from '../../graphql/aquaClient'
import { BONUS_PAGE_BY_COUNTRY } from '../../graphql/queries/bonuspage'
import ArticleToMarkdown from '../../components/Markdown/ArticleToMarkdown'
import { getCanonicalPath, injectCDN } from './../../utils/Utils'
import PrimaryBonusCard from '../../components/Cards/PrimaryBonusCard'
import NavbarProvider from '../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn } from '../../components/Layout/Layout'
import { DynamicArticle, DynamicBonusList, DynamicSlotList, DynamicVideo } from '../../components/DynamicContent/DynamicContent'
import DynamicContent from './../../components/DynamicContent/DynamicContent'
import Head from 'next/head'
import fetch from 'cross-fetch'
import {useTranslation} from 'react-i18next'


interface BonusPage {
    seo: Seo
    content: (DynamicArticle | DynamicBonusList | DynamicSlotList | DynamicVideo)[]
}

interface Props {
    bonusPage: BonusPage,
    countryCode:string
}

const MiglioriBonus: FunctionComponent<Props> = ({ bonusPage,countryCode }) => {

    const {t} = useTranslation()

    return (
        <NavbarProvider currentPage='/migliori-bonus-casino' countryCode={countryCode}>
            <Head>
                <title>{t("Best Casino Bonuses |  SPIKE")}</title>
                <link rel="canonical" href={getCanonicalPath()} />

                <meta
                    name="description"
                    content="La classifica di SPIKE sui migliori bonus dei Casinò Online italiani">
                </meta>
                <meta property="og:image" content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property="og:locale" content={'it'} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content="La classifica di SPIKE sui migliori bonus dei Casinò Online italiani" />
                <meta property="og:site_name" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
            </Head>

            <BodyContainer>
                <MainColumn>
                    <div style={{ padding: '1rem' }}>
                        <DynamicContent content={bonusPage?.content} />
                    </div>
                </MainColumn>
            </BodyContainer>
        </NavbarProvider>
    )
}

export async function getServerSideProps(context: NextPageContext) {

    const publicIp = require('public-ip');

    let ip: any
    ip = await publicIp.v4()

    const res = await fetch('http://ip-api.com/json/' + ip)

    const country: any = await res.json()
    const countryCode = country.countryCode.toLowerCase()
    
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const data = await aquaClient.query({
        query: BONUS_PAGE_BY_COUNTRY,
        variables: { countryCode: countryCode }
    })

    let data1:any
    if (data.data.data.bonusPages[0] == undefined) {
        data1 = await aquaClient.query({
        query: BONUS_PAGE_BY_COUNTRY,
        variables: { countryCode: 'row'}
    })  
    }

    return {
        props: {
            bonusPage: data.data.data.bonusPages[0]? data.data.data.bonusPages[0] : data1.data.data.bonusPages[0],
            countryCode:countryCode
        }
    }
}

export default MiglioriBonus
