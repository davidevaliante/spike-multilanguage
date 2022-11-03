import React, { FunctionComponent, useContext, useState, useEffect } from 'react'
import NavbarProvider from '../components/Navbar/NavbarProvider'
import HomeHeader from './../components/Home/HomeHeader'
import { appTheme } from './../theme/theme'
import LazyLoad from 'react-lazyload'
import LatestVideoCard from '../components/Cards/LatestVideoCard'
import Icon from '../components/Icons/Icon'
import { Home } from './../graphql/schema'
import SlideShow from '../components/SlideShow/SlideShow'
import BonusCardRevealComponent from '../components/Cards/BonusCardReveal'
import { BodyContainer, MainColumn, RightColumn } from '../components/Layout/Layout'
import ArticleToMarkdown from '../components/Markdown/ArticleToMarkdown'
import { OnlyMobile } from '../components/Responsive/Only'
import { ApolloSlotCard } from '../data/models/Slot'
import { ApolloBonusCardReveal } from '../data/models/Bonus'
import { useRouter } from 'next/router'
import { LocaleContext } from '../context/LocaleContext'
import Newsletter from '../components/Newsletter/Newsletter'
import CountryEquivalentPageSnackbar from '../components/Snackbars/CountryEquivalentPageSnackbar'
import { homeDataForCountry } from '../data/data/pages-data'
import LiveStatsCta from './../components/Singles/LiveStatsCta'
import Metatags from '../components/Seo/Metatags'
import { websiteRoot } from '../constants/constants'
import { defaultShareImage } from './../constants/constants'
import Logo from '../components/StructuredData.tsx/Logo'
import SidebarBonusHeader from '../components/Text/SidebarBonusHeader'
import NoLimitHighlightProducerSlideShow from '../components/SlideShow/NoLimitHighlightProducerSlideShow'
import { useCountry } from '../hooks/useCountry'

interface PageProps {
    homeData: Home
}

const automaticRedirect = false

const Index: FunctionComponent<PageProps> = ({ homeData }) => {
    const {
        t,
        appCountry: contextCountry,
        setAppCountry: setContextCountry,
        userCountry,
        setUserCountry,
    } = useContext(LocaleContext)

    const router = useRouter()
    const country = useCountry()

    const [isBakeca, setIsBakeca] = useState(router.asPath.split('from=')[1] === 'bakeca')

    const [home, setHome] = useState<Home>(homeData)

    const [producerSlots, setProducerSlots] = useState<ApolloSlotCard[]>(home.producerSlots.slot.map((s) => s.slot))
    const [onlineSlots, setOnlineSlots] = useState<ApolloSlotCard[]>(home.onlineSlots.slot.map((s) => s.slot))
    const [barSlots, setBarSlots] = useState<ApolloSlotCard[]>(home.barSlots.slot.map((s) => s.slot))
    const [vltSlots, setVltSlots] = useState<ApolloSlotCard[]>(home.vltSlots.slot.map((s) => s.slot))
    const [bonusList, setBonusList] = useState<ApolloBonusCardReveal[]>(home.bonuses.bonus.map((b) => b.bonus))

    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)

    return (
        <div>
            <Metatags
                title={home.seo.seoTitle}
                url={websiteRoot}
                description={home.seo.seoDescription}
                image={defaultShareImage}
                locale={contextCountry}
            />
            <Logo />
            <NavbarProvider currentPage={!isBakeca ? 'Home' : '/bakeca-home'} countryCode={contextCountry}>
                <HomeHeader topArticle={home.topArticle} />
                <BodyContainer>
                    <CountryEquivalentPageSnackbar path={`/${userCountry}`} exists={userCountryEquivalentExists} />
                    <MainColumn>
                        <LiveStatsCta />

                        <NoLimitHighlightProducerSlideShow producerSlots={producerSlots} />

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

                        <div className='px-1 lg:px-0 mt-8'>
                            {home.bottomArticle && (
                                <ArticleToMarkdown content={home.bottomArticle} isBakeca={isBakeca} />
                            )}
                        </div>
                    </MainColumn>

                    <RightColumn>
                        <div className='flex flex-row mb-4'>
                            <Icon width={56} height={56} source='/icons/flame_icon.svg' alt={'flame icon'} />
                            <div className='font-serif text-lg text-primary-500'>{t(`Watch SPIKE's latest video`)}</div>
                        </div>

                        <LatestVideoCard />

                        <Newsletter />

                        <div style={{ top: '0', position: 'relative' }} className='bonus-column-container'>
                            <SidebarBonusHeader />

                            {bonusList &&
                                bonusList.map((bo) => (
                                    <BonusCardRevealComponent key={bo.name} bonus={bo} isBakeca={isBakeca} />
                                ))}
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

export const fetchAsyncData = async (topArticle) => {
    const spikeCompare = '>spikeCompare@'
    console.log(topArticle, 'TOP ART')
}

export async function getServerSideProps({ query, params, req }) {
    const pageData = await homeDataForCountry('it')

    const topArticle = pageData.topArticle
    const bottomArticle = pageData.bottomArticle

    await fetchAsyncData(bottomArticle)

    return {
        props: {
            homeData: pageData,
        },
    }
}

export default Index
