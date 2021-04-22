import Image from 'next/image'

const root = '/icons/crazy-time/'

const squareLength = '50px'

const rectWidht = '89px'

const rectHeight = '49px'

export const symbolToSlotResultImage = (symbolString : string) => {
    switch(symbolString){
        case 'one':
            const oneS = root + 'ico-crazytime-slot-1.png'
            return <Image width={squareLength} height={squareLength} src={oneS}/>
        case 'two':
            const twoS = root + 'ico-crazytime-slot-2.png'
            return <Image width={squareLength} height={squareLength} src={twoS}/>
        case 'five':
            const fiveS = root + 'ico-crazytime-slot-5.png'
            return <Image width={squareLength} height={squareLength} src={fiveS}/>
        case 'ten':
            const tenS = root + 'ico-crazytime-slot-10.png'
            return <Image width={squareLength} height={squareLength} src={tenS}/>
        case 'coinflip':
            const coinFlipS = root + 'ico-crazytime-slot-cf.png'
            return <Image width={rectWidht} height={rectHeight} src={coinFlipS}/>
        case 'cashhunt':
            const cashHuntS = root + 'ico-crazytime-slot-ch.png'
            return <Image width={rectWidht} height={rectHeight} src={cashHuntS}/>
        case 'crazytime':
            const crazyTimeS = root + 'ico-crazytime-slot-ct.png'
            return <Image width={rectWidht} height={rectHeight} src={crazyTimeS}/>
        case 'pachinko':
            const pachinkoS = root + 'ico-crazytime-slot-pa.png'
            return <Image width={rectWidht} height={rectHeight} src={pachinkoS}/>
    }
}


export const symbolToSpinResultImage = (symbolString : string) => {
    switch(symbolString){
        case 'one':
            const oneS = root + 'ico-crazytime-1.png'
            return <Image width={rectWidht} height={rectHeight} src={oneS}/>
        case 'two':
            const twoS = root + 'ico-crazytime-2.png'
            return <Image width={rectWidht} height={rectHeight} src={twoS}/>
        case 'five':
            const fiveS = root + 'ico-crazytime-5.png'
            return <Image width={rectWidht} height={rectHeight} src={fiveS}/>
        case 'ten':
            const tenS = root + 'ico-crazytime-10.png'
            return <Image width={rectWidht} height={rectHeight} src={tenS}/>
        case 'coinflip':
            const coinFlipS = root + 'ico-crazytime-cf.png'
            return <Image width={rectWidht} height={rectHeight} src={coinFlipS}/>
        case 'cashhunt':
            const cashHuntS = root + 'ico-crazytime-ch.png'
            return <Image width={rectWidht} height={rectHeight} src={cashHuntS}/>
        case 'crazytime':
            const crazyTimeS = root + 'ico-crazytime-ct.png'
            return <Image width={rectWidht} height={rectHeight} src={crazyTimeS}/>
        case 'pachinko':
            const pachinkoS = root + 'ico-crazytime-pa.png'
            return <Image width={rectWidht} height={rectHeight} src={pachinkoS}/>
    }
}