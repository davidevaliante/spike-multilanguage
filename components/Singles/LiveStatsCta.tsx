import React from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { injectCDN } from '../../utils/Utils'
import { laptop, tablet } from './../Responsive/Breakpoints'
import Router from 'next/router'

interface Props {}

const LiveStatsCta: FunctionComponent<Props> = (props: Props) => {
    const goToCrazyTime = () => Router.push('/live-stats/crazy-time/it')
    const goToMonopoly = () => Router.push('/live-stats/monopoly/it')
    const goToDreamCatcher = () => Router.push('/live-stats/dream-catcher/it')
    const gotToLightning = () => Router.push('/live-stats/lightning-dice/it')
    const gotToSweet = () => Router.push('/live-stats/sweet-bonanza-candyland/it')
    const goToMegaWheel = () => Router.push('/live-stats/mega-wheel/it')

    return (
        <Container>
            <ImgContainer>
                <CTAImage
                    alt='mega wheel live stats image'
                    onClick={goToMegaWheel}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/megawheel.webp')}
                />
                <img className='sticker' src='/icons/new_icon.svg' alt='big new icon' />
            </ImgContainer>

            <ImgContainer>
                <CTAImage
                    alt='dreamcatcher live stats image'
                    onClick={gotToSweet}
                    src={injectCDN(
                        'https://spike-images.s3.eu-central-1.amazonaws.com/Sweet-Bonanza-Candyland-min.jpg'
                    )}
                />
                <img className='sticker' src='/icons/new_icon.svg' alt='big new icon' />
            </ImgContainer>

            <CTAImage
                className='pointer'
                onClick={gotToLightning}
                alt='lightning dice live stats image'
                src={injectCDN(
                    'https://spike-images.s3.eu-central-1.amazonaws.com/lightning_dice_on_air-min_dae6d575d8.jpeg'
                )}
            />
            <CTAImage
                className='pointer'
                onClick={goToDreamCatcher}
                alt='dream catcher live stats image'
                src={injectCDN(
                    'https://spike-images.s3.eu-central-1.amazonaws.com/dream_catcher_active_e3832ccd0d.jpeg'
                )}
            />
            <CTAImage
                className='pointer'
                onClick={goToCrazyTime}
                alt='crazy time live stats image'
                src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/crazy_time_cta_27c89931a9.jpeg')}
            />
            <CTAImage
                className='pointer'
                onClick={goToMonopoly}
                alt='monopoly live stats image'
                src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly_active_e9d2a6d505.jpeg')}
            />
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    max-width: 95vw;
    margin-bottom: 3rem;
    padding-top: 1.5rem;
    padding-bottom: 0.3rem;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    gap: 0.2rem;
    overflow-x: auto;
    scrollbar-width: thin;

    box-sizing: border-box;

    ${laptop} {
        max-width: 880px;
        justify-content: center;
    }

    .pointer {
        cursor: pointer;
    }

    /* width */
    ::-webkit-scrollbar {
        width: 5px !important;
        height: 5px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #red;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #red;
    }
`

const ImgContainer = styled.div`
    position: relative;

    .pointer {
        cursor: pointer;
    }

    .sticker {
        position: absolute;
        top: -25px;
        right: -13px;
        width: 45px;
        height: 45px;
        transform: rotate(25deg);
        z-index: 10;
    }

    /* animation: animated 2s infinite; */

    @keyframes animated {
        0% {
            transform: scale(1);
        }

        50% {
            transform: scale(1.05);
        }

        100% {
            transform: scale(1);
        }
    }
`

const CTAImage = styled.img`
    width: 140px;
    border-radius: 6px;
    cursor: pointer;
    display: block;
    /* box-shadow: 3px 3px 5px 3px #ccc; */
`

const CTAImageAnim = styled.img`
    position: relative;
    cursor: pointer;
    width: 260px;
    border-radius: 6px;
    /* box-shadow: 3px 3px 5px 3px #ccc; */
`

export default LiveStatsCta
