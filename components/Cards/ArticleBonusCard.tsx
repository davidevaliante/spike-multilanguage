import React, { Fragment, FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import { Bonus } from '../../graphql/schema'
import { injectCDN } from './../../utils/Utils'
import LazyLoad from 'react-lazyload'
import { laptop } from '../Responsive/Breakpoints'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { LocaleContext } from '../../context/LocaleContext'
import Image from 'next/image'

interface Props {
    bonus: Bonus
    style?: CSSProperties
}

const ArticleBonusCard: FunctionComponent<Props> = ({ bonus, style }) => {
    const { t } = useContext(LocaleContext)
    return (
        <Container rel='nofollow' style={style} bonus={bonus} href={`/go?to=${bonus.link}`}>
            <ImageContainer bonus={bonus}>
                <Image
                    alt={
                        bonus.circular_image.alternativeText
                            ? bonus.circular_image.alternativeText
                            : `${bonus.name}-logo`
                    }
                    width={60}
                    height={60}
                    src={injectCDN(bonus.circular_image.url)}
                    className='circular-image'
                />
                <DepositTextContainer>
                    <div className='col'>
                        <div className='font-serif text-sm'>{t('Without Deposit')}</div>
                        <p>{bonus.noDeposit}</p>
                    </div>

                    <div className='col'>
                        <div className='font-serif text-sm'>{t('With Deposit')}</div>
                        <p>{bonus.withDeposit}</p>
                    </div>
                </DepositTextContainer>
                <Image
                    alt='cheveron right white'
                    width={60}
                    height={60}
                    style={{ width: '16px', height: '16px', marginRight: '1rem' }}
                    src='/icons/cheveron_right_white.svg'
                />
            </ImageContainer>
        </Container>
    )
}

interface SecondaryBonusCardProps {
    bonus: Bonus
}

const DepositTextContainer = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: center;
    padding: 0.5rem 0rem;

    .col {
        margin: 0rem 0.5rem;
        max-width: 160px;
        ${laptop} {
            margin: 0rem 1rem;
        }
    }
`
const Container = styled.a`
    all: unset;
    cursor: pointer;
    width: 100%;
    max-width: 550px;
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
    transition: all 0.5s ease-in;
    margin: 2rem auto;

    h3 {
        color: white !important;
        font-size: 0.9rem !important;
        margin: 0.3rem !important;
    }

    p {
        font-size: 0.8rem !important;
        line-height: 0.9rem !important;
        font-weight: normal !important;
        font-family: 'Raleway', sans-serif;
    }

    .circular-image {
        width: 46px;
        height: 46px;
        border: ${(props: SecondaryBonusCardProps) => `2px solid ${props.bonus.borderColor}`};
        border-radius: 50%;
        margin: 0.5rem;
    }
`

const ImageContainer = styled.div`
    background-color: ${(props: SecondaryBonusCardProps) => props.bonus.backgroundColor};
    width: 100%;
    display: flex;
    color: white;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 6px;
    text-align: center;

    p {
        font-size: 0.8rem;
    }
`

export default ArticleBonusCard
