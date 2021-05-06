import React, { useState, FunctionComponent, Children, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { appTheme, AppTheme } from '../../theme/theme';
import SearchBox from './SearchBox';
import { laptop, desktop, tablet } from './../Responsive/Breakpoints';
import SearchInput from '../Input/SearchInput';
import Link from 'next/link';
import NavbarAams from '../Banners/NavbarAams';
import Footer from '../Footer/Footer';
import LazyLoad from 'react-lazyload';
import PushMenu from './Menu/PushMenu';
import BurgerMenuIcon from './BurgerMenuIcon';
import { SearchIndex } from 'algoliasearch';
import delay from 'lodash/delay';
import SearchResults from './SearchResults';
import MobileSearchResults from './MobileSearchResults';
import { countryContext } from '../../context/CountryContext';
import { AlgoliaSearchResult, Video, Bonus, Home } from '../../graphql/schema';
import FadeInOut from '../Ui/FadeInOut';
import LazyImage from '../Lazy/LazyImage';
import Player from '../Video/Player';
import VideoFooter from '../Footer/VideoFooter';
import { cookieContext } from '../../context/CookieContext';
import { initializeAnalytics } from '../../analytics/base';
import AquaClient from '../../graphql/aquaClient';
import { HOME } from '../../graphql/queries/home';
import MultiLevelDropdown from '../MultiLevelDropdown/MultiLevelDropdown';
import { HomeSchemaOrganization, HomeSchemaWebSite } from '../Schema/Website';
import Router from 'next/router';

interface Props {
    onDrawerOpen?: Function,
    onDrawerClose?: Function,
    currentPage: string,
    video: Video
    mainBonus: Bonus
    _bonuses :  Bonus[]
}

export interface NavbarPage {
    label: string
    link: string
}

const getCdnZone = video => {
    if (!video.conversionType) return `https://spikeconvertedcomplete.b-cdn.net/${video.videoId}/Default/HLS/${video.videoId}.m3u8`
    else return `https://spikeconverted720.b-cdn.net/${video.videoId}/Default/HLS/${video.videoId}.m3u8`
}

//TODO da tradurre
const drawerPages = [
    { label: 'Home', link: '/' },
    { label: 'Video', link: '/videos' },
    { label: 'Giochi Slot Machine Gratis', link: '/slots' },
    { label: 'Slot da Bar', link: '/slot-bar' },
    { label: 'Slot VLT', link: '/slot-vlt' },
    { label: 'Bonus di benvenuto', link: '/migliori-bonus-casino' },
    { label: 'Book of Ra Online', link: '/slot/book-of-ra-deluxe' },
    { label: 'Guide e Trucchi', link: '/guide-e-trucchi' },
    { label: 'Blog e Articoli', link: '/blog' },
    // { label: 'Altro', link: '/altro' }
]

const VideoPageNavbar: FunctionComponent<Props> = ({ onDrawerClose, onDrawerOpen, currentPage, children, video, mainBonus,  _bonuses }) => {

    const { currentCountry } = useContext(countryContext)
    const { cookiesAccepted, updateCookiesAccepted } = useContext(cookieContext)

    useEffect(() => {
        if (cookiesAccepted === 'accepted') initializeAnalytics(currentPage)
    }, [cookiesAccepted])

    const [algoliaIndex, setAlgoliaIndex] = useState<SearchIndex | undefined>(undefined)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchTimerId, setSearchTimerId] = useState<number | undefined>(undefined)
    const [exitBonuses, setExitBonuses] = useState<Bonus[] | undefined>(undefined)
    const [videoLink, setVideoLink] = useState(getCdnZone(video))

    const getExitBonuses = async () => {
        const aquaClient = new AquaClient()
        const data = await aquaClient.query({
            query: HOME,
            variables: { countryCode: currentCountry }
        })

        setExitBonuses(((data.data.data.homes[0] as Home).bonuses.bonus).map(b => b.bonus as Bonus))
    }

    useEffect(() => {
        getExitBonuses()
    }, [])


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

    useEffect(() => {
    }, [searchResults])

    const algoliaSearch = async (s: string) => {
        clearTimeout(searchTimerId)
        const newTimer = delay(async () => {
            const results = await algoliaIndex!.search(s, {
                filters: `country:${currentCountry}`
            })

            setSearchResults(results.hits.map((obj: any) => {
                return {
                    name: obj.name,
                    type: obj.type,
                    slug: obj.slug,
                    country: obj.country,
                    link: obj.link,
                    image: obj.image,
                    bonuses: obj.link,
                    rating: obj.rating
                }
            }))
        }, 400)
        setSearchTimerId(newTimer)
    }

    const [drawerOpen, setDrawerOpen] = useState(false)

    useEffect(() => {
    }, [drawerOpen])

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
            import('algoliasearch').then().then(algoliasearch => {
                const client = algoliasearch.default('92GGCDET16', 'fcbd92dd892fe6dc9b67fce3bf44fa04');
                const index = client.initIndex('entities');
                setAlgoliaIndex(index)
            })
        }
        setSearchValue(t)
    }

    const handleSearchFocusChange = (hasFocus: boolean) => setDim(hasFocus)

    const remapNavbarLink = (page: NavbarPage) => {

        const key = `drawer_page_${page.label}`

        if (page.link === '/') {
            return (
                <Link
                    key={key}
                    href={`/`}>
                    <a>{page.label}</a>
                </Link>
            )
        }

        if (page.link === '/migliori-bonus-casino') {
            return (
                <Link
                    key={key}
                    href={`/migliori-bonus-casino`}>
                    <a>{page.label}</a>
                </Link>
            )
        }

        if (page.link === '/videolist') {
            return (
                <Link
                    key={key}
                    href={`${page.link}/it`}>
                    <a>{page.label}</a>
                </Link>
            )
        }

        if (page.link === '/altro') {
            return (
                <MultiLevelDropdown
                    key={key}
                    label={'Altro'}
                    items={[
                        { label: 'Sistemi di pagamento', linkTo: '/pagamenti' },
                        { label: 'PayPal', linkTo: '/pagamenti' },
                        { label: 'Skrill', linkTo: '/pagamenti' },
                        { label: 'Neteller', linkTo: '/pagamenti' },
                        { label: 'Bonifico Bancario', linkTo: '/pagamenti' },
                    ]}
                />
            )
        }

        return (

            <Link
                key={key}
                href={page.link === '/' ? `${page.link}` : `${page.link}/${currentCountry}`}>
                <a>{page.label}</a>
            </Link>
        )
    }

    const [showExitBonuses, setShowExitBonuses] = useState(false)

    const handleUserAttemptingToExit = () => setShowExitBonuses(true)

    const handlePlayerReady = () => {
    }

    const InjectSchemaBasedOnCurrentPage = () => {
        if (currentPage === 'Home') {
            return (
                <div>
                    <HomeSchemaOrganization />
                    <HomeSchemaWebSite />
                </div>
            )
        }
        return <div></div>
    }

    const handleCookieAccepted = () => {
        updateCookiesAccepted(true)
    }

    const handleCookieRefused = () => {
        updateCookiesAccepted(false)
    }

    return <Wrapper currentPage={currentPage}>
        <InjectSchemaBasedOnCurrentPage />

        <NavbarWrapper searchOpen={searchOpen}>

            <MobileAndTablet>
                {!searchOpen && <SearchClosedContainer>

                    <BurgerMenuIcon
                        isOpen={drawerOpen}
                        onDrawerOpen={() => setDrawerOpen(true)}
                        onDrawerClose={() => setDrawerOpen(false)}
                    />

                    <LazyImage
                        width={60}
                        height={60}
                        alt='spike_slot_logo'
                        src={`${appTheme.brand.icon}`} />

                    <LazyImage
                        width={30}
                        height={30}
                        style={{ marginRight: '16px' }}
                        alt='search_icon'
                        onClick={() => handleSearchOpen()}
                        src='/icons/search_white.svg' />

                </SearchClosedContainer>}

                {searchOpen && <SearchBox
                    value={searchValue}
                    searchOpen={searchOpen}
                    onSearchChange={handleSearchChange}
                    onSearchClose={() => handleSearchClose()} />}
            </MobileAndTablet>

            <BigScreens>
                <div className='top-row'>

                    <LazyImage
                        onClick={() => Router.push('/')}
                        className='slot-icon'
                        width={180}
                        height={60}
                        alt='spike icon'
                        src='/icons/logo_spike_no_ombra.png' />

                    <NavbarAams />

                    <SearchInput
                        value={searchValue}
                        searchResults={searchResults}
                        onSearchFocusChange={handleSearchFocusChange}
                        onSearchChange={handleSearchChange} />
                </div>

                <div className='bottom-row'>
                    {drawerPages.map(page => remapNavbarLink(page))}
                </div>
            </BigScreens>
        </NavbarWrapper>

        <PushMenu
            tiles={drawerPages}
            state={drawerOpen}>
            <FadeInOut visible={!searchOpen}>
                <ChildrenWrapper>

                    <Player
                        _bonuses={_bonuses}
                        mainBonus={mainBonus}
                        bonusId={video.mainBonus}
                        highLights={video.highLights}
                        onPlayerReady={handlePlayerReady}
                        videoLink={videoLink}
                        autoplay={true} />

                    <OnlyPortrait>
                        <div>
                            {children}
                        </div>
                    </OnlyPortrait>

                </ChildrenWrapper>
                <OnlyPortrait>
                    <VideoFooter />
                </OnlyPortrait>
            </FadeInOut>
            {searchResults && searchOpen && <MobileSearchResults searchResults={searchResults} />}
        </PushMenu>
    </Wrapper >
}


const OnlyPortrait = styled.div`
    display : block;

    @media (orientation : landscape) and (max-height : 450px){
        display : ${() => 'none'};
    }
`
const ChildrenWrapper = styled.div`
    background : #1c1c1c;
    ${desktop}{
        margin : auto;
        width : 1200px;
    }
`
interface IWrapper {
    currentPage: string
}

const Wrapper = styled.div`
    display : flex;
    flex-direction : column;
    background : ${(props: IWrapper) => props.currentPage === 'video' && '#3b3b3b'};
`

type NavbarWrapperProps = {
    searchOpen: boolean;
    theme: AppTheme;
}

const NavbarWrapper = styled.div`
    position : relative;
    background : ${(props: NavbarWrapperProps, ) => !props.searchOpen ? props.theme.colors.primary : props.theme.colors.primaryDark};
    height : 96px;
    transition : background .4s ease-in;
    color : white;

    ${laptop}{
        display : flex; 
        height : 160px;
    }

    ${desktop}{
        padding-left : 14rem;
        padding-right : 14rem;
    }

    @media (orientation : landscape) and (max-height : 450px){
        display : ${() => 'none'};
    }
`

const SearchClosedContainer = styled.div`
    display : flex;
    position : absolute;
    justify-content : space-between;
    align-items : center;
    background : transparent;
    transform : translateY(-50%);
    top : 50%;
    left : 0;
    width : 100vw;
`

// RESPONSIVE
const MobileAndTablet = styled.div`
    display : block;

    ${laptop}{
        display : none;
    }
`

const BigScreens = styled.div`
    display : none;
    width : 100%;

    .slot-icon{
        transform : rotate(-25deg);
    }

    .top-row{
        display : flex;
        justify-content : space-between;
        align-items : center;
        padding : 1rem;
    }

    .bottom-row{
        display : flex;
        justify-content : space-between;
        align-items : center;
        padding : 1rem;   
    }

    ${laptop}{
        display : flex;
        flex-direction : column;
        justify-content : space-between;          
    }

    a{
        all : unset;
        cursor : pointer;
        font-size : 85%;
        border-radius : 4px;
        padding : .5rem;  
        transition : background .2s ease-in;
        color : white;
        font-weight : bold;
        :hover {
            background : ${(props) => props.theme.colors.primaryDark};
        }
    }    
`

export default VideoPageNavbar