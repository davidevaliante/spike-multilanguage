import React, { FunctionComponent, useRef, useState, useEffect, useContext } from "react"
import { Backdrop, Paper } from "@material-ui/core"
import PrimaryBonusCard from "../Cards/PrimaryBonusCard"
import useOnClickOutside from "../../hooks/useOnClickOutside"
import { isMobile, isDesktop, isTablet } from "react-device-detect"
import { Bonus } from "../../graphql/schema"
import BonusStripe from "./../Cards/BonusStripe"
import SecondaryBonusCard from "../Cards/SecondaryBonusCard"
import styled from "styled-components"
import { tablet, desktop } from "../Responsive/Breakpoints"
import { LocaleContext } from "../../context/LocaleContext"

interface Props {
    bonuses: Bonus[]
}

const SPAM_INTERVAL = 60000

const BonusesBackdrop: FunctionComponent<Props> = ({ bonuses }) => {
    const bonusRef = useRef()
    useOnClickOutside(bonusRef, () => handleCloseSpamBonuses())

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const [timeout, setTimeout] = useState<NodeJS.Timeout | undefined>(undefined)
    const [showSpamBonuses, setShowSpamBonuses] = useState(true)

    const handleCloseSpamBonuses = () => {
        timeout && clearInterval(timeout)
        setShowSpamBonuses(false)
        const spamBonusInterval = setInterval(() => setShowSpamBonuses(true), SPAM_INTERVAL)
        setTimeout(spamBonusInterval)
    }

    useEffect(() => {
        const spamBonusInterval = setInterval(() => setShowSpamBonuses(true), SPAM_INTERVAL)
        setTimeout(spamBonusInterval)

        return () => {
            timeout && clearInterval(timeout)
        }
    }, [])

    return (
        <div>
            <Backdrop style={{ zIndex: 10 }} open={showSpamBonuses}>
                <DesktopContainer>
                    <Paper ref={bonusRef} elevation={3} style={{ padding: "2rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "space-around" }}>
                            <h1
                                style={{
                                    marginLeft: "1rem",
                                    fontWeight: "bold",
                                    fontSize: "1.5rem",
                                    color: "crimson",
                                    marginBottom: "2rem",
                                }}
                            >
                                {t("Compare legal websites")}
                            </h1>
                            <img
                                onClick={() => handleCloseSpamBonuses()}
                                style={{ width: "36px", height: "36px", cursor: "pointer" }}
                                src="/icons/close_red.svg"
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            {[...bonuses.slice(0, 3)].map((b) => (
                                <PrimaryBonusCard key={b.name} style={{ margin: "1rem" }} bonus={b} />
                            ))}
                        </div>
                    </Paper>
                </DesktopContainer>

                <MobileContainer>
                    <Paper ref={bonusRef} elevation={3} style={{ padding: "2rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "space-around" }}>
                            <h1
                                style={{
                                    marginLeft: "1rem",
                                    fontWeight: "bold",
                                    fontSize: "1.5rem",
                                    color: "crimson",
                                    marginBottom: "2rem",
                                }}
                            >
                                {t("Compare legal websites")}
                            </h1>
                            <img
                                onClick={() => handleCloseSpamBonuses()}
                                style={{ width: "36px", height: "36px", cursor: "pointer" }}
                                src="/icons/close_red.svg"
                            />
                        </div>
                        <div style={{}}>
                            {[...bonuses.slice(0, 3)].map((b) => (
                                <SecondaryBonusCard key={b.name} bonus={b} />
                            ))}
                        </div>
                    </Paper>
                </MobileContainer>
            </Backdrop>
        </div>
    )
}

const MobileContainer = styled.div`
    ${tablet} {
        display: none;
    }
`

const DesktopContainer = styled.div`
    display: none;
    ${tablet} {
        display: block;
    }
`

export default BonusesBackdrop
