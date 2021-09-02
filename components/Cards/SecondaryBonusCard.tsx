import React, { Fragment, FunctionComponent } from "react"
import styled from "styled-components"
import { Bonus } from "../../graphql/schema"
import { injectCDN } from "./../../utils/Utils"
import LazyLoad from "react-lazyload"

interface Props {
    bonus: Bonus
}

const SecondaryBonusCard: FunctionComponent<Props> = ({ bonus }) => {
    return (
        <Fragment>
            <Container rel="nofollow" bonus={bonus} href={`/go?to=${bonus.link}`}>
                <ImageContainer bonus={bonus}>
                    <LazyLoad>
                        <img
                            alt={
                                bonus.circular_image.alternativeText
                                    ? bonus.circular_image.alternativeText
                                    : `${bonus.name}-logo`
                            }
                            src={injectCDN(bonus?.circular_image?.url)}
                            className="circular-image"
                        />
                    </LazyLoad>
                    <p>{bonus.description}</p>
                    <LazyLoad>
                        <img
                            style={{ width: "26px", height: "26px", marginRight: "1rem" }}
                            src="/icons/cheveron_right_white.svg"
                        />
                    </LazyLoad>
                </ImageContainer>
            </Container>
        </Fragment>
    )
}

const Icon = styled.img`
    width: 40px;
    height: 40px;
`

const PaymentAccepetedIcons = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    padding: 1rem;
`

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
    justify-content: space-evenly;
    align-items: center;
    border-radius: 6px;
    text-align: center;
    p {
        font-family: ${(props) => props.theme.text.primaryFont};
        font-size: 0.8rem;
        margin-right: 0.5rem;
        line-height: 1.2rem;
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

export default SecondaryBonusCard
