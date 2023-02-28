import { FunctionComponent, useContext } from 'react'
import { Card, CardContent } from '@material-ui/core'
import { CrazyTimeSymbolStat, SweetBonanzaCandylandStat } from '../../data/models/CrazyTimeSymbolStat'
import Image from 'next/image'
import { injectCDN } from '../../utils/Utils'
import { LocaleContext } from '../../context/LocaleContext'
import Divider from '../Ui/Divider'

interface CardProps {
    stat: SweetBonanzaCandylandStat
    totalSpinsConsidered: number
    timeFrame: string
}

const SweetBonanzaCandylandCard: FunctionComponent<CardProps> = ({ stat, totalSpinsConsidered, timeFrame }) => {
    console.log(stat)

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const expectation = (s: string) => {
        if (s === '1')
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>23 / 54</p>
                        <p>(42.59%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === '2')
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>15 / 54</p>
                        <p>(27.78%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === '5')
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>7 / 54</p>
                        <p>(12.96%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === 'Candy Drop')
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>3 / 54</p>
                        <p>(5.55%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === 'Bubble Surprise')
            return (
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ fontSize: '.7rem', display: 'flex' }}>
                        <p style={{ fontWeight: 'bold', marginRight: '.5rem' }}>3 / 54</p>
                        <p>(5.55%) {`${t('Expected')}`}</p>
                    </span>
                </div>
            )
        if (s === 'Sweet Spins')
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
                        {stat.spinSince != totalSpinsConsidered ? stat.spinSince : `> ${totalSpinsConsidered}`} Spins
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

export default SweetBonanzaCandylandCard

const root = '/icons/crazy-time/'

const _squareLength = '100px'

const _rectWidht = '150px'

const _rectHeight = '80px'

export const symbolToStatImage = (symbolString: string) => {
    switch (symbolString) {
        case '1':
            return (
                <img
                    width={_squareLength}
                    height={_squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-1-min.png')}
                />
            )
        case '2':
            return (
                <img
                    width={_squareLength}
                    height={_squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-2-min.png')}
                />
            )
        case '5':
            return (
                <img
                    width={_squareLength}
                    height={_squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-5-min.png')}
                />
            )
        case 'Candy Drop':
            return (
                <img
                    width={_squareLength}
                    height={_squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-cd-min.png')}
                />
            )
        case 'Bubble Surprise':
            return (
                <img
                    width={_squareLength}
                    height={_squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-bs-min.png')}
                />
            )
        case 'Sweet Spins':
            return (
                <img
                    width={_squareLength}
                    height={_squareLength}
                    src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sb-sp-min.png')}
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
