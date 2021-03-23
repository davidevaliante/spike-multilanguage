import React, { FunctionComponent, useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
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
import { useTranslation } from "react-i18next";
import { OnlyMobile } from '../components/Responsive/Only'
import FullPageLoader from '../components/Layout/FullPageLoader'
import { ApolloSlotCard } from '../data/models/Slot'
import { ApolloBonusCardReveal } from '../data/models/Bonus'
import { getUserCountryCode } from '../utils/Utils'
import Router, { useRouter } from 'next/router'
import { LocaleContext } from '../context/LocaleContext'

interface PageProps {
    _home: Home,
    _countryCode:string
}

const Index: FunctionComponent<PageProps> = ({ _home, _countryCode }) => {
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const router = useRouter()

    const [home, setHome] = useState<Home | undefined>(undefined)
    const [countryCode, setCountryCode] = useState<string | undefined>(undefined)
    const [producerSlots, setProducerSlots] = useState<ApolloSlotCard[] | undefined>(undefined)
    const [onlineSlots, setOnlineSlots] = useState<ApolloSlotCard[] | undefined>(undefined)
    const [barSlots, setBarSlots] = useState<ApolloSlotCard[] | undefined>(undefined)
    const [vltSlots, setVltSlots] = useState<ApolloSlotCard[] | undefined>(undefined)
    const [bonusList, setBonusList] = useState<ApolloBonusCardReveal[] | undefined>(undefined)

    useEffect(() => {
        getCountryData()
    }, [])

    const getCountryData = async () => {
        const userCountryCode = await getUserCountryCode()
        if(userCountryCode === 'it'){
            // if the user is from Italy we stay on the same page and use the server side fetched data
            setHome(_home)
            setCountryCode(_countryCode)
            setProducerSlots(_home.producerSlots.slot.map(s => s.slot))
            setOnlineSlots(_home.onlineSlots.slot.map(s => s.slot))
            setBarSlots(_home.barSlots.slot.map(s => s.slot))
            setVltSlots(_home.vltSlots.slot.map(s => s.slot))
            setBonusList(_home.bonuses.bonus.map(b => b.bonus))
        } else {
            // otherwise we redirect to /[countryCode] route
            router.push(`/${userCountryCode}`)
        }
    }

    const { t } = useContext(LocaleContext)

    if(!home || !countryCode || !producerSlots || !onlineSlots  || !bonusList) return <FullPageLoader />
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

        <NavbarProvider currentPage='Home' countryCode={countryCode}>
            {home.topArticle && <HomeHeader topArticle={home.topArticle}>SPIKE SLOT</HomeHeader>}
            <BodyContainer>
                <MainColumn>
                    {producerSlots && <HighlightProducerSlideShow producerSlots={producerSlots} />}

                    <LazyLoad height={450} once>
                        <SlideShow
                            apolloSlotCards={onlineSlots.filter(s => s.image !== undefined)}
                            title='The Online Slots of the moment'
                            icon='/icons/slot_online_icon.svg'
                            buttonText={t('See the full list of Online Slots')}
                            buttonRoute={`/slots/[countryCode]`}
                            buttonRouteAs={`/slots/${countryCode}`}
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
                            buttonRouteAs={`/slot-bar/${countryCode}`}
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
                            buttonRouteAs={`/slot-vlt/${countryCode}`}
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

                    <Provider>
                    <iframe className={'sib-form'} width="500" height='600' src="https://c4236f72.sibforms.com/serve/MUIEAH9KaDzyuXi3daFo5LJ-0Y8EBDFsdQ4PEXaF5c2P0bghKc__0xqGLS0G0XL8lniYtTnyPiKPyLC83CM8ZBLDOXTAN-bf4nijExyd1yBXjXAA-NJkOY7xTU9w6r_z0HxnnmewgVrYVdcJzKPZKou9FTgwc957psJ189mbdwRfqj70JyPvJRtFhaizXBR87WKEjHI5tVbE9rb5" frameBorder="0" scrolling="auto" allowFullScreen style={{display: 'block', marginLeft: 'auto',marginRight: 'auto',maxWidth: '100%', padding : '0'}}></iframe>
                    </Provider>

                    <h1 style={{paddingTop : '1rem'}} className='bonus-header'>I migliori bonus di benvenuto</h1>
                    <div style={{top : '820px'}} className='bonus-column-container'>
                        {bonusList && bonusList.map(bo => <BonusCardRevealComponent key={bo.name} bonus={bo} />)}
                    </div>
                </RightColumn>

                <OnlyMobile>
                <iframe className={'sib-form'} width="500" height='600' src="https://c4236f72.sibforms.com/serve/MUIEAH9KaDzyuXi3daFo5LJ-0Y8EBDFsdQ4PEXaF5c2P0bghKc__0xqGLS0G0XL8lniYtTnyPiKPyLC83CM8ZBLDOXTAN-bf4nijExyd1yBXjXAA-NJkOY7xTU9w6r_z0HxnnmewgVrYVdcJzKPZKou9FTgwc957psJ189mbdwRfqj70JyPvJRtFhaizXBR87WKEjHI5tVbE9rb5" frameBorder="0" scrolling="auto" allowFullScreen style={{display: 'block', marginLeft: 'auto',marginRight: 'auto',maxWidth: '100%', padding : '0'}}></iframe>
                </OnlyMobile>

            </BodyContainer>
        </NavbarProvider>
    </div>
}

export async function getServerSideProps({req}) {
  
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)
    const data = await aquaClient.query({
        query: HOME,
        variables: { countryCode: 'it'}
    })

    return {
        props: {
            _home: data.data.data.homes[0] as Home,
            _countryCode:'it'
        }
    }
}

const Provider = styled.div`
    .sib-form{
        padding : 0px !important;
        margin : 0px !important;
    }
`

const Text = styled.p`
    line-height : 1.5rem;
`

const Header = styled.h1`
    font-family : ${(props) => props.theme.text.secondaryFont};
    font-size : 2rem;
    padding : 2rem 0rem;
    color : ${(props) => props.theme.colors.primary};
`

export default Index


