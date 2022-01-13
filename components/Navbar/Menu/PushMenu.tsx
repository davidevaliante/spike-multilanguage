import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { FunctionComponent } from "react"
import Divider from "../../Ui/Divider"
import Router, { useRouter } from "next/router"
import { countryContext } from "./../../../context/CountryContext"
import { useContext } from "react"
import { LocaleContext } from "../../../context/LocaleContext"

interface Props {
    state: boolean
    tiles: any
}

const PushMenu: FunctionComponent<Props> = ({ state, children, tiles }) => {
    console.log("here")

    const offset = "80vw"

    const router = useRouter()

    const [childrenWrapperPosition, setChildrenWrapperPosition] = useState(false)

    const { t, contextCountry } = useContext(LocaleContext)

    useEffect(() => {
        if (state === true) setChildrenWrapperPosition(true)
        else updateStateDelayed()
    }, [state])

    const [liveStatsMenuOpen, setLiveStatsMenuOpen] = useState(false)

    const updateStateDelayed = () => {
        setTimeout(() => {
            setChildrenWrapperPosition(false)
        }, 300)
    }

    const navigateTo = (link: string) => {
        if (link === "/" || link === "/migliori-bonus-casino") Router.push(link)
        else Router.push(`${link}/${contextCountry}`)
    }

    const LiveStatsSubMenu = () => {
        return (
            <div style={{ marginLeft: "2rem" }}>
                <div
                    key={`push_menu_crazy_time`}
                    onClick={() => router.push(`/live-stats/crazy-time/${contextCountry}`)}
                >
                    <p>Crazy Time Stats</p>
                    <Divider />
                </div>
                <div
                    key={`push_menu_monopoly`}
                    onClick={() => router.push(`/live-stats/monopoly-live/${contextCountry}`)}
                >
                    <p>Monopoly Live Stats</p>
                    <Divider />
                </div>
                <div key={`push_menu_dream`} onClick={() => router.push(`/live-stats/dream-catcher/${contextCountry}`)}>
                    <p>Dream Catcher Stats</p>
                    <Divider />
                </div>
                <div
                    key={`push_menu_lightning-dice`}
                    onClick={() => router.push(`/live-stats/lightning-dice/${contextCountry}`)}
                >
                    <p>Lightning Dice Stats</p>
                </div>
            </div>
        )
    }

    return (
        <Wrapper>
            <PushMenuContainer isOpen={state} offSet={offset} childrenWrapperPosition={childrenWrapperPosition}>
                {tiles.map((tile, index) =>
                    tile.label !== "LiveStats" ? (
                        <div
                            style={{ marginBottom: index == tiles.length - 1 ? "12rem" : "0rem" }}
                            key={`push_menu_${tile.label}`}
                            onClick={() => navigateTo(tile.link)}
                        >
                            <p>{t(tile.label)}</p>
                            <Divider />
                        </div>
                    ) : (
                        <div>
                            <div
                                onClick={() => setLiveStatsMenuOpen(!liveStatsMenuOpen)}
                                style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
                            >
                                <p>Live Stats</p>
                                <span>
                                    <img
                                        width={20}
                                        height={20}
                                        src={
                                            liveStatsMenuOpen
                                                ? "/icons/chevron_up_white.svg"
                                                : "/icons/chevron_down_white.svg"
                                        }
                                    />
                                </span>
                            </div>
                            {liveStatsMenuOpen && <LiveStatsSubMenu />}
                            <Divider />
                        </div>
                    )
                )}
            </PushMenuContainer>

            <ChildrenWrapper isOpen={state} offSet={offset} childrenWrapperPosition={childrenWrapperPosition}>
                {children}
            </ChildrenWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    overflow-x: scroll;
    font-family: "Raleway", sans-serif !important;
`

const ChildrenWrapper = styled.div`
    width: 100%;
    height: 100%;
    right: ${(props: PushMenuContainerInterface) => (props.isOpen ? `-${props.offSet}` : "0px")};
    transition: all 0.3s ease-in;
    overflow-x: hidden;
    overflow-y: hidden;
    position: ${(props: PushMenuContainerInterface) => (props.childrenWrapperPosition ? "fixed" : "static")};
`

interface PushMenuContainerInterface {
    isOpen: boolean
    offSet: string
    childrenWrapperPosition: boolean
}

const PushMenuContainer = styled.div`
    height: calc(100vh - 96px);
    width: ${(props: PushMenuContainerInterface) => props.offSet};
    background: ${(props) => props.theme.colors.primaryDark};
    top: 96px;
    left: ${(props: PushMenuContainerInterface) => (props.isOpen ? "0px" : `-${props.offSet}`)};
    position: fixed;
    transition: all 0.3s ease-in;
    display: flex;
    overflow-y: scroll;
    overflow-x: hidden;
    flex-direction: column;

    p {
        padding: 1.2rem 1rem;
        color: white;
    }
`

export default PushMenu
