import React, { FunctionComponent, useContext, useState, useEffect } from 'react'
import NavbarProvider from '../components/Navbar/NavbarProvider'
import HomeHeader from './../components/Home/HomeHeader'
import { appTheme } from './../theme/theme'
import LazyLoad from 'react-lazyload'
import Head from 'next/head'
import LatestVideoCard from '../components/Cards/LatestVideoCard'
import Icon from '../components/Icons/Icon'
import { Home } from './../graphql/schema'
import SlideShow from '../components/SlideShow/SlideShow'
import HighlightProducerSlideShow from '../components/SlideShow/HighlightProducerSlideShow'
import BonusCardRevealComponent from '../components/Cards/BonusCardReveal'
import AquaClient from './../graphql/aquaClient'
import { BodyContainer, MainColumn, RightColumn } from '../components/Layout/Layout'
import { HOME } from '../graphql/queries/home'
import ArticleToMarkdown from '../components/Markdown/ArticleToMarkdown'
import { OnlyMobile } from '../components/Responsive/Only'
import FullPageLoader from '../components/Layout/FullPageLoader'
import { ApolloSlotCard } from '../data/models/Slot'
import { ApolloBonusCardReveal } from '../data/models/Bonus'
import { getUserCountryCode } from '../utils/Utils'
import { useRouter } from 'next/router'
import { LocaleContext } from '../context/LocaleContext'
import Newsletter from '../components/Newsletter/Newsletter'
import CountryEquivalentPageSnackbar from '../components/Snackbars/CountryEquivalentPageSnackbar'
import { GetStaticPaths } from 'next'

interface PageProps {
    _shallow : boolean
    _home: Home
}

const automaticRedirect = false

const Index: FunctionComponent<PageProps> = ({ _shallow = false, _home }) => {
    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [home, setHome] = useState<Home>(_home)
    const [producerSlots, setProducerSlots] = useState<ApolloSlotCard[]>(_home.producerSlots.slot.map(s => s.slot))
    const [onlineSlots, setOnlineSlots] = useState<ApolloSlotCard[]>(_home.onlineSlots.slot.map(s => s.slot))
    const [barSlots, setBarSlots] = useState<ApolloSlotCard[]>(_home.barSlots.slot.map(s => s.slot))
    const [vltSlots, setVltSlots] = useState<ApolloSlotCard[]>(_home.vltSlots.slot.map(s => s.slot))
    const [bonusList, setBonusList] = useState<ApolloBonusCardReveal[]>(_home.bonuses.bonus.map(b => b.bonus))

    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)


    useEffect(() => {
        if(_shallow){
            setContextCountry('it')
            setLoading(false)
        }
        else getCountryData()
    }, [])

    const getCountryData = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        setUserCountry(geoLocatedCountryCode)

        if(geoLocatedCountryCode !== 'it'){
            const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)
            const homeData = await aquaClient.query({
                query: HOME,
                variables: { countryCode: geoLocatedCountryCode}
            })

            if(homeData.data.data.homes[0]){
                if(automaticRedirect) {
                    router.push(`/${geoLocatedCountryCode}`)
                    return
                } else {
                    setUserCountryEquivalentExists(true)
                    setContextCountry('it')
                }
            }
        } else {
            setContextCountry('it')
        }

        setLoading(false)
    }


    if(loading) return <FullPageLoader />
    return <div>
        <Head>
            <title>{home.seo.seoTitle}</title>
            <link rel="canonical" href="https://spikeslot.com" />
            <meta
                name="description"
                content={home.seo.seoDescription}>
            </meta>
            <meta httpEquiv="content-language" content="it-IT"></meta>
            <meta property="og:image" content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
            <meta property="og:locale" content={'it'} />
            <meta property="og:type" content="article" />
            <meta property="og:description" content={home.seo?.seoDescription} />
            <meta property="og:site_name" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
        </Head>

        <NavbarProvider currentPage='Home' countryCode={contextCountry}>
            {home.topArticle && <HomeHeader topArticle={home.topArticle}>SPIKE SLOT</HomeHeader>}
            <BodyContainer>
                {userCountryEquivalentExists && <CountryEquivalentPageSnackbar path={`/${userCountry}`} />}
                <MainColumn>
                    {producerSlots && <HighlightProducerSlideShow producerSlots={producerSlots} />}

                    <LazyLoad height={450} once>
                        <SlideShow
                            apolloSlotCards={onlineSlots.filter(s => s.image !== undefined)}
                            title={t('The Online Slots of the moment')}
                            icon='/icons/slot_online_icon.svg'
                            buttonText={t('See the full list of Online Slots')}
                            buttonRoute={`/slots/[countryCode]`}
                            buttonRouteAs={`/slots/${contextCountry}`}
                            style={{ marginTop: '2rem' }}
                            mainColor={appTheme.colors.primary}
                            secondaryColor={appTheme.colors.primary} />
                    </LazyLoad>

                    {barSlots && <LazyLoad height={450} once offset={100}>
                        <SlideShow
                            apolloSlotCards={barSlots?.filter(s => s.image !== undefined)}
                            title='The most famous Bar Slots'
                            icon='/icons/slot_bar_icon.svg'
                            buttonText='See the full list of Bar Slots'
                            buttonRoute={`/slot-bar/[countryCode]`}
                            buttonRouteAs={`/slot-bar/${contextCountry}`}
                            style={{ marginTop: '2rem' }}
                            mainColor={appTheme.colors.secondary}
                            secondaryColor={appTheme.colors.secondary} />
                    </LazyLoad>}

                    {vltSlots && <LazyLoad height={450} once offset={100}>
                        <SlideShow
                            apolloSlotCards={vltSlots?.filter(s => s.image !== undefined)}
                            title='The funniest VLT Slots'
                            icon='/icons/slot_vlt_icon.svg'
                            buttonText='See the full list of VLT Slots'
                            buttonRoute={`/slot-vlt/[countryCode]`}
                            buttonRouteAs={`/slot-vlt/${contextCountry}`}
                            style={{ marginTop: '2rem' }}
                            mainColor={appTheme.colors.terziary}
                            secondaryColor={appTheme.colors.terziary} />
                    </LazyLoad>}
                    <div style={{ padding: '0rem 1rem' }}>
                        {home.bottomArticle && <ArticleToMarkdown content={home.bottomArticle} />}
                    </div>
                </MainColumn>

                <RightColumn>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon
                            width={56}
                            height={56}
                            source='/icons/flame_icon.svg' />
                        <h1 className='video-header'>{t(`Watch SPIKE's latest video`)}</h1>
                    </div>

                    <LatestVideoCard />

                    <Newsletter />

                    <h1 style={{paddingTop : '1rem'}} className='bonus-header'>I migliori bonus di benvenuto</h1>
                    <div style={{top : '820px'}} className='bonus-column-container'>
                        {bonusList && bonusList.map(bo => <BonusCardRevealComponent key={bo.name} bonus={bo} />)}
                    </div>
                </RightColumn>

                <OnlyMobile>
                    <Newsletter />
                </OnlyMobile>
            </BodyContainer>
        </NavbarProvider>
    </div>
}

export async function getStaticProps({query, req}) {
  
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const data = await aquaClient.query({
        query: HOME,
        variables: { countryCode: 'it'}
    })

    return {
        props: {
            _home: data.data.data.homes[0] as Home,
            _shallow : null
        }
    }
}




export default Index


