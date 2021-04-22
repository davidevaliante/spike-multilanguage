import { FunctionComponent } from 'react'
import { Card, CardContent } from '@material-ui/core'
import { CrazyTimeSymbolStat } from '../../data/models/CrazyTimeSymbolStat'
import Image from 'next/image'

interface CardProps {
    stat : CrazyTimeSymbolStat,
    totalSpinsConsidered : number
}

const CrazyTimeStatCard : FunctionComponent<CardProps> = ({stat, totalSpinsConsidered}) => {

    const expectation = (s : string) => {
        if(s === 'one') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>21 / 54</p>
                    <p>(38.89%) Expected</p>
                </span>
            </div>
        )
        if(s === 'two') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>13 / 54</p>
                    <p>(24.07%) Expected</p>
                </span>
            </div>
        )
        if(s === 'five') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>7 / 54</p>
                    <p>(12.96%) Expected</p>
                </span>
            </div>
        )
        if(s === 'ten') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>4 / 54</p>
                    <p>(7.41%) Expected</p>
                </span>
            </div>
        )
        if(s === 'cashhunt') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>2 / 54</p>
                    <p>(3.70%) Expected</p>
                </span>
            </div>
        )
        if(s === 'coinflip') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>4 / 54</p>
                    <p>(7.41%) Expected</p>
                </span>
            </div>
        )
        if(s === 'pachinko') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>2 / 54</p>
                    <p>(3.70%) Expected</p>
                </span>
            </div>
        )
        if(s === 'crazytime') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>1 / 54</p>
                    <p>(1.85%) Expected</p>
                </span>
            </div>
        )
    }

    return(
        <Card style={{width : '250px', display : 'flex', flexDirection : 'column', justifyContent : 'center', alignItems : 'center', marginBottom : '2rem'}}>
            <CardContent style={{display : 'flex', flexDirection : 'column', justifyContent : 'center', alignItems : 'center',}}>
                {symbolToStatImage(stat.symbol)}
                <p style={{fontWeight : 'bold', fontSize : '2rem', textAlign : 'center', marginTop : '1rem'}}>{Math.round(stat.percentage * 100) / 100} %</p>
                <span style={{display : 'flex', alignItems : 'center', justifyContent : 'center', marginTop : '1rem'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.4rem'}}>{stat.spinSince != totalSpinsConsidered ? stat.spinSince  : `> ${totalSpinsConsidered}`}</p>
                    <p>Spins Since</p>
                </span>
                <p style={{ fontSize : '1rem', textAlign : 'center', marginTop : '1rem'}}>{stat.lands} Lands</p>
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
            const oneS = root + 'ico-crazytime-slot-1.png'
            return <Image width={_squareLength} height={_squareLength} src={oneS}/>
        case 'two':
            const twoS = root + 'ico-crazytime-slot-2.png'
            return <Image width={_squareLength} height={_squareLength} src={twoS}/>
        case 'five':
            const fiveS = root + 'ico-crazytime-slot-5.png'
            return <Image width={_squareLength} height={_squareLength} src={fiveS}/>
        case 'ten':
            const tenS = root + 'ico-crazytime-slot-10.png'
            return <Image width={_squareLength} height={_squareLength} src={tenS}/>
        case 'coinflip':
            const coinFlipS = root + 'ico-crazytime-slot-cf.png'
            return <Image width={_rectWidht} height={_rectHeight} src={coinFlipS}/>
        case 'cashhunt':
            const cashHuntS = root + 'ico-crazytime-slot-ch.png'
            return <Image width={_rectWidht} height={_rectHeight} src={cashHuntS}/>
        case 'crazytime':
            const crazyTimeS = root + 'ico-crazytime-slot-ct.png'
            return <Image width={_rectWidht} height={_rectHeight} src={crazyTimeS}/>
        case 'pachinko':
            const pachinkoS = root + 'ico-crazytime-slot-pa.png'
            return <Image width={_rectWidht} height={_rectHeight} src={pachinkoS}/>
    }
}