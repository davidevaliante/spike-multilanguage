import React from "react"
import styled from "styled-components"
import { ApolloSlotCard } from "../../data/models/Slot"
import { FunctionComponent } from "react"
import { injectCDN } from "./../../utils/Utils"
import { CSSProperties } from "@material-ui/core/styles/withStyles"
import { laptop } from "../Responsive/Breakpoints"
import Router from "next/router"
import { LocaleContext } from "./../../context/LocaleContext"
import { useContext } from "react"

interface Props {
    slotData: ApolloSlotCard
    style?: CSSProperties
    countryCode: string
}

const SlotListHighlightSlot: FunctionComponent<Props> = ({ slotData, style, countryCode }) => {
    const { t } = useContext(LocaleContext)

    const goToHighlightSlot = () => Router.push(`/slot/book-of-ra-deluxe-6/${countryCode}`)

    return (
        <Wrapper>
            <Container style={style}>
                <h1 className="ribbon">{t("Top Choice")}</h1>
                <CardContainer>
                    <Image alt="book of ra 6" onClick={() => goToHighlightSlot()} src={injectCDN(slotData.image.url)} />
                    <DataContainer>
                        <GradientTitle onClick={() => goToHighlightSlot()}>{slotData.name}</GradientTitle>

                        <p className="producer" onClick={() => goToHighlightSlot()}>
                            {t("Novomatic")}
                        </p>

                        <ButtonsContainer>
                            <FirstButton onClick={() => goToHighlightSlot()}>
                                <img src="/icons/eye_white.svg" />
                                <p>{t("Play for FREE and read the tips")}</p>
                            </FirstButton>

                            <SecondButton
                                onClick={() =>
                                    Router.push(
                                        `/videos/slot_online_vincita_17_000_euro_alla_slot_book_of_ra_6_il_video_dei_record/${countryCode}`
                                    )
                                }
                            >
                                <img alt="video icon" src="/icons/video_circular_icon.svg" />
                                <p>{t("Watch the video")}</p>
                            </SecondButton>

                            <ThirdButton
                                onClick={() =>
                                    window.open(
                                        "https://lp.starvegas.it/landingpages/?page=v03&lang=it&curr=eur&id_game=110&pid=00004c630000004000000000&cid=00015c5e0000004000000000"
                                    )
                                }
                            >
                                <img alt="euro-icon" src="/icons/euro_white.svg" />
                                <p>{t("Discover the bonus")}</p>
                            </ThirdButton>
                        </ButtonsContainer>

                        <div
                            onClick={() => goToHighlightSlot()}
                            style={{
                                display: "flex",
                                marginTop: "1rem",
                                justifyContent: "space-around",
                                width: "100%",
                            }}
                        >
                            <div className="col">
                                <img alt="slot icon" src="/icons/slot_icon.svg" />
                                <p>{"95.03% RTP"}</p>
                            </div>

                            <div className="col">
                                <img alt="flame icon" src="/icons/flame_icon.svg" />
                                <p>{t("Medium-High Volatility")}</p>
                            </div>
                        </div>
                    </DataContainer>
                </CardContainer>
            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.div``

const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    position: relative;
`

const GradientTitle = styled.h1`
    font-family: ${(props) => props.theme.text.secondaryFont};
    font-size: 1.5rem;
    text-align: center;
    width: 100%;
    padding: 1rem;
    color: white;
`

const FirstButton = styled.div`
    margin: 0rem 0.5rem;
    width: 200px;
    cursor: pointer;
    padding: 0.3rem 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${(props) => props.theme.colors.primary};
    color: white;
    font-weight: bold;
    border-radius: 6px;
    text-align: center;
    transition: all 0.3s ease-in-out;

    :hover {
        filter: brightness(1.2);
    }
`

const ThirdButton = styled.div`
    width: 200px;
    margin: 0rem 0.5rem;
    cursor: pointer;
    padding: 0.3rem 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #07ba13;
    color: white;
    font-weight: bold;
    border-radius: 6px;
    text-align: center;

    transition: all 0.3s ease-in-out;

    :hover {
        filter: brightness(1.2);
    }
`

const SecondButton = styled.div`
    width: 200px;
    margin: 0.5rem 0.5rem;
    cursor: pointer;
    padding: 0.3rem 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fdb731;
    color: white;
    font-weight: bold;
    border-radius: 6px;
    text-align: center;

    transition: all 0.3s ease-in-out;

    :hover {
        filter: brightness(1.2);
    }
`

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`

const DataContainer = styled.div`
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    ${laptop} {
        flex-grow: 1;
    }

    img {
        width: 26px;
        height: 26px;
    }

    .col {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 1rem;
    }

    p {
        padding: 0.5rem;
        color: white;
        font-weight: bold;
        font-size: 80%;
    }
`

const Container = styled.div`
    cursor: pointer;

    width: 300px;

    .ribbon {
        position: absolute;
        top: 10px;
        left: 14px;
        padding: 0 0.5em;
        font-size: 1.3rem;
        margin: 0 0 0 -0.625em;
        line-height: 1.875em;
        color: white;
        border-radius: 0 0.156em 0.156em 0;
        background: ${(props) => props.theme.colors.primary};
        box-shadow: -1px 2px 3px rgba(0, 0, 0, 0.5);
        z-index: 10;
    }

    .ribbon:before,
    .ribbon:after {
        position: absolute;
        content: "";
        display: block;
    }

    .ribbon:before {
        width: 0.469em;
        height: 100%;
        padding: 0 0 0.438em;
        top: 0;
        left: -0.469em;
        background: inherit;
        border-radius: 0.313em 0 0 0.313em;
    }

    .ribbon:after {
        width: 0.313em;
        height: 0.313em;
        background: rgba(0, 0, 0, 0.35);
        bottom: -0.313em;
        left: -0.313em;
        border-radius: 0.313em 0 0 0.313em;
        box-shadow: inset -1px 2px 2px rgba(0, 0, 0, 0.3);
    }

    ${laptop} {
        width: 800px;
    }

    position: relative;
    background: #272727;
    margin: auto;
    border: 3px solid #3b9ef5;
    border-radius: 16px;
    display: flex;
    flex-wrap: wrap-reverse;

    h3 {
        color: ${(props) => props.theme.colors.yellow};
        font-weight: bold;
        text-align: center;
        padding: 0.5rem;
        padding-top: 1rem;
    }

    h4 {
        color: white;
        font-family: ${(props) => props.theme.text.secondaryFont};
        font-weight: bold;
        text-align: center;
        padding: 0.5rem;
        font-size: 2rem;
    }

    .producer {
        color: ${(props) => props.theme.colors.yellow};
        text-align: center;
        letter-spacing: 0.4rem;
        padding: 1rem;
        font-weight: bold;
    }

    svg {
        position: absolute;
        display: block;
        top: -120px;
        left: -160px;
        font: 4rem "Montserrat";
        margin: 0 auto;
    }

    .text-copy {
        fill: none;
        stroke: white;
        stroke-dasharray: 6% 29%;
        stroke-width: 5px;
        stroke-dashoffset: 0%;
        animation: stroke-offset 2.5s infinite linear;
    }

    .text-copy:nth-child(1) {
        stroke: #4d163d;
        animation-delay: -1;
    }

    .text-copy:nth-child(2) {
        stroke: #f54281;
        animation-delay: -2s;
    }

    .text-copy:nth-child(3) {
        stroke: #ed15db;
        animation-delay: -3s;
    }

    .text-copy:nth-child(4) {
        stroke: #fdb731;
        animation-delay: -4s;
    }

    .text-copy:nth-child(5) {
        stroke: #1ceb42;
        animation-delay: -5s;
    }

    @keyframes stroke-offset {
        100% {
            stroke-dashoffset: -35%;
        }
    }
`

const Image = styled.img`
    width: 300px;
    align-self: flex-end;
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;

    ${laptop} {
        width: 60%;
        height: 100%;
        object-fit: cover;
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        /* reset */
        border-top-right-radius: 0px;
    }
`

export default SlotListHighlightSlot
