import React, { useState, FunctionComponent, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { appTheme, AppTheme } from '../../theme/theme'
import SearchBox from './SearchBox'
import { laptop, desktop } from './../Responsive/Breakpoints'
import SearchInput from '../Input/SearchInput'
import Link from 'next/link'
import NavbarAams from '../Banners/NavbarAams'
import PushMenu from './Menu/PushMenu'
import BurgerMenuIcon from './BurgerMenuIcon'
import { SearchIndex } from 'algoliasearch'
import delay from 'lodash/delay'
import MobileSearchResults from './MobileSearchResults'
import { AlgoliaSearchResult, Video, Bonus } from '../../graphql/schema'
import FadeInOut from '../Ui/FadeInOut'
import LazyImage from '../Lazy/LazyImage'
import Player from '../Video/Player'
import VideoFooter from '../Footer/VideoFooter'
import Router from 'next/router'
import { cookieContext } from '../../context/CookieContext'
import { initializeAnalytics } from '../../analytics/base'
import { LocaleContext } from '../../context/LocaleContext'
import NewAnchorTag from '../Singles/NewAnchorTag'
import { Menu, MenuItem } from '@material-ui/core'
import router from 'next/router'

interface Props {
    onDrawerOpen?: Function
    onDrawerClose?: Function
    currentPage: string
    video: Video
    mainBonus: Bonus
    bonuses: Bonus[]
}

export interface NavbarPage {
    label: string
    link: string
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

export const getMp4CDNZone = (video) => {
    return `https://spike-watchfolder.s3.eu-central-1.amazonaws.com/inputs/${video.videoId}`
}

//TODO da tradurre
const drawerPages = [
    { label: 'Home', link: '/' },
    { label: 'Video', link: '/videos' },
    { label: 'Free Slot Machine Games', link: '/slots' },
    { label: 'Bar Slot', link: '/slot-bar' },
    { label: 'VLT slot', link: '/slot-vlt' },
    { label: 'LiveStats', link: '/live-stats' },
    { label: 'Welcome bonus', link: '/migliori-bonus-casino' },
    { label: 'Book of Ra Online', link: '/slot/book-of-ra-deluxe' },
    { label: 'Guides and Tricks', link: '/guide-e-trucchi' },
    { label: 'Blogs and Articles', link: '/blog' },
    { label: 'Investimenti Online', link: '/guide/lab' },
]

const NavbarWithPlayer: FunctionComponent<Props> = ({
    onDrawerClose,
    onDrawerOpen,
    currentPage,
    children,
    video,
    mainBonus,
    bonuses,
}) => {
    const [algoliaIndex, setAlgoliaIndex] = useState<SearchIndex | undefined>(undefined)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchTimerId, setSearchTimerId] = useState<number | undefined>(undefined)
    const [videoLink, setVideoLink] = useState(getCdnZone(video))

    const { cookiesAccepted, updateCookiesAccepted } = useContext(cookieContext)

    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const { t, contextCountry } = useContext(LocaleContext)

    useEffect(() => {
        if (cookiesAccepted === 'accepted') {
            initializeAnalytics(currentPage)
        }
    }, [cookiesAccepted])

    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        if (searchValue.length !== 0) {
            if (algoliaIndex) algoliaSearch(searchValue)
        } else {
            clearTimeout(searchTimerId)
            setSearchResults(undefined)
        }
    }, [searchValue])

    const [searchResults, setSearchResults] = useState<AlgoliaSearchResult[] | undefined>(undefined)

    useEffect(() => {}, [searchResults])

    const algoliaSearch = async (s: string) => {
        clearTimeout(searchTimerId)
        const newTimer = delay(async () => {
            const results = await algoliaIndex!.search(s, {
                filters: `country:${contextCountry}`,
            })

            setSearchResults(
                results.hits.map((obj: any) => {
                    return {
                        name: obj.name,
                        type: obj.type,
                        slug: obj.slug,
                        country: obj.country,
                        image: obj.image,
                        bonuses: obj.link,
                        rating: obj.rating,
                        mainBonus: {
                            link: obj.link,
                        },
                    }
                })
            )
        }, 400)
        setSearchTimerId(newTimer)
    }

    const [drawerOpen, setDrawerOpen] = useState(false)

    useEffect(() => {}, [drawerOpen])
    const [dim, setDim] = useState(false)

    const handleDrawerOpen = () => {
        setDrawerOpen(true)
        onDrawerOpen && onDrawerOpen()
    }

    const handleDrawerClose = () => {
        setDrawerOpen(false)
        onDrawerClose && onDrawerClose()
    }

    const handleSearchOpen = () => {
        setSearchOpen(true)
        if (drawerOpen) setDrawerOpen(false)
    }

    const handleSearchClose = () => {
        setSearchOpen(false)
    }

    const handleSearchChange = async (t: string) => {
        if (algoliaIndex === undefined) {
            import('algoliasearch').then().then((algoliasearch) => {
                const client = algoliasearch.default('92GGCDET16', 'fcbd92dd892fe6dc9b67fce3bf44fa04')
                const index = client.initIndex('entities')
                setAlgoliaIndex(index)
            })
        }
        setSearchValue(t)
    }

    const handleSearchFocusChange = (hasFocus: boolean) => setDim(hasFocus)

    const handlePlayerReady = () => {}

    const remapNavbarLink = (page: NavbarPage) => {
        const key = `drawer_page_${page.label}`

        if (page.link === '/') {
            return (
                <Link key={key} href={`/`}>
                    <a>{t(page.label)}</a>
                </Link>
            )
        }

        if (page.link === '/live-stats') {
            return (
                <div>
                    <NewAnchorTag text={'Statistiche Live'} onClick={handleClick} />
                    <Menu
                        id='live-stats-menu'
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => router.push(`/live-stats/crazy-time/${contextCountry}`)}>
                            Crazy Time
                        </MenuItem>
                        <MenuItem onClick={() => router.push(`/live-stats/monopoly-live/${contextCountry}`)}>
                            Monopoly
                        </MenuItem>
                        <MenuItem onClick={() => router.push(`/live-stats/dream-catcher/${contextCountry}`)}>
                            Dream Catcher
                        </MenuItem>
                        <MenuItem onClick={() => router.push(`/live-stats/lightning-dice/${contextCountry}`)}>
                            Lightning Dice
                        </MenuItem>
                    </Menu>
                </div>
            )
        }

        // if (page.link === '/live-stats/crazy-time') {
        //     return (
        //         <NewAnchorTag
        //             key={key}
        //             href={`${page.link}/${contextCountry}`}
        //             text={t("CrazyTimeNavbar")} />
        //     )
        // }

        if (page.link === '/migliori-bonus-casino') {
            return (
                <Link key={key} href={`/migliori-bonus-casino`}>
                    <a>{t(page.label)}</a>
                </Link>
            )
        }

        if (page.link === '/videolist') {
            return (
                <Link key={key} href={`${page.link}`}>
                    <a>{t(page.label)}</a>
                </Link>
            )
        }

        if (page.link === '/guide/lab') {
            return (
                <a key={key} href={`${page.link}`}>
                    {t(page.label)}
                </a>
            )
        }

        return (
            <Link key={key} href={page.link === '/' ? `${page.link}` : `${page.link}/${contextCountry}`}>
                <a>{t(page.label)}</a>
            </Link>
        )
    }

    return (
        <Wrapper>
            <NavbarWrapper searchOpen={searchOpen}>
                <MobileAndTablet>
                    {!searchOpen && (
                        <SearchClosedContainer>
                            <BurgerMenuIcon
                                isOpen={drawerOpen}
                                onDrawerOpen={() => setDrawerOpen(true)}
                                onDrawerClose={() => setDrawerOpen(false)}
                            />

                            <LazyImage width={60} height={60} alt='spike_slot_logo' src={`${appTheme.brand.icon}`} />

                            <LazyImage
                                width={30}
                                height={30}
                                style={{ marginRight: '16px' }}
                                alt='search_icon'
                                onClick={() => handleSearchOpen()}
                                src='/icons/search_white.svg'
                            />
                        </SearchClosedContainer>
                    )}

                    {searchOpen && (
                        <SearchBox
                            value={searchValue}
                            searchOpen={searchOpen}
                            onSearchChange={handleSearchChange}
                            onSearchClose={() => handleSearchClose()}
                        />
                    )}
                </MobileAndTablet>

                <BigScreens>
                    <div className='top-row'>
                        <LazyImage
                            onClick={() => Router.push('/')}
                            className='slot-icon'
                            width={180}
                            height={60}
                            alt='spike icon'
                            src='/icons/logo_spike_no_ombra.png'
                        />

                        <NavbarAams />

                        <SearchInput
                            value={searchValue}
                            searchResults={searchResults}
                            onSearchFocusChange={handleSearchFocusChange}
                            onSearchChange={handleSearchChange}
                        />
                    </div>

                    <div className='bottom-row'>{drawerPages.map((page) => remapNavbarLink(page))}</div>
                </BigScreens>
            </NavbarWrapper>

            <PushMenu tiles={drawerPages} state={drawerOpen}>
                <FadeInOut visible={!searchOpen}>
                    <ChildrenWrapper>
                        <Player
                            _bonuses={bonuses}
                            mainBonus={mainBonus}
                            bonusId={video.mainBonus}
                            highLights={video.highLights}
                            onPlayerReady={handlePlayerReady}
                            videoLink={videoLink}
                            autoplay={true}
                        />

                        <OnlyPortrait>
                            <div>{children}</div>
                        </OnlyPortrait>
                    </ChildrenWrapper>
                    <OnlyPortrait>
                        <VideoFooter />
                    </OnlyPortrait>
                </FadeInOut>
                {searchResults && searchOpen && <MobileSearchResults searchResults={searchResults} />}
            </PushMenu>
        </Wrapper>
    )
}

const OnlyPortrait = styled.div`
    display: block;

    @media (orientation: landscape) and (max-height: 450px) {
        display: ${() => 'none'};
    }
`
const ChildrenWrapper = styled.div`
    background: #1c1c1c;
    ${desktop} {
        margin: auto;
        width: 1200px;
    }
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    background: #3b3b3b;
`

type NavbarWrapperProps = {
    searchOpen: boolean
    theme: AppTheme
}

const NavbarWrapper = styled.div`
    position: relative;
    background: ${(props: NavbarWrapperProps) =>
        !props.searchOpen ? props.theme.colors.primary : props.theme.colors.primaryDark};
    height: 96px;
    transition: background 0.4s ease-in;
    color: white;
    font-family: 'Raleway', sans-serif !important;

    ${laptop} {
        display: flex;
        height: 160px;
    }

    ${desktop} {
        padding-left: 14rem;
        padding-right: 14rem;
    }

    @media (orientation: landscape) and (max-height: 450px) {
        display: ${() => 'none'};
    }
`

const SearchClosedContainer = styled.div`
    display: flex;
    position: absolute;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    transform: translateY(-50%);
    top: 50%;
    left: 0;
    width: 100vw;
`

// RESPONSIVE
const MobileAndTablet = styled.div`
    display: block;

    ${laptop} {
        display: none;
    }
`

const BigScreens = styled.div`
    display: none;
    width: 100%;

    .slot-icon {
        cursor: pointer;
    }

    .top-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }

    .bottom-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }

    ${laptop} {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    a {
        all: unset;
        cursor: pointer;
        font-size: 85%;
        border-radius: 4px;
        padding: 0.5rem;
        transition: background 0.2s ease-in;
        color: white;
        font-weight: bold;
        :hover {
            background: ${(props) => props.theme.colors.primaryDark};
        }
    }
`

export default NavbarWithPlayer
