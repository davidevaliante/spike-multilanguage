import Head from 'next/head'
import React, { FunctionComponent, useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import LatestVideoCard from '../../components/Cards/LatestVideoCard'
import HomeHeader from '../../components/Home/HomeHeader'
import FullPageLoader from '../../components/Layout/FullPageLoader'
import { BodyContainer, MainColumn, RightColumn } from '../../components/Layout/Layout'
import ArticleToMarkdown from '../../components/Markdown/ArticleToMarkdown'
import NavbarProvider from '../../components/Navbar/NavbarProvider'
import { OnlyMobile } from '../../components/Responsive/Only'
import HighlightProducerSlideShow from '../../components/SlideShow/NovomaticHighlightProducerSlideShow'
import SlideShow from '../../components/SlideShow/SlideShow'
import { ApolloBonusCardReveal } from '../../data/models/Bonus'
import { ApolloSlotCard } from '../../data/models/Slot'
import AquaClient from '../../graphql/aquaClient'
import { HOME } from '../../graphql/queries/home'
import { Home } from '../../graphql/schema'
import { appTheme } from '../../theme/theme'
import {
    getUserCountryCode,
    isShallow,
    somethingIsUndefined,
    serverSideRedirect,
    buildContentLanguageString,
} from '../../utils/Utils'
import LazyLoad from 'react-lazyload'
import Icon from '../../components/Icons/Icon'
import BonusCardRevealComponent from '../../components/Cards/BonusCardReveal'
import { LocaleContext } from '../../context/LocaleContext'
import { useRouter } from 'next/router'
import CountryEquivalentPageSnackbar from '../../components/Snackbars/CountryEquivalentPageSnackbar'
import { GetStaticProps, GetStaticPaths } from 'next'
import Newsletter from '../../components/Newsletter/Newsletter'

interface PageProps {
    _shallow: boolean
    _home: Home
    _requestedCountryCode: string
}

const automaticRedirect = false

const Index: FunctionComponent<PageProps> = ({ _shallow, _home, _requestedCountryCode }) => {
    console.log('country code page')

    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)
    const router = useRouter()

    if (router.isFallback) return <FullPageLoader />

    const [loading, setLoading] = useState(true)
    const [home, setHome] = useState<Home>(_home)
    const [producerSlots, setProducerSlots] = useState<ApolloSlotCard[]>(_home.producerSlots.slot.map((s) => s.slot))
    const [onlineSlots, setOnlineSlots] = useState<ApolloSlotCard[]>(_home.onlineSlots.slot.map((s) => s.slot))
    const [barSlots, setBarSlots] = useState<ApolloSlotCard[]>(_home.barSlots?.slot.map((s) => s.slot))
    const [vltSlots, setVltSlots] = useState<ApolloSlotCard[]>(_home.vltSlots?.slot.map((s) => s.slot))
    const [bonusList, setBonusList] = useState<ApolloBonusCardReveal[]>(_home.bonuses.bonus.map((b) => b.bonus))

    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)

    console.log(_requestedCountryCode, 'requested country code')

    useEffect(() => {
        if (_shallow) {
            setContextCountry(_requestedCountryCode)
            setLoading(false)
        } else getCountryData()
    }, [])

    const getCountryData = async () => {
        const geolocatedCountryCode = await getUserCountryCode()
        setUserCountry(geolocatedCountryCode)

        if (_requestedCountryCode !== geolocatedCountryCode) {
            // user landed on a page that is different from his country
            const homeDataRequest = await aquaClient.query({
                query: HOME,
                variables: { countryCode: geolocatedCountryCode },
            })

            // we check if data for the user country exists
            if (homeDataRequest.data.data.homes[0]) {
                if (automaticRedirect) {
                    router.push(`/${geolocatedCountryCode}`)
                    return
                } else setUserCountryEquivalentExists(true)
            }
            setContextCountry(_requestedCountryCode)
        } else setContextCountry(_requestedCountryCode)

        if (_requestedCountryCode === '' || _requestedCountryCode === undefined) setContextCountry('it')

        setLoading(false)
    }

    return (
        <div>
            <Head>
                <title>{home.seo.seoTitle}</title>
                <link rel='canonical' href='https://spikeslotgratis.com' />
                <meta name='description' content={home.seo.seoDescription}></meta>
                <meta httpEquiv='content-language' content={buildContentLanguageString(contextCountry)}></meta>
                <link rel='canonical' href={`https://spikeslotgratis.com/${_requestedCountryCode}`} />

                <meta property='og:title' content={home.seo.seoTitle} />
                <meta property='og:url' content={`https://spikeslotgratis.com/${_requestedCountryCode}`} />
                <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property='og:locale' content={contextCountry} />
                <meta property='og:type' content='article' />
                <meta property='og:description' content={home.seo?.seoDescription} />
                <meta
                    property='og:site_name'
                    content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                />
            </Head>

            <NavbarProvider currentPage='Home' countryCode={contextCountry}>
                {home.topArticle && <HomeHeader topArticle={home.topArticle}>SPIKE SLOT</HomeHeader>}
                <BodyContainer>
                    {userCountryEquivalentExists && (
                        <CountryEquivalentPageSnackbar path={userCountry === 'it' ? '/' : `/${userCountry}`} />
                    )}
                    <MainColumn>
                        {producerSlots && <HighlightProducerSlideShow producerSlots={producerSlots} />}
                        <LazyLoad height={450} once>
                            <SlideShow
                                apolloSlotCards={onlineSlots.filter((s) => s.image !== undefined)}
                                title={'The Online Slots of the moment'}
                                icon='/icons/slot_online_icon.svg'
                                buttonText={'See the full list of Online Slots'}
                                buttonRoute={`/slots/[countryCode]`}
                                buttonRouteAs={`/slots/${contextCountry}`}
                                style={{ marginTop: '2rem' }}
                                mainColor={appTheme.colors.primary}
                                secondaryColor={appTheme.colors.primary}
                            />
                        </LazyLoad>

                        {barSlots && (
                            <LazyLoad height={450} once offset={100}>
                                <SlideShow
                                    apolloSlotCards={barSlots?.filter((s) => s.image !== undefined)}
                                    title='The most famous Bar Slots'
                                    icon='/icons/slot_bar_icon.svg'
                                    buttonText='See the full list of Bar Slots'
                                    buttonRoute={`/slot-bar/[countryCode]`}
                                    buttonRouteAs={`/slot-bar/${contextCountry}`}
                                    style={{ marginTop: '2rem' }}
                                    mainColor={appTheme.colors.secondary}
                                    secondaryColor={appTheme.colors.secondary}
                                />
                            </LazyLoad>
                        )}

                        {vltSlots && (
                            <LazyLoad height={450} once offset={100}>
                                <SlideShow
                                    apolloSlotCards={vltSlots?.filter((s) => s.image !== undefined)}
                                    title='The funniest VLT Slots'
                                    icon='/icons/slot_vlt_icon.svg'
                                    buttonText='See the full list of VLT Slots'
                                    buttonRoute={`/slot-vlt/[countryCode]`}
                                    buttonRouteAs={`/slot-vlt/${contextCountry}`}
                                    style={{ marginTop: '2rem' }}
                                    mainColor={appTheme.colors.terziary}
                                    secondaryColor={appTheme.colors.terziary}
                                />
                            </LazyLoad>
                        )}
                        <div style={{ padding: '0rem 1rem' }}>
                            {home.bottomArticle && <ArticleToMarkdown content={home.bottomArticle} />}
                        </div>
                    </MainColumn>

                    <RightColumn>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon width={56} height={56} source='/icons/flame_icon.svg' />
                            <h4 className='video-header'>{"Watch SPIKE's latest video"}</h4>
                        </div>

                        <LatestVideoCard />

                        <Newsletter />

                        <div style={{ top: '820px' }} className='bonus-column-container'>
                            {bonusList && bonusList.map((bo) => <BonusCardRevealComponent key={bo.name} bonus={bo} />)}
                        </div>
                    </RightColumn>

                    <OnlyMobile>
                        <Newsletter />
                    </OnlyMobile>
                </BodyContainer>
            </NavbarProvider>
        </div>
    )
}

export const getServerSideProps = async ({ params, res }) => {
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const requestedCountryCode = params?.countryCode

    // console.log(`REQUESTED COUNTRY CODE: ${requestedCountryCode}`)

    const data = await aquaClient.query({
        query: HOME,
        variables: { countryCode: requestedCountryCode },
    })

    console.log('hello world')

    if (requestedCountryCode === '') serverSideRedirect(res, '/', 301)
    if (somethingIsUndefined([data.data.data.homes[0]])) serverSideRedirect(res, `/row`)
    return {
        props: {
            _shallow: false,
            _home: data.data.data.homes[0] as Home,
            _requestedCountryCode: requestedCountryCode,
        },
    }
}

export default Index
