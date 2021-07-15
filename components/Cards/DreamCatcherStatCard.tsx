import { FunctionComponent, useContext } from 'react'
import { Card, CardContent } from '@material-ui/core'
import { CrazyTimeSymbolStat } from '../../data/models/CrazyTimeSymbolStat'
import { injectCDN } from '../../utils/Utils'
import { LocaleContext } from '../../context/LocaleContext'
import { DreamcatcherSymbolStat } from './../../data/models/CrazyTimeSymbolStat'

interface CardProps {
    stat : DreamcatcherSymbolStat,
    totalSpinsConsidered : number,
    timeFrame : string
}

const DreamCatcherStatCard : FunctionComponent<CardProps> = ({stat, totalSpinsConsidered, timeFrame}) => {

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const expectation = (s : string) => {
        if(s === 'one') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>21 / 54</p>
                    <p>(38.89%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'two') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>13 / 54</p>
                    <p>(24.07%) {`${t('Expected')}`}</p>
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
        if(s === 'cashhunt') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>2 / 54</p>
                    <p>(3.70%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'coinflip') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>4 / 54</p>
                    <p>(7.41%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'pachinko') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>2 / 54</p>
                    <p>(3.70%) {`${t('Expected')}`}</p>
                </span>
            </div>
        )
        if(s === 'crazytime') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.7rem', display : 'flex'}}>
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

export default DreamCatcherStatCard


const _squareLength = '100px'

const _rectWidht = '150px'

const _rectHeight = '80px'

const symbolToStatImage = (symbolString : string) => {
    switch(symbolString){
        case 'one':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dc-stat-1_ebd7750b06.png')}/>
        case 'two':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dc-stat-2_a37e4208fd.png')}/>
        case 'five':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dc-stat-5_c33567ad9d.png')}/>
        case 'ten':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dc-stat-10_570e4c7d79.png')}/>
        case 'twenty':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dc-stat-20_1d6b83d48a.png')}/>
        case 'fourty':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dc-stat-40_86269dad25.png')}/>
        case 'twox':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dc-stat-2x_f9cc0df223.png')}/>
        case 'sevenx':
            return <img width={_rectWidht} height={_rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dc-stat-7x_6f84041aad.png')}/>
    }
}