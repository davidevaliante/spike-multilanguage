import { FunctionComponent, useContext } from 'react'
import { Card, CardContent } from '@material-ui/core'
import { CrazyTimeSymbolStat } from '../../data/models/CrazyTimeSymbolStat'
import Image from 'next/image'
import { injectCDN } from '../../utils/Utils'
import { LocaleContext } from '../../context/LocaleContext'
import Divider from '../Ui/Divider'

interface CardProps {
    stat : CrazyTimeSymbolStat,
    totalSpinsConsidered : number,
    timeFrame : string
}

const CrazyTimeStatCard : FunctionComponent<CardProps> = ({stat, totalSpinsConsidered, timeFrame}) => {

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const expectation = (s : string) => {
        if(s === 'one') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>21 / 54</p>
                    <p>(38.89%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'two') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>13 / 54</p>
                    <p>(24.07%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'five') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>7 / 54</p>
                    <p>(12.96%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'ten') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>4 / 54</p>
                    <p>(7.41%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'cashhunt') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>2 / 54</p>
                    <p>(3.70%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'coinflip') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>4 / 54</p>
                    <p>(7.41%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'pachinko') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>2 / 54</p>
                    <p>(3.70%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'crazytime') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>1 / 54</p>
                    <p>(1.85%) {`${t('Expected')}`}</p>
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

export default CrazyTimeStatCard

const root = '/icons/crazy-time/'

const _squareLength = '100px'

const _rectWidht = '150px'

const _rectHeight = '80px'

const symbolToStatImage = (symbolString : string) => {
    switch(symbolString){
        case 'one':
            return <img width={_squareLength} height={_squareLength} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-1_db272f778d.png')}/>
        case 'two':
            return <img width={_squareLength} height={_squareLength} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-2_9fae79a563.png')}/>
        case 'five':
            return <img width={_squareLength} height={_squareLength} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-5_4b584c0988.png')}/>
        case 'ten':
            return <img width={_squareLength} height={_squareLength} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-10_c72360b662.png')}/>
        case 'coinflip':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-cf_7ed53595a8.png')}/>
        case 'cashhunt':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-ch_08e236c7e7.png')}/>
        case 'crazytime':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-ct_d430610c57.png')}/>
        case 'pachinko':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-pa_1b1b4d7d6f.png')}/>
    }
}