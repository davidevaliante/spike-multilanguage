import React, { Fragment, FunctionComponent } from "react"
import styled from "styled-components"
import { Bonus } from "../../graphql/schema"
import { injectCDN } from "./../../utils/Utils"
import LazyBonusImage from "../Lazy/LazyBonusImage"
import LazyImage from "../Lazy/LazyImage"

interface Props {
    bonus: Bonus
}

const VideoSecondaryBonusCard: FunctionComponent<Props> = ({ bonus }) => {
    return (
        <Fragment>
            <Container bonus={bonus} rel="nofollow" href={`/go?to=${bonus.link}`}>
                <ImageContainer bonus={bonus}>
                    <LazyBonusImage
                        alt={
                            bonus.circular_image.alternativeText
                                ? bonus.circular_image.alternativeText
                                : `${bonus.name}-logo`
                        }
                        width={56}
                        height={56}
                        borderColor={bonus.borderColor}
                        src={injectCDN(bonus.circular_image.url)}
                    />
                    <p>{bonus.description}</p>
                    <LazyImage
                        width={26}
                        height={26}
                        style={{ marginRight: "1rem" }}
                        src="/icons/cheveron_right_white.svg"
                    />
                </ImageContainer>
            </Container>
        </Fragment>
    )
}

interface SecondaryBonusCardProps {
    bonus: Bonus
}

const Container = styled.a`
    cursor: pointer;
    width: 90%;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
    position: relative;
    z-index: 10;
    border-radius: 6px;
    box-shadow: 5px 5px 5px -2px rgba(0, 0, 0, 0.39);
    background: white;
    margin-bottom: 0.5rem;

    .circular-image {
        width: 70px;
        height: 70px;
        border: ${(props: SecondaryBonusCardProps) => `2px solid ${props.bonus.borderColor}`};
        border-radius: 50%;
        margin: 1rem;
    }
`

const ImageContainer = styled.div`
    background: ${(props: SecondaryBonusCardProps) => props.bonus.backgroundColor};
    width: 100%;
    display: flex;
    color: white;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    text-align: center;
    padding: 0.3rem;
    p {
        font-family: ${(props) => props.theme.text.primaryFont};
        padding: 1rem;
    }
`

const Button = styled.div`
    border-radius: 16px;
    padding: 1.2rem 2rem;
    background: ${(props) => props.theme.colors.primary};
    font-family: ${(props) => props.theme.text.secondaryFont};
    color: white;
    margin: 1rem;
`

export default VideoSecondaryBonusCard
