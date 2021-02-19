import React, { useState, FunctionComponent, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { appTheme, AppTheme } from '../../theme/theme';
import SearchBox from './SearchBox';
import { laptop, desktop } from './../Responsive/Breakpoints';
import SearchInput from '../Input/SearchInput';
import Link from 'next/link';
import NavbarAams from '../Banners/NavbarAams';
import Footer from '../Footer/Footer';
import PushMenu from './Menu/PushMenu';
import BurgerMenuIcon from './BurgerMenuIcon';
import { SearchIndex } from 'algoliasearch';
import delay from 'lodash/delay';
import MobileSearchResults from './MobileSearchResults';
import { AlgoliaSearchResult, Bonus, Home } from '../../graphql/schema';
import FadeInOut from '../Ui/FadeInOut';
import LazyImage from '../Lazy/LazyImage';
import ExitBonuses from '../Lists/ExitBonuses';
import AquaClient from '../../graphql/aquaClient';
import { HOME } from '../../graphql/queries/home';
import {  HomeSchemaWebSite, HomeSchemaOrganization } from '../Schema/Website';
import {useRouter} from 'next/router';
import MultiLevelDropdown from '../MultiLevelDropdown/MultiLevelDropdown';
import { cookieContext } from '../../context/CookieContext';
import CookieDisclaimer from '../CookieDisclaimer/CookieDisclaimer';
import { initializeAnalytics } from '../../analytics/base';
import { useTranslation } from "react-i18next";

interface Props {
    onDrawerOpen?: Function,
    onDrawerClose?: Function,
    currentPage: string,
    countryCode:string
}

export interface NavbarPage {
    label: string
    link: string
}


//TODO da tradurre
const drawerPages = [
    { label: 'Home', link: '/' },
    { label: 'Video', link: '/videos' },
    { label: 'Free Slot Machine Games', link: '/slots' },
    { label: 'Bar Slot', link: '/slot-bar' },
    { label: 'VLT slot', link: '/slot-vlt' },
    { label: 'Welcome bonus', link: '/migliori-bonus-casino' },
    { label: 'Book of Ra Online', link: '/slot/book-of-ra-deluxe' },
    { label: 'Guides and Tricks', link: '/guide-e-trucchi' },
    { label: 'Blogs and Articles', link: '/blog' },
    // { label: 'Altro', link: '/altro' }
]


const NavbarProvider: FunctionComponent<Props> = ({ onDrawerClose, onDrawerOpen, currentPage, children,countryCode }) => {
    
    const { cookiesAccepted, updateCookiesAccepted } = useContext(cookieContext)

    const { t } = useTranslation()

    const router = useRouter()
    
    useEffect(() => {
        if (cookiesAccepted === 'accepted') {
            initializeAnalytics(currentPage)
        }
    }, [cookiesAccepted])


    const [algoliaIndex, setAlgoliaIndex] = useState<SearchIndex | undefined>(undefined)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchTimerId, setSearchTimerId] = useState<number | undefined>(undefined)
    const [exitBonuses, setExitBonuses] = useState<Bonus[] | undefined>(undefined)

    const getExitBonuses = async () => {        
        const aquaClient = new AquaClient()

        const data = await aquaClient.query({
            query: HOME,
            variables: { countryCode: countryCode }
        })

        let data1:any

        if (data.data.data.homes[0] == undefined) {
            data1 = await aquaClient.query({
            query: HOME,
            variables: { countryCode: 'row'}
        }) }

        setExitBonuses(((data.data.data.homes[0]?data.data.data.homes[0]:data1.data.data.homes[0] as Home).bonuses?.bonus).map(b => b.bonus as Bonus))
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
                filters: `country:${countryCode}`
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
                    <a>{t("Home")}</a>
                </Link>
            )
        }

        if (page.link === '/migliori-bonus-casino') {
            return (
                <Link
                    key={key}
                    href={`/migliori-bonus-casino`}>
                    <a>{t(page.label)}</a>
                </Link>
            )
        }

        if (page.link === '/videolist') {
            return (
                <Link
                    key={key}
                    href={`${page.link}/${countryCode}`}>
                    <a>{t(page.label)}</a>
                </Link>
            )
        }

        if (page.link === '/altro') {
            return (
                <MultiLevelDropdown
                    key={key}
                    label={t('Altro')}
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
            <a
                key={key}
                href={page.link === '/' ? `${page.link}` : `${page.link}/${countryCode}`}>
                {t(page.label)}
            </a>
        )
    }

    const [showExitBonuses, setShowExitBonuses] = useState(false)

    const handleUserAttemptingToExit = () => setShowExitBonuses(true)

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

    return <Wrapper currentPage={currentPage} style={{ background: '#fafafa' }}>
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
                        onClick={() => router.push('/')}
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
                {searchResults && searchOpen && <MobileSearchResults searchResults={searchResults} />}
            </MobileAndTablet>

            <BigScreens>
                <div className='top-row'>

                    <LazyImage
                        onClick={() => router.push('/')}
                        className='slot-icon'
                        width={180}
                        height={60}
                        alt='spike icon'
                        src='https://spikewebsitemedia.b-cdn.net/logo_spike_no_ombra.png' />

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
                <ChildrenWrapper style={{ background: 'white' }}>
                    {showExitBonuses && exitBonuses && <ExitBonuses
                        onClickOutside={() => setShowExitBonuses(false)}
                        bonuses={exitBonuses.slice(0, 3)} />}
                    {children}
                </ChildrenWrapper>
                <Footer />
            </FadeInOut>
            {cookiesAccepted === 'unknown' && <CookieDisclaimer onCookiesAccepted={() => handleCookieAccepted()} onCookiesRefused={() => handleCookieRefused()} />}
        </PushMenu>
    </Wrapper>
}

const Dimmer = styled.div`
    position : absolute;
    background : rgba(0,0,0, 0.2);
    width : 100%;
    height : calc(100vh - 160px);
    z-index : 99;
    flex-grow : 1;
    top : 160px;
    transition : background .3s ease-in;
`

const ChildrenWrapper = styled.div`
    
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


const SlotIcon = styled.img`
    width : 60px;
    height : 60px;
    transform : rotate(-25deg);
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
        cursor : pointer;
        /* transform : rotate(-25deg); */
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

        ${desktop}{
            
        }

        :hover {
            background : ${(props) => props.theme.colors.primaryDark};
        }
    }    
`

export default NavbarProvider

