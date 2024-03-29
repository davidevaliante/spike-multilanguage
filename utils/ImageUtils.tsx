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


export const symbolToSpinResultImage = (symbolString : string, game : 'crazy-time' | 'monopoly' | 'dreamcatcher' = 'crazy-time') => {
    if(game === 'crazy-time'){
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

    if(game === 'monopoly'){
        switch(symbolString){
            case 'one':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-1_33a076459b.png')}/>
            case 'two':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-2_76b8237627.png')}/>
            case 'five':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-5_23a698085f.png')}/>
            case 'ten':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-10_abec4dd827.png')}/>
            case 'chance':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/chance-monopoly_f668ac3e67.png')}/>
            case 'tworolls':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-2r_ee78ad08f5.png')}/>
            case 'fourrolls':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-4r_404d02b0de.png')}/>
        }
    }

    if(game === 'dreamcatcher'){
        switch(symbolString){
            case 'one':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dream-1_833467952a.png')}/>
            case 'two':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dream-2_56ce403c16.png')}/>
            case 'five':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dream-5_c9b1f823b1.png')}/>
            case 'ten':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dream-10_45ea179a8c.png')}/>
            case 'twenty':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dream-20_25b58433fd.png')}/>
            case 'fourty':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dream-40_2d67647708.png')}/>
            case 'twox':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dream-2x_ca1958f422.png')}/>
            case 'sevenx':
                return <img width={rectWidht} height={rectHeight} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dream-7x_710530a00a.png')}/>
        }
    }
}