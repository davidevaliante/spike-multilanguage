import { FunctionComponent, useContext } from 'react'
import { Card, CardContent } from '@material-ui/core'
import { CrazyTimeSymbolStat, MegaWheelStat, SweetBonanzaCandylandStat } from '../../data/models/CrazyTimeSymbolStat'
import Image from 'next/image'
import { injectCDN } from '../../utils/Utils'
import { LocaleContext } from '../../context/LocaleContext'
import Divider from '../Ui/Divider'

interface CardProps {
    stat: MegaWheelStat
    totalSpinsConsidered: number
    timeFrame: string
}

const MegaWheelCard: FunctionComponent<CardProps> = ({ stat, totalSpinsConsidered, timeFrame }) => {
    console.log(stat)

    const {
        t,
        appCountry: contextCountry,
        setAppCountry: setContextCountry,
        userCountry,
        setUserCountry,
    } = useContext(LocaleContext)

    const expectation = (s: number) => {
        if (s === 1)
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>20 / 54</p>
                        <p>(37.03%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === 2)
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>13 / 54</p>
                        <p>(24.07%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === 5)
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>7 / 54</p>
                        <p>(12.96%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === 8)
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>4 / 54</p>
                        <p>(7.41%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === 10)
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>4 / 54</p>
                        <p>(7.41%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === 15)
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>2 / 54</p>
                        <p>(3.70%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === 20)
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>2 / 54</p>
                        <p>(3.70%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === 30)
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>1 / 54</p>
                        <p>(1.85%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === 40)
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>1 / 54</p>
                        <p>(1.85%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
    }

    return (
        <Card
            elevation={6}
            style={{
                width: '250px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '2rem',
            }}
        >
            <CardContent
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
                {symbolToStatImage(stat.symbol)}
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
                    <p style={{ marginTop: '.3rem', marginRight: '.4rem' }}>{`${t('Spins Since')}`}</p>
                    <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                        {stat.spinSince != totalSpinsConsidered ? stat.spinSince : `> ${totalSpinsConsidered}`} Spin
                    </p>
                </span>

                <div style={{ height: '2px', width: '100%', background: 'grey', marginTop: '1rem' }}></div>

                <p style={{ fontSize: '1rem', textAlign: 'center', marginTop: '1rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{`${Math.round(stat.percentage * 100) / 100}`}</span>
                    {` % ${t('for the past')} ${timeFrame}`}
                </p>

                <p style={{ fontSize: '1rem', textAlign: 'center', marginTop: '1rem' }}>
                    {stat.lands} {`${t('Lands')}`}
                </p>
                {expectation(stat.symbol)}
            </CardContent>
        </Card>
    )
}

export default MegaWheelCard

const root = '/icons/crazy-time/'

const _squareLength = '100px'

const _smallSquare = '40px'

const _rectWidht = '150px'

const _rectHeight = '80px'

export const symbolToStatImage = (symbolString: number, small: boolean = false) => {
    switch (symbolString) {
        case 1:
            return (
                <img
                    width={small ? _smallSquare : _squareLength}
                    height={small ? _smallSquare : _squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/mw-1.png')}
                />
            )
        case 2:
            return (
                <img
                    width={small ? _smallSquare : _squareLength}
                    height={small ? _smallSquare : _squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/mw-2.png')}
                />
            )

        case 5:
            return (
                <img
                    width={small ? _smallSquare : _squareLength}
                    height={small ? _smallSquare : _squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/mw-5.png')}
                />
            )
        case 8:
            return (
                <img
                    width={small ? _smallSquare : _squareLength}
                    height={small ? _smallSquare : _squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/mw-8.png')}
                />
            )
        case 10:
            return (
                <img
                    width={small ? _smallSquare : _squareLength}
                    height={small ? _smallSquare : _squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/mw-10.png')}
                />
            )
        case 15:
            return (
                <img
                    width={small ? _smallSquare : _squareLength}
                    height={small ? _smallSquare : _squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/mw-15.png')}
                />
            )
        case 20:
            return (
                <img
                    width={small ? _smallSquare : _squareLength}
                    height={small ? _smallSquare : _squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/mw-20.png')}
                />
            )
        case 30:
            return (
                <img
                    width={small ? _smallSquare : _squareLength}
                    height={small ? _smallSquare : _squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/mw-30.png')}
                />
            )

        case 40:
            return (
                <img
                    width={small ? _smallSquare : _squareLength}
                    height={small ? _smallSquare : _squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/mw-40.png')}
                />
            )
    }
}

const squareTwo = '50px'

export const symbolToStatImage2 = (symbolString: string) => {
    switch (symbolString) {
        case '1':
            return (
                <img
                    width={squareTwo}
                    height={squareTwo}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-1-min.png')}
                />
            )
        case '2':
            return (
                <img
                    width={squareTwo}
                    height={squareTwo}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-2-min.png')}
                />
            )
        case '5':
            return (
                <img
                    width={squareTwo}
                    height={squareTwo}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-5-min.png')}
                />
            )
        case 'Candy Drop':
            return (
                <img
                    width={squareTwo}
                    height={squareTwo}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-cd-min.png')}
                />
            )
        case 'Bubble Surprise':
            return (
                <img
                    width={squareTwo}
                    height={squareTwo}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-bs-min.png')}
                />
            )
        case 'Sweet Spins':
            return (
                <img
                    width={squareTwo}
                    height={squareTwo}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-sp-min.png')}
                />
            )
    }
}
