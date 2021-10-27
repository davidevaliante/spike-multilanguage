import React, { Fragment, useState, useEffect, useContext } from "react"
import styled from "styled-components"
import NavbarProvider from "../../../../components/Navbar/NavbarProvider"
import { NextPageContext } from "next"
import CustomBreadcrumbs from "../../../../components/Breadcrumbs/CustomBreadcrumbs"
import { Slot, Bonus } from "./../../../../graphql/schema"
import AquaClient from "../../../../graphql/aquaClient"
import { SLOT_WITH_SLUG } from "./../../../../graphql/queries/slots"
import {
    injectCDN,
    goFullScreen,
    exitFullscreen,
    getCanonicalPath,
    serverSideRedirect,
    serverSide404,
} from "./../../../../utils/Utils"
import SmallSlotCard from "../../../../components/Cards/SmallSlotCard"
import snakeCase from "lodash/snakeCase"
import { isMobile } from "react-device-detect"
import { laptop } from "./../../../../components/Responsive/Breakpoints"
import PrimaryBonusCard from "../../../../components/Cards/PrimaryBonusCard"
import SecondaryBonusCard from "./../../../../components/Cards/SecondaryBonusCard"
import NeonButton from "./../../../../components/NeonButton/NeonButton"
import PlayDimmer from "../../../../components/PlayDimmer/PlayDimmer"
import FadeInOut from "../../../../components/Ui/FadeInOut"
import ArticleToMarkdown from "./../../../../components/Markdown/ArticleToMarkdown"
import { MainColumn, RightColumn, BodyContainer } from "../../../../components/Layout/Layout"
import { FunctionComponent } from "react"
import BonusCardRevealComponent from "./../../../../components/Cards/BonusCardReveal"
import SlotMainFeatures from "../../../../components/Cards/SlotMainFeatures"
import Head from "next/head"
import { ApolloBonusCardReveal } from "../../../../data/models/Bonus"
import { HOME_BONUS_LIST } from "../../../../graphql/queries/bonus"
import { useRouter } from "next/router"
import { LocaleContext } from "./../../../../context/LocaleContext"
import FullPageLoader from "../../../../components/Layout/FullPageLoader"
import ShareButtons, { TopRowContainer } from "../../../../components/Seo/ShareButtons"
import Author from "../../../../components/StructuredData.tsx/Author"
import axios from "axios"

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
        console.log(playLink, "playlink changed")
    }, [playLink])

    const [primaryBonus, setPrimaryBonus] = useState(_slotData.mainBonus)
    const [auxiliaryBonuses, setAuxiliaryBonuses] = useState(
        _slotData?.bonuses.filter((b: Bonus) => b.name !== primaryBonus?.name)
    )

    const [isPlaying, setIsPlaying] = useState(false)

    const [isPlayingMobile, setIsPlayingMobile] = useState(false)

    useEffect(() => {
        if (isPlayingMobile) goFullScreen()
        else exitFullscreen()
    }, [isPlayingMobile])

    useEffect(() => {
        setup()
    }, [])

    const setup = () => {
        console.log(_slotData)
        if (_slotData.name === "Arizona") setPlayLink(ArizonaPlayLink)
        setContextCountry(_countryCode)
        setLoading(false)
    }

    const [showProblemForm, setShowProblemForm] = useState(false)

    return (
        <Fragment>
            <Head>
                <title>{_slotData?.seo ? `${_slotData?.seo.seoTitle}` : `${_slotData?.name} | SPIKE`}</title>
                <meta
                    name="description"
                    content={
                        _slotData?.seo
                            ? `${_slotData?.seo.seoDescription}`
                            : `${_slotData?.name} Le migliori slot online selezionate per te con trucchi consigli e demo gratuite. Prova le slot online in modalità gratuita, scegli quella che ti incuriosisce di più e leggi la guida approfondita prima di passare alla versione a soldi veri`
                    }
                ></meta>
                <meta httpEquiv="content-language" content="it-IT"></meta>
                <link rel="canonical" href={getCanonicalPath()} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta
                    itemProp="name"
                    content={_slotData?.seo ? `${_slotData?.seo.seoTitle}` : `${_slotData?.name} | SPIKE`}
                />
                <meta
                    itemProp="description"
                    content={
                        _slotData?.seo
                            ? `${_slotData?.seo.seoDescription}`
                            : `${_slotData?.name} Le migliori slot online selezionate per te con trucchi consigli e demo gratuite. Prova le slot online in modalità gratuita, scegli quella che ti incuriosisce di più e leggi la guida approfondita prima di passare alla versione a soldi veri`
                    }
                />
                <meta
                    itemProp="image"
                    content={
                        _slotData.image.url
                            ? _slotData.image.url
                            : "https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg"
                    }
                />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content={_slotData?.seo ? `${_slotData?.seo.seoTitle}` : `${_slotData?.name} | SPIKE`}
                />
                <meta
                    name="twitter:description"
                    content={
                        _slotData?.seo
                            ? `${_slotData?.seo.seoDescription}`
                            : `${_slotData?.name} Le migliori slot online selezionate per te con trucchi consigli e demo gratuite. Prova le slot online in modalità gratuita, scegli quella che ti incuriosisce di più e leggi la guida approfondita prima di passare alla versione a soldi veri`
                    }
                />
                <meta
                    name="twitter:image"
                    content={
                        _slotData.image.url
                            ? _slotData.image.url
                            : "https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg"
                    }
                />

                <meta
                    property="og:image"
                    content={
                        _slotData.image.url
                            ? _slotData.image.url
                            : "https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg"
                    }
                />
                <meta property="og:locale" content={"it"} />
                <meta property="og:type" content="article" />
                <meta
                    property="og:description"
                    content={
                        _slotData?.seo
                            ? `${_slotData?.seo.seoDescription}`
                            : `${_slotData?.name} Le migliori slot online selezionate per te con trucchi consigli e demo gratuite. Prova le slot online in modalità gratuita, scegli quella che ti incuriosisce di più e leggi la guida approfondita prima di passare alla versione a soldi veri`
                    }
                />
                <meta
                    property="og:site_name"
                    content={_slotData?.seo ? `${_slotData?.seo.seoTitle}` : `${_slotData?.name} | SPIKE`}
                />
                <meta property="article:tag" content={_slotData?.seo?.seoTitle} />
            </Head>

            <FadeInOut visible={!isPlayingMobile}>
                {!isPlayingMobile && (
                    <NavbarProvider currentPage={`/slot/${_slotData?.name}`} countryCode={contextCountry}>
                        <Body>
                            <div>
                                <Author
                                    articleType="NewsArticle"
                                    headLine={_slotData.seo?.seoTitle}
                                    images={[_slotData.image.url]}
                                    datePublished={_slotData.created_at}
                                    dateModified={_slotData.updated_at}
                                />

                                <TopRowContainer>
                                    <CustomBreadcrumbs
                                        style={{ padding: "1.5rem 1rem" }}
                                        slotSlug={_slotData?.slug}
                                        slotName={_slotData?.name}
                                        producerName={_slotData?.producer.name}
                                        producerSlug={_slotData?.producer.slug}
                                        name={_slotData?.name}
                                        from="slot"
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

                                    {/* <ProblemButton onClick={() => setShowProblemForm(true)}>
                    <p>Segnala un problema</p>
                  </ProblemButton> */}
                                </TopRowContainer>

                                <Container>
                                    <div style={{ overflow: "hidden ", border: "1px solid white" }}>
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
                                                                alt="full_star_icon"
                                                                className="star"
                                                                src="/icons/star_full.svg"
                                                            />
                                                        ))}
                                                        {[...Array(5 - _slotData.rating).keys()].map((s, i) => (
                                                            <img
                                                                key={`${snakeCase(_slotData.name)}_${i}_start_empty`}
                                                                alt="empty_star_icon"
                                                                className="star"
                                                                src="/icons/star_empty.svg"
                                                            />
                                                        ))}
                                                    </>
                                                ) : (
                                                    ""
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

                                <h2 className="alternative-bonus-list">{t("You can also find it on these sites")}</h2>

                                <SecondaryBonusListContainer>
                                    {auxiliaryBonuses?.map((bonus) => (
                                        <SecondaryBonusCard key={bonus.name} bonus={bonus} />
                                    ))}
                                </SecondaryBonusListContainer>
                            </div>

                            <div style={{ width: "100%", marginBottom: "6rem" }}>
                                <BodyContainer>
                                    <MainColumn style={{ maxWidth: "800px", margin: "1rem" }}>
                                        <ArticleToMarkdown content={_slotData?.description} />
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
                                            style={{ top: "0", position: "static" }}
                                            className="bonus-column-container"
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
                _slotData: response.data.data.slots[0],
                _bonusList: bonusListResponse.data.data.homes[0]?.bonuses.bonus,
                _countryCode: country,
            },
        }
    } catch (error) {
        serverSide404(res)
    }
    return {}
}

const ArizonaPlayLink =
    "https://d3fzpomthik49y.cloudfront.net/457284b0-3019-11ec-96c6-cd642f14185d/index.html?sid=FUN1a6a277f-046f-4de4-9dcf-042ad711e2e4&mode=fun&q=2&coins=100000&gameName=arizona_vlt&inactivityTime=20&purl=https://play.gai.cristent.it&rurl=null&token=BearerFuneyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX3N0YXJ0IjoxLCJpYXQiOjE2MzUzMzI2NzMsImV4cCI6MTYzNTMzMjk3M30.9W6tMdpAvi_f0QOnDtVpCCte8QCsuRuWmyIsxF9q9K0"

export default SlotPage
