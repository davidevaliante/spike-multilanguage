import React, { Fragment, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import { NextPageContext } from 'next'
import CustomBreadcrumbs from '../../../../components/Breadcrumbs/CustomBreadcrumbs'
import { Bonus, Slot } from './../../../../graphql/schema'
import AquaClient from '../../../../graphql/aquaClient'
import { SLOT_WITH_SLUG } from './../../../../graphql/queries/slots'
import {
    exitFullscreen,
    getCanonicalPath,
    getUserCountryCode,
    goFullScreen,
    injectCDN,
    serverSide404,
    serverSideRedirect,
} from './../../../../utils/Utils'
import SmallSlotCard from '../../../../components/Cards/SmallSlotCard'
import snakeCase from 'lodash/snakeCase'
import { isMobile } from 'react-device-detect'
import { laptop } from './../../../../components/Responsive/Breakpoints'
import PrimaryBonusCard from '../../../../components/Cards/PrimaryBonusCard'
import SecondaryBonusCard from './../../../../components/Cards/SecondaryBonusCard'
import NeonButton from './../../../../components/NeonButton/NeonButton'
import PlayDimmer from '../../../../components/PlayDimmer/PlayDimmer'
import FadeInOut from '../../../../components/Ui/FadeInOut'
import ArticleToMarkdown from './../../../../components/Markdown/ArticleToMarkdown'
import { BodyContainer, MainColumn, RightColumn } from '../../../../components/Layout/Layout'
import { FunctionComponent } from 'react'
import BonusCardRevealComponent from './../../../../components/Cards/BonusCardReveal'
import SlotMainFeatures from '../../../../components/Cards/SlotMainFeatures'
import Head from 'next/head'
import { ApolloBonusCardReveal } from '../../../../data/models/Bonus'
import { BONUSES_BY_NAME, GET_BONUS_BY_NAME_AND_COUNTRY, HOME_BONUS_LIST } from '../../../../graphql/queries/bonus'
import { useRouter } from 'next/router'
import { LocaleContext } from './../../../../context/LocaleContext'
import FullPageLoader from '../../../../components/Layout/FullPageLoader'
import ShareButtons, { TopRowContainer } from '../../../../components/Seo/ShareButtons'
import Author from '../../../../components/StructuredData.tsx/Author'
import axios from 'axios'
import { bonusToExclude, substituteName } from '../../../../config'
import BlockingOverlay from '../../../../components/Ui/BlockingOverlay'
import RtpDisplayer from '../../../../components/Singles/RtpDisplayer'

interface PageProps extends NextPageContext {
    _shallow: boolean
    _slotData: Slot
    _bonusList: { bonus: ApolloBonusCardReveal }[]
    _countryCode: string
}

const SlotPage: FunctionComponent<PageProps> = ({ _shallow, _slotData, _bonusList, _countryCode }) => {
    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)
    const [loading, setLoading] = useState(true)

    const [playLink, setPlayLink] = useState(_slotData.playLink)

    useEffect(() => {
        console.log(playLink, 'playlink changed')
    }, [playLink])

    const [primaryBonus, setPrimaryBonus] = useState(_slotData.mainBonus)
    const [auxiliaryBonuses, setAuxiliaryBonuses] = useState(
        _slotData?.bonuses.filter((b: Bonus) => b.name !== primaryBonus?.name),
    )

    const [isPlaying, setIsPlaying] = useState(false)

    const [isPlayingMobile, setIsPlayingMobile] = useState(false)

    useEffect(() => {
        if (isPlayingMobile) goFullScreen()
        else exitFullscreen()
    }, [isPlayingMobile])

    useEffect(() => {
        setup()
        geoLocate()
    }, [])

    useEffect(() => {
        if (_slotData) {
            setPrimaryBonus(_slotData.mainBonus)
            setAuxiliaryBonuses(_slotData?.bonuses.filter((b: Bonus) => b.name !== primaryBonus?.name))
            setPlayLink(_slotData.playLink)
        }
    }, [_slotData])

    const checkForCrystaltech = async () => {
        console.log('retriving cristaltec play url')
        try {
            const url = `https://cristaltecdemo.piattaforma97.it/${_slotData.name}`
            console.log(url)
            const request = await axios.get(url)
            setPlayLink(request.data)

            console.log(request.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSubstitute = async () => {
        const data = await axios.get(`https://spikeapistaging.tech/bonuses?country.code=it&name=${substituteName}`)
        setPrimaryBonus(data.data[0])
    }

    const setup = async () => {
        if (_slotData.producer.name === 'Cristaltec') checkForCrystaltech()
        if (_slotData.mainBonus.name === bonusToExclude) fetchSubstitute()
        if (_slotData.bonuses.map((b) => b.name).includes(bonusToExclude)) {
            const substituteReq = await axios.get(
                `https://spikeapistaging.tech/bonuses?country.code=it&name=${substituteName}`,
            )

            const substitute = substituteReq.data[0]
            const copy = [..._slotData.bonuses]
            const filtered = copy.filter((it) => it.name !== bonusToExclude)
            filtered.push(substitute)
            setAuxiliaryBonuses(filtered)
        }
        setContextCountry(_countryCode)
        setLoading(false)
    }

    const geoLocate = async () => {
        const uc = await getUserCountryCode()
        setUserCountry(uc)
    }

    const [showProblemForm, setShowProblemForm] = useState(false)

    return (
        <Fragment>
            <Head>
                <title>{_slotData?.seo ? `${_slotData?.seo.seoTitle}` : `${_slotData?.name} | SPIKE`}</title>
                <meta
                    name='description'
                    content={
                        _slotData?.seo
                            ? `${_slotData?.seo.seoDescription}`
                            : `${_slotData?.name} Le migliori slot online selezionate per te con trucchi consigli e demo gratuite. Prova le slot online in modalità gratuita, scegli quella che ti incuriosisce di più e leggi la guida approfondita prima di passare alla versione a soldi veri`
                    }
                ></meta>
                <meta httpEquiv='content-language' content='it-IT'></meta>
                <link rel='canonical' href={getCanonicalPath()} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta
                    itemProp='name'
                    content={_slotData?.seo ? `${_slotData?.seo.seoTitle}` : `${_slotData?.name} | SPIKE`}
                />
                <meta
                    itemProp='description'
                    content={
                        _slotData?.seo
                            ? `${_slotData?.seo.seoDescription}`
                            : `${_slotData?.name} Le migliori slot online selezionate per te con trucchi consigli e demo gratuite. Prova le slot online in modalità gratuita, scegli quella che ti incuriosisce di più e leggi la guida approfondita prima di passare alla versione a soldi veri`
                    }
                />
                <meta
                    itemProp='image'
                    content={
                        _slotData.image.url
                            ? _slotData.image.url
                            : 'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'
                    }
                />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta
                    name='twitter:title'
                    content={_slotData?.seo ? `${_slotData?.seo.seoTitle}` : `${_slotData?.name} | SPIKE`}
                />
                <meta
                    name='twitter:description'
                    content={
                        _slotData?.seo
                            ? `${_slotData?.seo.seoDescription}`
                            : `${_slotData?.name} Le migliori slot online selezionate per te con trucchi consigli e demo gratuite. Prova le slot online in modalità gratuita, scegli quella che ti incuriosisce di più e leggi la guida approfondita prima di passare alla versione a soldi veri`
                    }
                />
                <meta
                    name='twitter:image'
                    content={
                        _slotData.image.url
                            ? _slotData.image.url
                            : 'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'
                    }
                />

                <meta
                    property='og:image'
                    content={
                        _slotData.image.url
                            ? _slotData.image.url
                            : 'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'
                    }
                />
                <meta property='og:locale' content={'it'} />
                <meta property='og:type' content='article' />
                <meta
                    property='og:description'
                    content={
                        _slotData?.seo
                            ? `${_slotData?.seo.seoDescription}`
                            : `${_slotData?.name} Le migliori slot online selezionate per te con trucchi consigli e demo gratuite. Prova le slot online in modalità gratuita, scegli quella che ti incuriosisce di più e leggi la guida approfondita prima di passare alla versione a soldi veri`
                    }
                />
                <meta
                    property='og:site_name'
                    content={_slotData?.seo ? `${_slotData?.seo.seoTitle}` : `${_slotData?.name} | SPIKE`}
                />
                <meta property='article:tag' content={_slotData?.seo?.seoTitle} />
            </Head>

            <FadeInOut visible={!isPlayingMobile}>
                <BlockingOverlay redirectLink='/slots/it' userCountry={userCountry} />
                {!isPlayingMobile && (
                    <NavbarProvider currentPage={`/slot/${_slotData?.name}`} countryCode={contextCountry}>
                        <Body>
                            <div>
                                <Author
                                    articleType='NewsArticle'
                                    headLine={_slotData.seo?.seoTitle}
                                    images={[_slotData.image.url]}
                                    datePublished={_slotData.created_at}
                                    dateModified={_slotData.updated_at}
                                />

                                <TopRowContainer>
                                    <CustomBreadcrumbs
                                        style={{ padding: '1.5rem 1rem' }}
                                        slotSlug={_slotData?.slug}
                                        slotName={_slotData?.name}
                                        producerName={_slotData?.producer.name}
                                        producerSlug={_slotData?.producer.slug}
                                        name={_slotData?.name}
                                        from='slot'
                                    />

                                    <ShareButtons
                                        title={_slotData.seo?.seoTitle}
                                        description={_slotData.seo?.seoDescription}
                                        url={`https://spikeslot.com/slot/${_slotData.slug}/${contextCountry}`}
                                        image={
                                            _slotData.seo?.shareImg
                                                ? _slotData.seo.shareImg
                                                : injectCDN(_slotData.image.url)
                                        }
                                    />
                                </TopRowContainer>

                                <Container>
                                    <div style={{ overflow: 'hidden ', border: '1px solid white' }}>
                                        <SlotBackgroundImage
                                            isMobile={isMobile}
                                            image={injectCDN(_slotData?.image.url)}
                                        ></SlotBackgroundImage>
                                    </div>

                                    <div style={{ zIndex: 9 }}>
                                        <TitleAndRating>
                                            <h1>{_slotData?.name}</h1>
                                            <StarContainer>
                                                {_slotData ? (
                                                    <>
                                                        {[...Array(_slotData.rating).keys()].map((s, i) => (
                                                            <img
                                                                key={`${snakeCase(_slotData.name)}_${i}_start_full`}
                                                                alt='full_star_icon'
                                                                className='star'
                                                                src='/icons/star_full.svg'
                                                            />
                                                        ))}
                                                        {[...Array(5 - _slotData.rating).keys()].map((s, i) => (
                                                            <img
                                                                key={`${snakeCase(_slotData.name)}_${i}_start_empty`}
                                                                alt='empty_star_icon'
                                                                className='star'
                                                                src='/icons/star_empty.svg'
                                                            />
                                                        ))}
                                                    </>
                                                ) : (
                                                    ''
                                                )}
                                            </StarContainer>
                                        </TitleAndRating>
                                    </div>

                                    <SmallSlotCard
                                        onClick={() => setIsPlayingMobile(true)}
                                        slug={_slotData?.slug}
                                        image={injectCDN(_slotData?.image.url)}
                                    />

                                    <PlayArea>
                                        {isPlaying && <iframe src={playLink} />}
                                        {!isPlaying && <NeonButton onClick={() => setIsPlaying(true)} />}
                                    </PlayArea>
                                    {primaryBonus && <PrimaryBonusCard bonus={primaryBonus} />}
                                </Container>

                                <h2 className='alternative-bonus-list'>{t('You can also find it on these sites')}</h2>

                                <SecondaryBonusListContainer>
                                    {auxiliaryBonuses?.map((bonus) => (
                                        <SecondaryBonusCard key={bonus.name} bonus={bonus} />
                                    ))}
                                </SecondaryBonusListContainer>
                            </div>

                            <div style={{ width: '100%', marginBottom: '6rem' }}>
                                <BodyContainer>
                                    <MainColumn
                                        style={{
                                            maxWidth: '800px',
                                            margin: '1rem',
                                            justifyContent: 'flex-start',
                                            marginTop: '2.5rem',
                                        }}
                                    >
                                        <ArticleToMarkdown
                                            content={_slotData?.description}
                                            slotImage={_slotData.image.url}
                                            slotRtp={_slotData.rtp}
                                            allowBonuses={true}
                                        />
                                    </MainColumn>
                                    <RightColumn>
                                        <SlotMainFeatures
                                            rtp={_slotData?.rtp}
                                            paymentMethods={_slotData?.mainBonus?.acceptedPayments}
                                            gameMode={_slotData?.gameMode}
                                            theme={_slotData?.theme}
                                            volatility={_slotData?.volatility}
                                            rating={_slotData?.rating}
                                            bonusName={_slotData?.mainBonus?.name}
                                            bonusLink={_slotData?.mainBonus?.link}
                                            winningSpinFrequency={_slotData?.winningSpinFrequency}
                                        />
                                        <div
                                            style={{ top: '0', position: 'static' }}
                                            className='bonus-column-container'
                                        >
                                            {_bonusList &&
                                                _bonusList.map((bo) => (
                                                    <BonusCardRevealComponent key={bo.bonus.name} bonus={bo.bonus} />
                                                ))}
                                        </div>
                                    </RightColumn>
                                </BodyContainer>
                            </div>
                        </Body>
                    </NavbarProvider>
                )}
            </FadeInOut>

            {isPlayingMobile && (
                <PlayDimmer onClose={() => setIsPlayingMobile(false)} slotData={_slotData} playLink={playLink} />
            )}
        </Fragment>
    )
}

const ProblemButton = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${(props) => props.theme.colors.primary};
    color: white;
    text-align: center;
    height: 30px;
    padding: 0.5rem;
`

const PlayArea = styled.div`
    display: none;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 8px;
    width: 70%;
    margin-left: 1rem;
    height: 500px;
    z-index: 10;

    ${laptop} {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    iframe {
        width: 100%;
        height: 100%;
        border-radius: 6px;
    }
`

const Body = styled.div`
    min-height: 100vh;
    width: 100%;

    .alternative-bonus-list {
        font-family: ${(props) => props.theme.text.secondaryFont};
        color: ${(props) => props.theme.colors.primary};
        margin-top: 2rem;
        padding: 1rem 1rem;
        font-size: 1.5rem;
        text-align: start;
    }
`

const SecondaryBonusListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`

interface PlayContainerProps {
    image: string
    isMobile: boolean
}

const Container = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding-top: 5rem;
`

const SlotBackgroundImage = styled.div`
    width: 100%;
    background-image: ${(props: PlayContainerProps) => `url(${injectCDN(props.image)})`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    filter: blur(3px);

    ${laptop} {
        filter: blur(5px);
        border-radius: 16px;
        height: 600px;
    }
`

const TitleAndRating = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: start;

    h1 {
        color: white;
        text-transform: uppercase;
        font-family: ${(props) => props.theme.text.secondaryFont};
        font-size: 1.5rem;
        padding-left: 1rem;
        padding-top: 1rem;
        padding-bottom: 0.5rem;
    }
`

const StarContainer = styled.div`
    display: flex;
    width: 100%;
    padding-left: 1rem;

    .star {
        width: 20px;
        height: 20px;
        margin-right: 0.3rem;
    }
`

export async function getServerSideProps({ query, res }) {
    try {
        const slug = query.slug as string
        const country = query.countryCode as string
        const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

        const response = await aquaClient.query({
            query: SLOT_WITH_SLUG,
            variables: { slug: slug, countryCode: country },
        })

        let slot = response.data.data.slots[0] as Slot

        if (slot.mainBonus.name === 'BetFlag') {
            const wincasinoBonus = await aquaClient.query({
                query: GET_BONUS_BY_NAME_AND_COUNTRY,
                variables: {
                    name: 'WinCasino',
                    countryCode: country,
                },
            })

            slot.mainBonus = wincasinoBonus.data.data.bonuses[0]
        }

        const bonusesNames = slot.bonuses.map((b) => b.name)

        if (bonusesNames.includes('BetFlag')) {
            const indextoRemove = slot.bonuses.findIndex((it) => it.name === 'BetFlag')
            console.log('Bet flag spotted', indextoRemove)

            const placeholder = [...slot.bonuses]
            placeholder.splice(indextoRemove, 1)
            slot.bonuses = placeholder
        }

        const bonusListResponse = await aquaClient.query({
            query: HOME_BONUS_LIST,
            variables: {
                countryCode: country,
            },
        })

        const bonusList = bonusListResponse.data.data.homes[0].bonuses.bonus

        return {
            props: {
                query,
                _slotData: slot,
                _bonusList: bonusListResponse.data.data.homes[0]?.bonuses.bonus,
                _countryCode: country,
            },
        }
    } catch (error) {
        serverSide404(res)
    }
    return {}
}

export default SlotPage
