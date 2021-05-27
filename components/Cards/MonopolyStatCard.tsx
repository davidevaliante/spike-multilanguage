import { FunctionComponent, useContext } from 'react'
import { Card, CardContent } from '@material-ui/core'
import { CrazyTimeSymbolStat, MonopolySymbolStat } from '../../data/models/CrazyTimeSymbolStat'
import Image from 'next/image'
import { injectCDN } from '../../utils/Utils'
import { LocaleContext } from '../../context/LocaleContext'
import Divider from '../Ui/Divider'

interface CardProps {
    stat : MonopolySymbolStat,
    totalSpinsConsidered : number,
    timeFrame : string
}

const MonopolyStatCard : FunctionComponent<CardProps> = ({stat, totalSpinsConsidered, timeFrame}) => {

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const expectation = (s : string) => {
        if(s === 'one') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>22 / 54</p>
                    <p>(40.74%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'two') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>15 / 54</p>
                    <p>(27.28%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'five') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>7 / 54</p>
                    <p>(12.96%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'ten') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>4 / 54</p>
                    <p>(7.41%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'tworolls') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>3 / 54</p>
                    <p>(5.56%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'fourrolls') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>1 / 54</p>
                    <p>(1.85%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'chance') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>2 / 54</p>
                    <p>(3.70%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
    }

    return(
        <Card elevation={6} style={{width : '250px', display : 'flex', flexDirection : 'column', justifyContent : 'center', alignItems : 'center', marginBottom : '2rem'}}>
            <CardContent style={{display : 'flex', flexDirection : 'column', justifyContent : 'center', alignItems : 'center',}}>
                {symbolToStatImage(stat.symbol)}
                <span style={{display : 'flex', alignItems : 'center', justifyContent : 'center', marginTop : '1rem'}}>
                    <p style={{marginTop : '.3rem',marginRight : '.4rem',}}>{`${t('Spins Since')}`}</p>
                    <p style={{fontWeight : 'bold',  fontSize : '1.5rem'}}>{stat.spinSince != totalSpinsConsidered ? stat.spinSince  : `> ${totalSpinsConsidered}`} Spin</p>
                </span>

                <div style={{height : '2px', width : '100%', background : 'grey', marginTop : '1rem'}}></div>

                <p style={{fontSize : '1rem', textAlign : 'center', marginTop : '1rem'}}>
                    <span style={{fontWeight : 'bold'}}>
                        {`${Math.round(stat.percentage * 100) / 100}`}
                    </span>
                    {` % ${t('for the past')} ${timeFrame}`}
                </p>
                
                <p style={{ fontSize : '1rem', textAlign : 'center', marginTop : '1rem'}}>{stat.lands} {`${t('Lands')}`}</p>
                {expectation(stat.symbol)}
            </CardContent>
        </Card>
    )
}

export default MonopolyStatCard

const root = '/icons/crazy-time/'

const _squareLength = '100px'

const _rectWidht = '150px'

const _rectHeight = '80px'

const symbolToStatImage = (symbolString : string) => {
    switch(symbolString){
        case 'one':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-1-card_1412ffb4dd.png')}/>
        case 'two':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-2-card_fac87cd080.png')}/>
        case 'five':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-5-card_53d38822d8.png')}/>
        case 'ten':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-10-card_b6b453773a.png')}/>
        case 'tworolls':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-2r-card_7607c7f4e2.png')}/>
        case 'fourrolls':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-4r-card_abbeacf82a.png')}/>
        case 'chance':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-chance-card_0faa3808a5.png')}/>
    }
}