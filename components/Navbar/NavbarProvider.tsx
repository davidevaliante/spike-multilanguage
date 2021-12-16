import React, { useState, FunctionComponent, useEffect, useContext } from "react"
import styled from "styled-components"
import { appTheme, AppTheme } from "../../theme/theme"
import SearchBox from "./SearchBox"
import { laptop, desktop } from "./../Responsive/Breakpoints"
import SearchInput from "../Input/SearchInput"
import NavbarAams from "../Banners/NavbarAams"
import Footer from "../Footer/Footer"
import PushMenu from "./Menu/PushMenu"
import BurgerMenuIcon from "./BurgerMenuIcon"
import { SearchIndex } from "algoliasearch"
import delay from "lodash/delay"
import MobileSearchResults from "./MobileSearchResults"
import { AlgoliaSearchResult } from "../../graphql/schema"
import FadeInOut from "../Ui/FadeInOut"
import LazyImage from "../Lazy/LazyImage"
import { HomeSchemaWebSite, HomeSchemaOrganization } from "../Schema/Website"
import { useRouter } from "next/router"
import MultiLevelDropdown from "../MultiLevelDropdown/MultiLevelDropdown"
import { cookieContext } from "../../context/CookieContext"
import CookieDisclaimer from "../CookieDisclaimer/CookieDisclaimer"
import { initializeAnalytics } from "../../analytics/base"
import CountrySelect from "./CountrySelect"
import { LocaleContext } from "../../context/LocaleContext"
import NewAnchorTag from "../Singles/NewAnchorTag"
import { Menu, MenuItem } from "@material-ui/core"

interface Props {
    onDrawerOpen?: Function
    onDrawerClose?: Function
    currentPage: string
    countryCode: string
}

export interface NavbarPage {
    label: string
    link: string
}

const NavbarProvider: FunctionComponent<Props> = ({
    onDrawerClose,
    onDrawerOpen,
    currentPage,
    children,
    countryCode,
}) => {
    const p = [
        { label: "Home", link: "/" },
        { label: "Video", link: "/videos" },
        { label: "Free Slot Machine Games", link: "/slots" },
        { label: "Bar Slot", link: "/slot-bar" },
        { label: "VLT slot", link: "/slot-vlt" },
        { label: "LiveStats", link: "/live-stats" },

        { label: "Book of Ra Online", link: "/slot/book-of-ra-deluxe" },

        { label: "Blogs and Articles", link: "/blog" },
    ]

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
        let copy = [...p]
        if (contextCountry === "it") {
            copy.splice(6, 0, { label: "Welcome bonus", link: "/migliori-bonus-casino" })
            copy.splice(8, 0, { label: "Guides and Tricks", link: "/guide-e-trucchi" })
        }
        if (contextCountry === "row" || contextCountry === "ca") {
            copy.splice(6, 0, { label: "Welcome bonus", link: `/best-casino-bonus` })
            copy.splice(8, 0, { label: "Guides and Tricks", link: "/guides-and-tricks" })
            copy.splice(1, 1)
        }
        setDrawerPages(copy)
    }, [contextCountry])

    const router = useRouter()

    useEffect(() => {
        if (cookiesAccepted === "accepted") {
            initializeAnalytics(currentPage)
        }
    }, [cookiesAccepted])

    const [drawerPages, setDrawerPages] = useState<{ label: string; link: string }[]>([])
    const [algoliaIndex, setAlgoliaIndex] = useState<SearchIndex | undefined>(undefined)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchTimerId, setSearchTimerId] = useState<number | undefined>(undefined)

    const [searchValue, setSearchValue] = useState("")

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
                        link: obj.link,
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
            import("algoliasearch").then().then((algoliasearch) => {
                const client = algoliasearch.default("92GGCDET16", "fcbd92dd892fe6dc9b67fce3bf44fa04")
                const index = client.initIndex("entities")
                setAlgoliaIndex(index)
            })
        }
        setSearchValue(t)
    }

    const handleSearchFocusChange = (hasFocus: boolean) => setDim(hasFocus)

    const remapNavbarLink = (page: NavbarPage) => {
        const key = `drawer_page_${page.label}`

        if (page.link === "/") {
            return (
                <a key={key} href={contextCountry === "it" ? `/` : `/${contextCountry}`}>
                    {t("Home")}
                </a>
            )
        }

        if (page.link === "/live-stats") {
            return (
                <div>
                    <NewAnchorTag rel="nofollow" href="#" text={t(page.label)} onClick={handleClick} />
                    <Menu
                        id="live-stats-menu"
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

        if (page.link === "/migliori-bonus-casino") {
            return (
                <a key={key} href={`/migliori-bonus-casino`}>
                    {t(page.label)}
                </a>
            )
        }

        if (page.link === "/videolist") {
            return (
                <a key={key} href={`${page.link}/${countryCode}`}>
                    {t(page.label)}
                </a>
            )
        }

        if (page.link === "/altro") {
            return (
                <MultiLevelDropdown
                    key={key}
                    label={t("Altro")}
                    items={[
                        { label: "Sistemi di pagamento", linkTo: "/pagamenti" },
                        { label: "PayPal", linkTo: "/pagamenti" },
                        { label: "Skrill", linkTo: "/pagamenti" },
                        { label: "Neteller", linkTo: "/pagamenti" },
                        { label: "Bonifico Bancario", linkTo: "/pagamenti" },
                    ]}
                />
            )
        }

        return (
            <a key={key} href={page.link === "/" ? `${page.link}` : `${page.link}/${countryCode}`}>
                {t(page.label)}
            </a>
        )
    }

    const InjectSchemaBasedOnCurrentPage = () => {
        if (currentPage === "Home") {
            return (
                <div>
                    <HomeSchemaOrganization />
                    <HomeSchemaWebSite />
                </div>
            )
        }
        return <div></div>
    }

    const handleCookieAccepted = () => updateCookiesAccepted(true)

    const handleCookieRefused = () => updateCookiesAccepted(false)

    return (
        <Wrapper currentPage={currentPage} style={{ background: "#fafafa" }}>
            <InjectSchemaBasedOnCurrentPage />
            <NavbarWrapper searchOpen={searchOpen}>
                <MobileAndTablet>
                    {!searchOpen && (
                        <SearchClosedContainer>
                            <BurgerMenuIcon
                                isOpen={drawerOpen}
                                onDrawerOpen={() => setDrawerOpen(true)}
                                onDrawerClose={() => setDrawerOpen(false)}
                            />

                            <LazyImage
                                onClick={() =>
                                    contextCountry === "it" ? router.push("/") : router.push(`/${contextCountry}`)
                                }
                                width={60}
                                height={60}
                                alt="spike_slot_logo"
                                src={`${appTheme.brand.icon}`}
                            />

                            <LazyImage
                                width={30}
                                height={30}
                                style={{ marginRight: "16px" }}
                                alt="search_icon"
                                onClick={() => handleSearchOpen()}
                                src="/icons/search_white.svg"
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
                    {searchResults && searchOpen && <MobileSearchResults searchResults={searchResults} />}
                </MobileAndTablet>

                <BigScreens>
                    <div className="top-row">
                        <LazyImage
                            onClick={() =>
                                contextCountry === "it" ? router.push("/") : router.push(`/${contextCountry}`)
                            }
                            className="slot-icon"
                            width={180}
                            height={60}
                            alt="spike icon"
                            src="https://spikewebsitemedia.b-cdn.net/logo_spike_no_ombra.png"
                        />

                        <NavbarAams />

                        <SearchInput
                            value={searchValue}
                            searchResults={searchResults}
                            onSearchFocusChange={handleSearchFocusChange}
                            onSearchChange={handleSearchChange}
                        />

                        {/* <CountrySelect initialCountry={contextCountry} /> */}
                    </div>
                    <div className="bottom-row">
                        {contextCountry === "it"
                            ? drawerPages.map((page) => remapNavbarLink(page))
                            : drawerPages
                                  .filter((p) => p.label !== "Bar Slot" && p.label !== "VLT slot")
                                  .map((page) => remapNavbarLink(page))}
                    </div>
                </BigScreens>
            </NavbarWrapper>

            <PushMenu tiles={drawerPages} state={drawerOpen}>
                <FadeInOut visible={!searchOpen}>
                    <ChildrenWrapper style={{ background: "white" }}>{children}</ChildrenWrapper>
                    <Footer />
                </FadeInOut>
                {cookiesAccepted === "unknown" && (
                    <CookieDisclaimer
                        onCookiesAccepted={() => handleCookieAccepted()}
                        onCookiesRefused={() => handleCookieRefused()}
                    />
                )}
            </PushMenu>
        </Wrapper>
    )
}

const ChildrenWrapper = styled.div`
    ${desktop} {
        margin: auto;
        width: 1200px;
    }
`

interface IWrapper {
    currentPage: string
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;

    background: ${(props: IWrapper) => props.currentPage === "video" && "#3b3b3b"};
    font-family: "Raleway", sans-serif;
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

    ${laptop} {
        display: flex;
        height: 160px;
    }

    ${desktop} {
        padding-left: 14rem;
        padding-right: 14rem;
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
        /* transform : rotate(-25deg); */
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

        ${desktop} {
        }

        :hover {
            background: ${(props) => props.theme.colors.primaryDark};
        }
    }
`

export default NavbarProvider
