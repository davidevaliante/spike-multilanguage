import React, { FunctionComponent, useContext } from "react"
import { BonusGuide } from "../../graphql/schema"
import styled from "styled-components"
import LazyBonusImage from "../Lazy/LazyBonusImage"
import LazyImage from "../Lazy/LazyImage"
import Link from "next/link"
import { LocaleContext } from "../../context/LocaleContext"

interface BonusGuideCardProps {
    guide: BonusGuide
}

const BonusGuideCard: FunctionComponent<BonusGuideCardProps> = ({ guide }) => {
    const { t, contextCountry } = useContext(LocaleContext)

    return (
        <StyleProvider>
            <Link href={`/guida/[slug]/[countryCode]`} as={`/guida/${guide.slug}/${contextCountry}`}>
                <a>
                    <CardContainer backgroundColor={guide.bonus!.backgroundColor!}>
                        <LazyBonusImage
                            alt={`${guide.bonus?.name}-logo`}
                            width={60}
                            height={60}
                            borderColor={guide.bonus?.borderColor!}
                            src={guide.bonus?.circular_image.url}
                        />

                        <div style={{ display: "flex" }}>
                            <div>
                                <h2 className="card-header">{`${t("Bonus Guide")} ${guide.bonus?.name}`}</h2>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <p className="card-subheader">{t("With video explanation by SPIKE")}</p>
                                    <LazyImage width={30} height={30} src={"/icons/ciak.svg"} alt="ciak" />
                                </div>
                            </div>
                        </div>
                    </CardContainer>
                </a>
            </Link>
        </StyleProvider>
    )
}

interface ICardContainer {
    backgroundColor: string
}

const StyleProvider = styled.div`
    a {
        all: unset;
        color: #ffffff;
    }
`

const CardContainer = styled.div`
    cursor: pointer;
    background: ${(props: ICardContainer) => (props ? props.backgroundColor : "white")};
    color: #ffffff;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;

    max-width: 320px;

    .card-header {
        color: #ffffff;
        font-weight: bold;
        margin: 0.5rem 1rem;
        font-size: 1rem;
    }

    .card-subheader {
        font-size: 0.7rem;
        margin: 0.5rem 1rem;
    }
`

export default BonusGuideCard
