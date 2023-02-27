import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { injectCDN } from '../../utils/Utils'
import { tablet } from '../Responsive/Breakpoints'

interface IRtpDisplayer {
    rtp: number
    image: string
}

const RtpDisplayer: FunctionComponent<IRtpDisplayer> = ({ rtp, image }) => {
    const isHigh = rtp >= 97.5
    const isAboveAvg = rtp >= 96.5 && rtp < 97.5
    const isAvg = rtp >= 95 && rtp < 96.5
    const isBelowAvg = rtp >= 94 && rtp < 95
    const isLow = rtp < 94

    return (
        <Container>
            <VerticalText>RTP (Return to Player)</VerticalText>
            <div style={{ width: '170px' }}>
                <High>
                    <div>97.5% ↑</div>
                    {isHigh && (
                        <>
                            {' '}
                            <LineContainer>
                                <Ball />
                                <Line />
                            </LineContainer>
                            <SmallCard rtp={rtp} image={image} />
                        </>
                    )}
                </High>
                <AboveAvg>
                    <div>96.5% ~ 97.5%</div>
                    {isAboveAvg && (
                        <>
                            {' '}
                            <LineContainer>
                                <Ball />
                                <Line />
                            </LineContainer>
                            <SmallCard rtp={rtp} image={image} />
                        </>
                    )}
                </AboveAvg>
                <Avg>
                    <div>95% ~ 96.5%</div>
                    {isAvg && (
                        <>
                            {' '}
                            <LineContainer>
                                <Ball />
                                <Line />
                            </LineContainer>
                            <SmallCard rtp={rtp} image={image} />
                        </>
                    )}
                </Avg>
                <BelowAvg>
                    <div>94% ~ 95%</div>
                    {isBelowAvg && (
                        <>
                            {' '}
                            <LineContainer>
                                <Ball />
                                <Line />
                            </LineContainer>
                            <SmallCard rtp={rtp} image={image} />
                        </>
                    )}
                </BelowAvg>
                <Low>
                    <div>94% ↓</div>
                    {isLow && (
                        <>
                            {' '}
                            <LineContainer>
                                <Ball />
                                <Line />
                            </LineContainer>
                            <SmallCard rtp={rtp} image={image} />
                        </>
                    )}
                </Low>
            </div>
        </Container>
    )
}

const SmallCard: FunctionComponent<{ rtp: number; image: string }> = ({ rtp, image }) => {
    return (
        <CardContainer>
            <Image objectFit={'cover'} width={120} height={90} src={injectCDN(image)} />
            <div style={{ background: 'white', padding: '1rem 0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '.7rem', color: 'gray', marginBottom: '.3rem' }}>Rtp Medio</div>
                <div>{rtp}%</div>
            </div>
        </CardContainer>
    )
}

const LineContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 80%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    transform: translate(0%, -50%);
`

const Ball = styled.div`
    width: 7px;
    height: 7px;
    background: black;
    border-radius: 50%;
`

const Line = styled.div`
    width: 130px;
    background: black;
    height: 2px;
`

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    right: -135px;
    z-index: 30;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    overflow: hidden;
    transform: translate(0, -50%);
`

const highColor = '#16c92e'
const aboveAvgColor = '#19c7e6'
const avgColor = '#f0f013'
const belowAvgColor = '#ebae34'
const lowColor = '#eb4034'

const Text = styled.div``

const Container = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4;
    height: 300px;
    margin: 7rem 0rem;
    font-weight: bold;
    padding: 0rem 0.3rem;

    ${tablet} {
        justify-content: center;
    }
`

const High = styled.div`
    position: relative;
    background: ${highColor};
    height: 5%;
    padding: 0.3rem;
    padding-left: 1rem;
    display: flex;
    flex-direction: row;
    border-radius: 0.2rem 0.2rem 0 0;
`

const AboveAvg = styled.div`
    position: relative;
    background: ${aboveAvgColor};
    height: 20%;
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 1rem;
`

const Avg = styled.div`
    position: relative;
    background: ${avgColor};
    height: 50%;
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 1rem;
`

const BelowAvg = styled.div`
    position: relative;
    background: ${belowAvgColor};
    height: 18%;
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 1rem;
`

const Low = styled.div`
    position: relative;
    background: ${lowColor};
    height: 7%;
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 1rem;
    border-radius: 0rem 0rem 0.2rem 0.2rem;
`

const VerticalText = styled.div`
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-right: 1rem;
`

export default RtpDisplayer
