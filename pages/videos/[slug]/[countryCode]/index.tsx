import React, { Fragment, useState, useEffect, useContext, FunctionComponent } from 'react'
import axios from 'axios'
import { firebaseDatabaseUrl } from '../../../../data/firebaseConfig'
import Head from 'next/head'
import styled from 'styled-components'
import { Video } from '../../../../graphql/schema'
import VideoMainData from '../../../../components/Video/VideoMainData'
import AquaClient from '../../../../graphql/aquaClient'
import { GET_BONUS_BY_LEGACY_ID } from '../../../../graphql/queries/bonus'
import { Bonus, Slot, AlgoliaSearchResult } from '../../../../graphql/schema'
import { getCanonicalPath, getUserCountryCode } from '../../../../utils/Utils'
import { OnlyMobile, OnlyDesktop } from '../../../../components/Responsive/Only'
import { bigscreens } from '../../../../components/Responsive/Breakpoints'
import RelatedVideoCard from '../../../../components/Cards/RelatedVideoCard'
import VideoSecondaryBonusCard from '../../../../components/Cards/VideoSecondaryBonusCard'
import { GET_SLOT_BY_LEGACY_ID } from '../../../../graphql/queries/slots'
import { GET_SLOT_CARD_BY_ID } from '../../../../graphql/queries/slots'
import VideoRelatedSlots from '../../../../components/Lists/VideoRelatedSlots'
import { OnlyBigScreens } from '../../../../components/Responsive/Only'
import VideoDiscalimer from '../../../../components/Singles/VideoDiscalimer'
import Divider from '../../../../components/Ui/Divider'
import NavbarWithPlayer, { getMp4CDNZone } from '../../../../components/Navbar/NavbarWithPlayer'
import BonusStripe from './../../../../components/Cards/BonusStripe'
import truncate from 'lodash/truncate'
import { useRouter } from 'next/router'
import { LocaleContext } from '../../../../context/LocaleContext'
import VideoMeta from './../../../../components/StructuredData.tsx/Video'
import { substituteLegacyId } from '../../../../config'

interface Props {
    video: Video
    mainBonus: Bonus
    auxiliaryBonuses: Bonus[]
    relatedVideos: Video[]
    relatedSlots: AlgoliaSearchResult[]
}

const palette = {
    darkBg: '#2e2e2e',
    extraDarkBg: '#1c1c1c',
    red: '#f95565',
}

const getCdnZone = (video) => {
    if (video.title === 'LIVE IMPROVVISATA! SPIKE SLOT ONLINE - 02/12/2021') {
        console.log('live')
        return 'https://d1t5qgqnsyejwx.cloudfront.net/-Mpzu-t4GBpw9M2ksScB/Default/HLS/-Mpzu-t4GBpw9M2ksScB.m3u8'
    }
    if (!video.conversionType)
        return `https://spikeconvertedcomplete.b-cdn.net/${video.videoId}/Default/HLS/${video.videoId}.m3u8`
    else return `https://spikeconverted720.b-cdn.net/${video.videoId}/Default/HLS/${video.videoId}.m3u8`
}

const VideoPage: FunctionComponent<Props> = ({ video, mainBonus, auxiliaryBonuses, relatedVideos, relatedSlots }) => {
    const router = useRouter()

    // const [showOverlay, setshowOverlay] = useState(video.time > 1660740000000 ? false : true)

    const [videoLink, setVideoLink] = useState(getCdnZone(video))
    const [descriptionOpen, setDescriptionOpen] = useState(false)

    const [userCountry, setUserCountry] = useState('it')
    useEffect(() => {
        geolocate()
    }, [])

    const geolocate = async () => {
        const country = await getUserCountryCode()
        setUserCountry(country)
    }

    const { t } = useContext(LocaleContext)

    const goToBonus = (link: string) => {
        window.open(link, '_self')
    }

    return (
        <Fragment>
            <Head>
                <title>SPIKE Slot | {video.title} [VIDEO]</title>
                <meta charSet='utf-8' />
                <link rel='canonical' href={getCanonicalPath()} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp='name' content={`Slot ${video.title} [VIDEO]`} />
                <meta
                    itemProp='description'
                    content={`${truncate(video.description, {
                        length: 155,
                    })} - ${video.title}`}
                />
                <meta
                    itemProp='image'
                    content={`https://firebasestorage.googleapis.com/v0/b/spike-2481d.appspot.com/o/VideoThumbnails%2Fthumb_500_${video.videoId}?alt=media`}
                />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={`Slot ${video.title} [VIDEO]`} />
                <meta
                    name='twitter:description'
                    content={`${truncate(video.description, {
                        length: 155,
                    })} - ${video.title}`}
                />
                <meta
                    name='twitter:image'
                    content={`https://firebasestorage.googleapis.com/v0/b/spike-2481d.appspot.com/o/VideoThumbnails%2Fthumb_500_${video.videoId}?alt=media`}
                />

                <meta
                    name='description'
                    content={`${truncate(video.description, {
                        length: 155,
                    })} - ${video.title}`}
                />
                <meta property='og:locale' content={'it'} />
                <meta property='og:type' content='video.movie' />
                <meta property='og:description' content={video.description} />
                <meta
                    property='og:site_name'
                    content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                />
                <meta property='article:tag' content={`Slot ${video.title} [VIDEO]`} />
                <meta property='article:published_time' content={video.time.toString()} />
                <meta
                    property='og:image'
                    content={`https://firebasestorage.googleapis.com/v0/b/spike-2481d.appspot.com/o/VideoThumbnails%2Fthumb_500_${video.videoId}?alt=media`}
                />
            </Head>

            <NavbarWithPlayer
                bonuses={[mainBonus, ...auxiliaryBonuses]}
                mainBonus={mainBonus}
                video={video}
                currentPage={`/video/${video.title}`}
            >
                <VideoMeta
                    name={video.title}
                    uploadDate={new Date(video.time).toISOString()}
                    description={video.description}
                    embedUrl={getMp4CDNZone(video)}
                    thumbnailUrl={`https://firebasestorage.googleapis.com/v0/b/spike-2481d.appspot.com/o/VideoThumbnails%2Fthumb_500_${video.videoId}?alt=media`}
                />
                <Body>
                    {userCountry === 'it' && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100vh',
                                zIndex: 30,
                                backdropFilter: 'blur(16px)',
                                userSelect: 'none',
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: 'Montserrat',
                                    display: 'flex',
                                    backgroundColor: 'white',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    margin: 'auto auto',
                                    width: '300px',
                                    textAlign: 'center',
                                    height: '200px',
                                    padding: '2rem',
                                    borderRadius: '6px',
                                }}
                            >
                                <div style={{ marginBottom: '1rem' }}>
                                    Questa pagina è temporaneamente inaccessibile dall'Italia
                                </div>
                                <div style={{ marginBottom: '1rem' }}>Stiamo lavorando per risolvere il problema</div>
                                <div
                                    onClick={() => window.open('https://spikeslotgratis.com')}
                                    style={{
                                        background: 'red',
                                        borderRadius: '6px',
                                        color: 'white',
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        marginTop: '3rem',
                                    }}
                                >
                                    Torna alla Home
                                </div>
                            </div>
                        </div>
                    )}
                    <div style={{ margin: '0rem 1rem', fontFamily: 'Raleway' }}>
                        <VideoMainData title={video.title} time={video.time} description={video.description} />

                        <MainBonusHeader>{t('Compare legal websites')}</MainBonusHeader>
                        <BonusStripe bonus={mainBonus} />

                        {auxiliaryBonuses.map((b) => (
                            <BonusStripe key={`${b.name}`} bonus={b} />
                        ))}

                        <OnlyDesktop>
                            <DesktopRelatedVideoContainer>
                                <RelatedVideosHeader>{t('Related Videos')}</RelatedVideosHeader>
                                {relatedVideos
                                    .filter((v) => v !== null)
                                    .map((relatedVideo, index) => (
                                        <RelatedVideoCard key={`related_video_${index}`} videoData={relatedVideo} />
                                    ))}
                            </DesktopRelatedVideoContainer>
                        </OnlyDesktop>

                        <OnlyBigScreens>
                            <RelatedBonusContainer>
                                <RelatedBonusHeader>{t('Recommended Bonuses')}</RelatedBonusHeader>
                                {[mainBonus, ...auxiliaryBonuses].map((b, index) => (
                                    <div
                                        style={{ marginBottom: '1rem', width: '100%' }}
                                        key={`${b.name}_side_${index}`}
                                    >
                                        <VideoSecondaryBonusCard bonus={b} />
                                    </div>
                                ))}
                            </RelatedBonusContainer>
                        </OnlyBigScreens>

                        <OnlyMobile>
                            <MobileRelatedVideoContainer>
                                <CompareHeader>{t('Related Videos')}</CompareHeader>
                                {relatedVideos
                                    .filter((v) => v !== null)
                                    .map((relatedVideo, index) => (
                                        <RelatedVideoCard key={`related_video_${index}`} videoData={relatedVideo} />
                                    ))}
                            </MobileRelatedVideoContainer>
                        </OnlyMobile>
                        <VideoRelatedSlots slotList={relatedSlots} />
                        <Divider style={{ margin: '2rem 0rem' }} color={'red'} />
                        <VideoDiscalimer />
                    </div>
                </Body>
            </NavbarWithPlayer>
        </Fragment>
    )
}

const MainBonusHeader = styled.h3`
    color: ${(props) => props.theme.colors.primary};
    font-family: ${(props) => props.theme.text.secondaryFont};
    font-size: 1.5rem;
    text-align: center;
    padding: 1rem;
`

const RelatedBonusContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;

    ${bigscreens} {
        position: absolute;
        flex-direction: column;
        top: -600px;
        left: -785px;
    }
`

const MobileRelatedVideoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`

const DesktopRelatedVideoContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;

    ${bigscreens} {
        position: absolute;
        flex-direction: column;
        top: -630px;
        right: -785px;
    }
`

const Body = styled.div`
    position: relative;
    background: ${palette.extraDarkBg};
    padding-bottom: 2rem;
    a {
        display: block;
    }
`

const CompareHeader = styled.h4`
    text-align: center;
    color: white;
    font-family: ${(props) => props.theme.text.primaryFont};
    font-weight: bold;
    text-transform: uppercase;
    padding: 1rem;
    font-size: 1.2rem;
`

const RelatedVideosHeader = styled.h4`
    text-align: center;
    color: white;
    font-family: ${(props) => props.theme.text.primaryFont};
    font-weight: bold;
    text-transform: uppercase;
    padding: 1rem;
    font-size: 1.2rem;
    border: 1px solid ${(props) => props.theme.colors.primary};
    border-radius: 6px;
    background: ${palette.darkBg};
`

const RelatedBonusHeader = styled.h4`
    text-align: center;
    color: white;
    font-family: ${(props) => props.theme.text.primaryFont};
    font-weight: bold;
    text-transform: uppercase;
    padding: 1rem;
    font-size: 1.2rem;
    border: 1px solid ${(props) => props.theme.colors.primary};
    border-radius: 6px;
    background: ${palette.darkBg};
    margin-bottom: 1rem;
`

export async function getServerSideProps({ query }) {
    const aquaClient = new AquaClient()

    const slug = query.slug as string
    const country = query.countryCode as string

    let videoId

    if (slug.startsWith('-')) videoId = slug
    else {
        const remappedVideoId = await axios.get(`${firebaseDatabaseUrl}/AwsVideoMappings/${slug}.json`)
        videoId = remappedVideoId
    }

    const videoData = (await (
        await axios.get(`${firebaseDatabaseUrl}/AwsVideosApproved/${videoId.data}.json`)
    ).data) as Video

    let mainBonusId = videoData.mainBonus
    let auxiliaryBonusesId = videoData.auxiliaryBonuses

    if (mainBonusId === '-MWZEr0i50xob0KQjDg-') mainBonusId = '-MdSpUnHqLArOEBb2xf6'

    // SSR substitution for pokerstars
    if (mainBonusId === '-MMLWVbpWopWE72ZoTz_') mainBonusId = substituteLegacyId
    if (auxiliaryBonusesId.includes('-MWZEr0i50xob0KQjDg-'))
        auxiliaryBonusesId.splice(auxiliaryBonusesId.indexOf('-MWZEr0i50xob0KQjDg-'), 1, '-MdSpUnHqLArOEBb2xf6')

    // SSR substitution for pokerstars
    if (auxiliaryBonusesId.includes('-MMLWVbpWopWE72ZoTz_'))
        auxiliaryBonusesId.splice(auxiliaryBonusesId.indexOf('-MMLWVbpWopWE72ZoTz_'), 1, substituteLegacyId)

    console.log(mainBonusId, auxiliaryBonusesId, 'BONUSES ids')

    const mainBonusRequest = aquaClient.query({
        query: GET_BONUS_BY_LEGACY_ID,
        variables: {
            legacyId: mainBonusId,
        },
    })

    const auxiliaryRequests = auxiliaryBonusesId.map((b) =>
        aquaClient.query({
            query: GET_BONUS_BY_LEGACY_ID,
            variables: {
                legacyId: b,
            },
        })
    )

    const relatedVideosRequest = videoData.relatedVideos.map((videoId) =>
        axios.get(`${firebaseDatabaseUrl}/AwsVideosApproved/${videoId}.json`)
    )

    let relatedSlotsRequest
    if (videoData.relatedSlots !== undefined) {
        relatedSlotsRequest = videoData.relatedSlots.map((relatedSlotId) => {
            if (relatedSlotId.startsWith('-'))
                return aquaClient.query({
                    query: GET_SLOT_BY_LEGACY_ID,
                    variables: {
                        legacyId: relatedSlotId,
                    },
                })
            else {
                return aquaClient.query({
                    query: GET_SLOT_CARD_BY_ID,
                    variables: {
                        id: relatedSlotId,
                    },
                })
            }
        })
    }

    let newRelatedSlotsRequest
    if (videoData.newRelatedSlots !== undefined) {
        newRelatedSlotsRequest = videoData.newRelatedSlots.map((relatedSlotId) => {
            return aquaClient.query({
                query: GET_SLOT_CARD_BY_ID,
                variables: {
                    id: relatedSlotId,
                },
            })
        })
    }

    const bonusResponses = await Promise.all([...auxiliaryRequests, mainBonusRequest])
    const relatedVideos = await Promise.all([...relatedVideosRequest])

    let newRelatedSlots
    if (newRelatedSlotsRequest) newRelatedSlots = await Promise.all([...newRelatedSlotsRequest])

    let relatedSlots
    if (relatedSlotsRequest) relatedSlots = await Promise.all([...relatedSlotsRequest])

    const mainBonus = bonusResponses.find((r) => r.data.data.bonuses[0].legacyId === mainBonusId)?.data.data.bonuses[0]
    const auxiliaryBonuses = bonusResponses
        .filter((r) => r.data.data.bonuses[0].legacyId !== mainBonusId)
        .map((r) => r.data.data.bonuses[0])

    const remappedSlots: Slot[] = []

    relatedSlots.forEach((rs) => {
        if (rs !== undefined) remappedSlots.push(rs.data.data.slots[0])
    })

    if (newRelatedSlots)
        newRelatedSlots.forEach((rs) => {
            if (rs !== undefined) remappedSlots.push(rs.data.data.slot)
        })

    return {
        props: {
            video: videoData,
            mainBonus: mainBonus,
            auxiliaryBonuses: auxiliaryBonuses,
            relatedVideos: relatedVideos.filter((o) => o.data !== undefined).map((res) => res.data),
            relatedSlots: remappedSlots.filter((it) => it !== null),
            countryCode: country,
        },
    }
}

export default VideoPage
