import React, { FunctionComponent, useEffect, useState } from 'react'
import { Seo } from '../../../graphql/schema'
import { NextPageContext } from 'next'
import AquaClient from '../../../graphql/aquaClient'
import { BONUS_PAGE_BY_COUNTRY } from '../../../graphql/queries/bonuspage'
import ArticleToMarkdown from '../../../components/Markdown/ArticleToMarkdown'
import { getCanonicalPath, getUserCountryCode, injectCDN } from '...//../../utils/Utils'
import PrimaryBonusCard from '../../../components/Cards/PrimaryBonusCard'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn } from '../../../components/Layout/Layout'
import { DynamicArticle, DynamicBonusList, DynamicSlotList, DynamicVideo } from '../../../components/DynamicContent/DynamicContent'
import DynamicContent from './../../../components/DynamicContent/DynamicContent'
import Head from 'next/head'
import fetch from 'cross-fetch'
import { LocaleContext } from './../../../context/LocaleContext';
import { useContext } from 'react'
import FullPageLoader from '../../../components/Layout/FullPageLoader'
import { isShallow } from './../../../utils/Utils';


interface BonusPage {
    seo: Seo
    content: (DynamicArticle | DynamicBonusList | DynamicSlotList | DynamicVideo)[]
}

interface Props {
    _shallow : boolean
    _bonusPage: BonusPage,
    _countryCode:string
}

const BestBonus: FunctionComponent<Props> = ({ _shallow, _bonusPage,_countryCode }) => {
    console.log(_bonusPage, _countryCode)
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const [loading, setLoading] = useState(true)
    const {t, contextCountry, setContextCountry} = useContext(LocaleContext)
    const [bonusPage, setBonusPage] = useState<BonusPage>(_bonusPage)

    useEffect(() => {
        getCountryData()
    }, [])

    const getCountryData = async () => {
        const userCountryCode = await getUserCountryCode()
        if(userCountryCode !== _countryCode && _countryCode !== 'row'){
            const data = await aquaClient.query({
                query: BONUS_PAGE_BY_COUNTRY,
                variables: { countryCode: userCountryCode }
            })
        
            let data1:any
            if (data.data.data.bonusPages[0] == undefined) {
                data1 = await aquaClient.query({
                    query: BONUS_PAGE_BY_COUNTRY,
                    variables: { countryCode: 'row'}
                    })  
                setContextCountry('row')
            }

            const d = data.data.data.bonusPages[0]? data.data.data.bonusPages[0] : data1.data.data.bonusPages[0]
            setBonusPage(d)
            setLoading(false)
        } else {
            setContextCountry(_countryCode)
            setLoading(false)
        }
    }

    if(loading) return <FullPageLoader />
    return (
        <NavbarProvider currentPage='/migliori-bonus-casino' countryCode={contextCountry}>
            <Head>
                <title>{t("Best Casino Bonuses |  SPIKE")}</title>
                <link rel="canonical" href={getCanonicalPath()} />
                <meta
                    name="description"
                    content="La classifica di SPIKE sui migliori bonus dei Casinò Online italiani">
                </meta>
                <meta property="og:image" content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property="og:locale" content={contextCountry} />
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

export async function getServerSideProps({query, req, res}) {

    const shallow = req.query.shallow as boolean
    const country = query.countryCode as string
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const data = await aquaClient.query({
        query: BONUS_PAGE_BY_COUNTRY,
        variables: { countryCode: country }
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
            _shallow : isShallow(country, shallow),
            _bonusPage: data.data.data.bonusPages[0]? data.data.data.bonusPages[0] : data1.data.data.bonusPages[0],
            _countryCode:country
        }
    }
}

export default BestBonus
