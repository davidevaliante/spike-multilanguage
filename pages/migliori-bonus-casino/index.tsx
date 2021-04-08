import React, { FunctionComponent, useContext, useState, useEffect } from 'react'
import { Seo } from '../../graphql/schema'
import { NextPageContext } from 'next'
import AquaClient from '../../graphql/aquaClient'
import { BONUS_PAGE_BY_COUNTRY } from '../../graphql/queries/bonuspage'
import { getCanonicalPath, getUserCountryCode, getBonusPageRedirectUrlForCountry } from './../../utils/Utils'
import NavbarProvider from '../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn, RightColumn } from '../../components/Layout/Layout'
import { DynamicArticle, DynamicBonusList, DynamicSlotList, DynamicVideo } from '../../components/DynamicContent/DynamicContent'
import DynamicContent from './../../components/DynamicContent/DynamicContent'
import Head from 'next/head'
import fetch from 'cross-fetch'
import { useRouter } from 'next/router'
import { LocaleContext } from '../../context/LocaleContext'
import ApolloBonusCardRevealComponent from '../../components/Cards/BonusCardReveal'
import { ApolloBonusCardReveal } from '../../data/models/Bonus'
import { HOME_BONUS_LIST } from '../../graphql/queries/bonus'
import CountryEquivalentPageSnackbar from '../../components/Snackbars/CountryEquivalentPageSnackbar'


interface BonusPage {
    seo: Seo
    content: (DynamicArticle | DynamicBonusList | DynamicSlotList | DynamicVideo)[]
}

interface Props {
    _shallow : boolean
    _bonusPage: BonusPage,
    _requestedCountryCode:string
}

const automaticRedirect = false

const MiglioriBonus: FunctionComponent<Props> = ({ _shallow, _bonusPage,_requestedCountryCode }) => {

    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)
    const router = useRouter()
    const {t, contextCountry, setContextCountry, userCountry, setUserCountry} = useContext(LocaleContext)

    const [loading, setLoading] = useState(true)
    const [bonusPage, setBonusPage] = useState<BonusPage>(_bonusPage)
    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)



    useEffect(() => {
        if(_shallow){
            setContextCountry(_requestedCountryCode)
            setLoading(false)
        }
        else getCountryData()
    }, [])

    const getCountryData = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        setUserCountry(geoLocatedCountryCode)

        if(geoLocatedCountryCode !== _requestedCountryCode){
            const data = await aquaClient.query({
                query: BONUS_PAGE_BY_COUNTRY,
                variables: { countryCode: geoLocatedCountryCode }
            })

            if(data.data.data.bonusPages[0] !== undefined){
                if(automaticRedirect){
                    router.push(getBonusPageRedirectUrlForCountry(geoLocatedCountryCode))
                    return
                }
                else setUserCountryEquivalentExists(true)
            }
            setContextCountry(_requestedCountryCode)           
        }
        setLoading(false)
    }

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
                <meta property="og:locale" content={'it'} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content="La classifica di SPIKE sui migliori bonus dei Casinò Online italiani" />
                <meta property="og:site_name" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
            </Head>

            <BodyContainer>
                {userCountryEquivalentExists && <CountryEquivalentPageSnackbar path={getBonusPageRedirectUrlForCountry(userCountry)} />}

                    <div style={{ padding: '1rem', maxWidth : '1200px' }}>
                        <DynamicContent content={bonusPage?.content} />
                    </div>
            </BodyContainer>
        </NavbarProvider>
    )
}

export const getServerSideProps = async ({params}) => {
    
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const requestedCountryCode = 'it'


    const data = await aquaClient.query({
        query: BONUS_PAGE_BY_COUNTRY,
        variables: { countryCode: requestedCountryCode }
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
            _bonusPage: data.data.data.bonusPages[0]? data.data.data.bonusPages[0] : data1.data.data.bonusPages[0],
            _requestedCountryCode:requestedCountryCode,
            _shallow : false
        }
    }
}

export default MiglioriBonus
