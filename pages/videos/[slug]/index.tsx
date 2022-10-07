import React, { Fragment, useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'
import { Video, AlgoliaVideo } from '../../../graphql/schema'
import { getInitialVideos } from '../../../data/api/video'
import { getCanonicalPath, getUserCountryCode } from '../../../utils/Utils'
import { loadNextVideoListChunk } from '../../../data/api/video'
import { orderBy, pickBy, delay } from 'lodash'
import VideoListSearchInput from '../../../components/Search/VideoListSearch'
import { SearchIndex } from 'algoliasearch'
import VideoListComponent from '../../../components/Lists/VideoListComponent'
import LatestVideoCardList from '../../../components/Cards/LatestVideoCardList'
import Head from 'next/head'
import { laptop } from '../../../components/Responsive/Breakpoints'
import { useRouter } from 'next/router'
import { LocaleContext } from '../../../context/LocaleContext'
import AquaClient from '../../../graphql/aquaClient'
import { HOME } from '../../../graphql/queries/home'

interface Props {
    latestVideo: AlgoliaVideo
    initialVideos: AlgoliaVideo[]
    initialLatestVideoInListTime: number
    countryCode: string
}

const VideoList: FunctionComponent<Props> = ({
    latestVideo,
    initialVideos,
    initialLatestVideoInListTime,
    countryCode,
}) => {
    const [videoList, setVideoList] = useState<AlgoliaVideo[] | undefined>(initialVideos)
    const [lastVideoTime, setLastVideoTime] = useState<number>(initialLatestVideoInListTime)
    const [showNewest, setShowNewest] = useState(true)
    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)
    // search
    const [searchValue, setSearchValue] = useState('')
    const [algoliaVideoIndex, setAlgoliaVideoIndex] = useState<SearchIndex | undefined>(undefined)
    const [searchTimerId, setSearchTimerId] = useState<number | undefined>(undefined)
    const [searchResults, setsearchResults] = useState<AlgoliaVideo[] | undefined>(undefined)
    const router = useRouter()

    useEffect(() => {
        if (searchValue !== undefined && searchValue.length !== 0) searchVideo(searchValue)
        else {
            clearTimeout(searchTimerId)
            setsearchResults(undefined)
        }
    }, [searchValue])

    useEffect(() => {}, [videoList])

    const searchVideo = (query: string) => {
        clearTimeout(searchTimerId)

        if (algoliaVideoIndex !== undefined) {
            // ricerca normale
            const newTimer = delay(() => {
                algoliaVideoIndex.search(query).then(({ hits }) => {
                    const converted = hits.map((hit: any) => {
                        return {
                            videoId: hit.videoId,
                            title: hit.title,
                            description: hit.description,
                            time: hit.time,
                            slotType: hit.type,
                        }
                    })
                    setsearchResults(converted)
                })
            }, 300)
            setSearchTimerId(newTimer)
        } else {
            // fallback nel caso in cui per qualche strano motivo non sia stato importato algolia
            import('algoliasearch').then((algoliasearch) => {
                const client = algoliasearch.default('92GGCDET16', 'fcbd92dd892fe6dc9b67fce3bf44fa04')
                const index = client.initIndex('videos')
                setAlgoliaVideoIndex(index)
                const newTimer = delay(() => {
                    index.search(query).then(({ hits }) => {
                        const converted = hits.map((hit: any) => {
                            return {
                                videoId: hit.videoId,
                                title: hit.title,
                                description: hit.description,
                                time: hit.time,
                                slotType: hit.type,
                            }
                        })
                        setsearchResults(converted)
                    })
                }, 300)
                setSearchTimerId(newTimer)
            })
        }
    }

    const loadMore = async () => {
        loadNextVideoListChunk(lastVideoTime, (nextChunk) => {
            const onlyVisibleAndOrdered = orderBy(
                pickBy(nextChunk, (video) => video.visibility === 'VISIBLE'),
                ['time'],
                ['desc']
            )
            const lastVideoInChunk: AlgoliaVideo | undefined = onlyVisibleAndOrdered.pop()
            setVideoList([...videoList!, ...onlyVisibleAndOrdered])
            if (lastVideoInChunk) setLastVideoTime(lastVideoInChunk.time)
        })
    }

    const handleSearchChange = (searchString: string) => setSearchValue(searchString)

    const handleSearchFocusChange = (hasFocus: boolean) => {
        if (hasFocus && algoliaVideoIndex === undefined) {
            import('algoliasearch').then((algoliasearch) => {
                const client = algoliasearch.default('92GGCDET16', 'fcbd92dd892fe6dc9b67fce3bf44fa04')
                const index = client.initIndex('videos')
                setAlgoliaVideoIndex(index)
            })
        }
    }

    const [uc, setUc] = useState('it')
    useEffect(() => {
        geolocate()
    }, [])

    const geolocate = async () => {
        const country = await getUserCountryCode()
        setUc(country)
    }

    return (
        <Fragment>
            <Head>
                <title>Video Slot | SPIKE</title>
                <meta charSet='utf-8' />
                <meta property='og:locale' content={contextCountry} />
                <meta
                    name='description'
                    content={
                        'In questa pagina troverete TUTTI i video di SPIKE! Cerca la tua slot preferiti, mettiti comodo e goditi lo spettacolo senza pubblicità'
                    }
                />
                <meta http-equiv='content-language' content={'it-IT'} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp='name' content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
                <meta
                    itemProp='description'
                    content={
                        'In questa pagina troverete TUTTI i video di SPIKE! Cerca la tua slot preferiti, mettiti comodo e goditi lo spettacolo senza pubblicità'
                    }
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
                    content={
                        'In questa pagina troverete TUTTI i video di SPIKE! Cerca la tua slot preferiti, mettiti comodo e goditi lo spettacolo senza pubblicità'
                    }
                />
                <meta name='twitter:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                <meta property='article:tag' content={`Slot Online Video`} />
                <meta property='article:tag' content={`Slot Gratis Video`} />
                <meta property='article:tag' content={`Slot Machine Video`} />
                <link rel='canonical' href={getCanonicalPath()} />
                <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property='og:locale' content={'it'} />
                <meta property='og:type' content='article' />
                <meta
                    property='og:description'
                    content='In questa pagina troverete TUTTI i video di SPIKE! Cerca la tua slot preferiti, mettiti comodo e goditi lo spettacolo senza pubblicità'
                />
                <meta
                    property='og:site_name'
                    content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                />
            </Head>

            <NavbarProvider currentPage='/videolist' countryCode={countryCode}>
                {uc === 'it' && (
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
                <Body>
                    <HeaderContainer>
                        <div
                            style={{
                                maxWidth: '450px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <h1 className='header-title'>{t('VideoTextContent1')}</h1>
                            <p className='inner-p' dangerouslySetInnerHTML={{ __html: t('VideoTextContent2') }}>
                                {}
                            </p>
                        </div>

                        <img className='big-spike' alt='spike-cartoon' src='/images/spike-diamond.png' />
                    </HeaderContainer>

                    <LatestVideoCardList videoData={latestVideo} />

                    <VideoListSearchInput
                        countryCode={contextCountry}
                        onSearchChange={handleSearchChange}
                        onSearchFocusChange={handleSearchFocusChange}
                        value={searchValue}
                    />
                    <VideoListComponent showNewest={showNewest} videoList={searchResults ? searchResults : videoList} />
                    {!searchResults && <button onClick={() => loadMore()}>{t('Upload more videos')}</button>}
                </Body>
            </NavbarProvider>
        </Fragment>
    )
}

const HeaderContainer = styled.div`
    display: flex;
    flex-wrap: wrap-reverse;
    justify-content: space-around;
    .header-title {
        font-family: ${(props) => props.theme.text.secondaryFont};
        color: ${(props) => props.theme.colors.primary};
        font-size: 1.5rem;
        padding: 1rem;
    }

    p {
        padding: 1rem;
        padding-top: 0;
    }

    .inner-p {
        a {
            color: #b5099b;
            font-family: Kanit;
        }
    }

    .big-spike {
        width: 100%;

        ${laptop} {
            width: 30%;
        }
    }
`

const Body = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        padding: 1rem;
    }

    button {
        cursor: pointer;
        padding: 1rem 2rem;
        margin: 1rem;
        font-family: ${(props) => props.theme.text.primaryFont};
        color: white;
        background: ${(props) => props.theme.colors.primary};
        border: none;
        border-radius: 4px;
        transition: all 0.3s ease-in-out;
        :hover {
            filter: brightness(1.2);
        }
    }
`

export async function getServerSideProps({ query }) {
    const country = query.slug as string
    const initialVideos = await getInitialVideos()
    const onlyVisibleAndOrdered = orderBy(
        pickBy(initialVideos, (video) => video.visibility === 'VISIBLE'),
        ['time'],
        ['desc']
    )
    const lastVideoInChunk: Video | undefined = onlyVisibleAndOrdered.pop()

    return {
        props: {
            latestVideo: onlyVisibleAndOrdered.shift(),
            initialVideos: onlyVisibleAndOrdered,
            initialLatestVideoInListTime: lastVideoInChunk?.time,
            countryCode: country,
        },
    }
}

export default VideoList
