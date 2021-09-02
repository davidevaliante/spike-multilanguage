import React, { useContext } from "react"
import styled from "styled-components"
import LazyLoad from "react-lazyload"
// import { countryContext } from './../../context/CountryContext';
// import { Translations } from './../../constants/translation';
import { laptop } from "./../Responsive/Breakpoints"
import { FunctionComponent } from "react"
import { LocaleContext } from "../../context/LocaleContext"
import Link from "next/link"

interface Props {
    image: string
    slug: string
    onClick?: () => void
}

const SmallSlotCard: FunctionComponent<Props> = ({ image, slug, onClick }) => {
    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    return (
        <Container onClick={() => onClick && onClick()}>
            <LazyLoad>
                <img src={image} />
            </LazyLoad>
            <PlayButton>
                <p>{t("Play")}</p>
                <Link href={`/demo/[slug]/[countryCode]`} as={`/demo/${slug}/${contextCountry}`} passHref>
                    <a></a>
                </Link>
            </PlayButton>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    background: white;
    align-items: center;
    border-radius: 16px;
    top: 110px;
    margin: auto;
    z-index: 20;
    box-shadow: 10px 9px 5px -4px rgba(0, 0, 0, 0.6);

    img {
        width: 100%;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
    }

    ${laptop} {
        display: none;
    }

    a {
        all: unset;
    }
`

const PlayButton = styled.div`
    cursor: pointer;
    text-align: center;
    background: ${(props) => props.theme.colors.primary};
    color: white;
    margin: 2rem;
    padding: 1rem 3rem;
    border-radius: 16px;
    max-width: 150px;
    font-family: ${(props) => props.theme.text.secondaryFont};
    text-transform: uppercase;
`

export default SmallSlotCard
