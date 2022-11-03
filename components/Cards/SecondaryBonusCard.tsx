import React, { Fragment, FunctionComponent } from 'react'
import styled from 'styled-components'
import { Bonus } from '../../graphql/schema'
import { injectCDN } from './../../utils/Utils'
import Image from 'next/image'

interface Props {
    bonus: Bonus
}

const SecondaryBonusCard: FunctionComponent<Props> = ({ bonus }) => {
    return (
        <Container rel='nofollow' bonus={bonus} href={`/go?to=${bonus.link}`}>
            <ImageContainer bonus={bonus}>
                <Image
                    alt={
                        bonus.circular_image.alternativeText
                            ? bonus.circular_image.alternativeText
                            : `${bonus.name}-logo`
                    }
                    src={injectCDN(bonus?.circular_image?.url)}
                    className='circular-image'
                    width={50}
                    height={50}
                />
                <p className='text-xs'>{bonus.description}</p>
                <Image width={26} height={26} className='mr-2' src='/icons/cheveron_right_white.svg' alt={'chevron'} />
            </ImageContainer>
        </Container>
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
    justify-content: space-evenly;
    align-items: center;
    border-radius: 6px;
    text-align: center;
`
export default SecondaryBonusCard
