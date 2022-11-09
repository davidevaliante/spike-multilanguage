import React, { FunctionComponent, useEffect, useState } from 'react'
import { Seo } from '../../../graphql/schema'
import AquaClient from '../../../graphql/aquaClient'
import { BONUS_PAGE_BY_COUNTRY } from '../../../graphql/queries/bonuspage'
import {
    getCanonicalPath,
    getUserCountryCode,
    injectCDN,
    getBonusPageRedirectUrlForCountry,
} from '...//../../utils/Utils'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn, RightColumn } from '../../../components/Layout/Layout'
import {
    DynamicArticle,
    DynamicBonusList,
    DynamicSlotList,
    DynamicVideo,
} from '../../../components/DynamicContent/DynamicContent'
import DynamicContent from './../../../components/DynamicContent/DynamicContent'
import Head from 'next/head'
import { LocaleContext } from './../../../context/LocaleContext'
import { useContext } from 'react'
import FullPageLoader from '../../../components/Layout/FullPageLoader'
import { isShallow } from './../../../utils/Utils'
import { useRouter } from 'next/router'
import CountryEquivalentPageSnackbar from '../../../components/Snackbars/CountryEquivalentPageSnackbar'
import { HOME_BONUS_LIST } from '../../../graphql/queries/bonus'
import { ApolloBonusCardReveal } from '../../../data/models/Bonus'
import ApolloBonusCardRevealComponent from '../../../components/Cards/BonusCardReveal'
import BlockingOverlay from '../../../components/Ui/BlockingOverlay'

interface BonusPage {
    seo: Seo
    content: (DynamicArticle | DynamicBonusList | DynamicSlotList | DynamicVideo)[]
}

interface Props {
    _shallow: boolean
    _bonusPage: BonusPage
    _requestedCountryCode: string
    _bonusList: { bonus: ApolloBonusCardReveal }[]
}

const automaticRedirect = false

const BestBonus: FunctionComponent<Props> = ({ _bonusPage, _requestedCountryCode, _bonusList }) => {
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)
    const router = useRouter()
    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    useEffect(() => {
        console.log(contextCountry, userCountry, 'contextCountry, userCountry')
    }, [contextCountry, userCountry])

    const [loading, setLoading] = useState(true)
    const [bonusPage, setBonusPage] = useState<BonusPage>(_bonusPage)
    const [bonusList, setBonusList] = useState(_bonusList)
    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)

    useEffect(() => {
        getCountryData()
    }, [])

    const getCountryData = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        setUserCountry(geoLocatedCountryCode)

        if (geoLocatedCountryCode !== _requestedCountryCode) {
            const data = await aquaClient.query({
                query: BONUS_PAGE_BY_COUNTRY,
                variables: { countryCode: geoLocatedCountryCode },
            })

            if (data.data.data.bonusPages[0] !== undefined) {
                if (automaticRedirect) {
                    router.push(getBonusPageRedirectUrlForCountry(geoLocatedCountryCode))
                    return
                } else setUserCountryEquivalentExists(true)
            }
            setContextCountry(_requestedCountryCode)
        }
        setLoading(false)
    }

    return (
        <NavbarProvider currentPage='/migliori-bonus-casino' countryCode={contextCountry}>
            <Head>
                <title>{t('Best Casino Bonuses |  SPIKE')}</title>
                <link rel='canonical' href={getCanonicalPath()} />
                <meta
                    name='description'
                    content='La classifica di SPIKE sui migliori bonus dei Casinò Online italiani'
                ></meta>

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp='name' content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
                <meta
                    itemProp='description'
                    content='La classifica di SPIKE sui migliori bonus dei Casinò Online italiani'
                />
                <meta itemProp='image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta
                    name='twitter:title'
                    content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                />
                <meta
                    name='twitter:description'
                    content='La classifica di SPIKE sui migliori bonus dei Casinò Online italiani'
                />
                <meta name='twitter:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property='og:locale' content={contextCountry} />
                <meta property='og:type' content='article' />
                <meta
                    property='og:description'
                    content='La classifica di SPIKE sui migliori bonus dei Casinò Online italiani'
                />
                <meta
                    property='og:site_name'
                    content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                />
            </Head>

            <BodyContainer>
                <BlockingOverlay
                    redirectLink={getBonusPageRedirectUrlForCountry(userCountry)}
                    userCountry={userCountry}
                />
                {userCountryEquivalentExists && (
                    <CountryEquivalentPageSnackbar path={getBonusPageRedirectUrlForCountry(userCountry)} />
                )}
                <MainColumn>
                    <div style={{ padding: '1rem' }}>
                        <DynamicContent content={bonusPage?.content} />
                    </div>
                </MainColumn>

                <RightColumn>
                    <h1 className='bonus-header'>{t('The best welcome bonuses')}</h1>
                    <div style={{ top: '2rem' }} className='bonus-column-container'>
                        {bonusList &&
                            bonusList.map((bo) => (
                                <ApolloBonusCardRevealComponent key={bo.bonus.name} bonus={bo.bonus} />
                            ))}
                    </div>
                </RightColumn>
            </BodyContainer>
        </NavbarProvider>
    )
}

export async function getServerSideProps({ query, req, res }) {
    const shallow = req.query.shallow as boolean
    const country = query.countryCode as string
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const data = await aquaClient.query({
        query: BONUS_PAGE_BY_COUNTRY,
        variables: { countryCode: country },
    })

    let data1: any
    if (data.data.data.bonusPages[0] == undefined) {
        data1 = await aquaClient.query({
            query: BONUS_PAGE_BY_COUNTRY,
            variables: { countryCode: 'row' },
        })
    }

    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: country,
        },
    })

    return {
        props: {
            _bonusPage: data.data.data.bonusPages[0] ? data.data.data.bonusPages[0] : data1.data.data.bonusPages[0],
            _bonusList: bonusListResponse.data.data.homes[0]?.bonuses.bonus,
            _requestedCountryCode: country,
        },
    }
}

export default BestBonus
