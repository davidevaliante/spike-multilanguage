import Image from 'next/image'
import { injectCDN } from './Utils'

const root = '/icons/crazy-time/'

const squareLength = '50px'

const rectWidht = '89px'

const rectHeight = '49px'

export const symbolToSlotResultImage = (symbolString : string) => {
    switch(symbolString){
        case 'one':
            return <img width={squareLength} height={squareLength} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-1_db272f778d.png')}/>
        case 'two':
            return <img width={squareLength} height={squareLength} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-2_9fae79a563.png')}/>
        case 'five':
            return <img width={squareLength} height={squareLength} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-5_4b584c0988.png')}/>
        case 'ten':
            return <img width={squareLength} height={squareLength} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-10_c72360b662.png')}/>
        case 'coinflip':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-cf_7ed53595a8.png')}/>
        case 'cashhunt':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-ch_08e236c7e7.png')}/>
        case 'crazytime':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-ct_d430610c57.png')}/>
        case 'pachinko':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-slot-pa_1b1b4d7d6f.png')}/>
    }
}


export const symbolToSpinResultImage = (symbolString : string) => {
    switch(symbolString){
        case 'one':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-1_c9b5f94f87.png')}/>
        case 'two':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-2_5c5c16ed5e.png')}/>
        case 'five':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-5_e91e34891d.png')}/>
        case 'ten':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-10_6728a2b6a0.png')}/>
        case 'coinflip':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-cf_85575cab6d.png')}/>
        case 'cashhunt':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-ch_5e98cad8db.png')}/>
        case 'crazytime':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-ct_a7261a08f7.png')}/>
        case 'pachinko':
            return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/ico-crazytime-pa_e928e94532.png')}/>
    }
}