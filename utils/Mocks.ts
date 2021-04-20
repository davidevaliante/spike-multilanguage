import { Spin, CrazyTimeSymbol } from './../data/models/Spin';
import now from 'lodash/now'

const randomIntFromInterval = (min : number, max : number) => Math.floor(Math.random() * (max - min + 1) + min)

export const buildRandomMockSpins = (size : number) => {
    const totalSpins = new Array(size).keys()

    return [...totalSpins].map((n) => {
        const randomTime = getRandomDateInTheHour()
        return new Spin(
            n.toString(),

            getRandomDateInTheHour(),
            new Date(randomTime).toString(),
            new Date(randomTime),

            getRandomSymbol(),
            '1X',
            getRandomSymbol(),
            '1X',

            randomIntFromInterval(100, 5000),
            randomIntFromInterval(1000, 200000),

            'no_video',
            'none',
            false
        )
    })

}

export const getRandomDateInTheHour = () => {
    const t = now()
    return t - randomIntFromInterval(1,60) * 1000 * 60
}


const getRandomSymbol = () => {
    const r = randomIntFromInterval(0,7)
    return Object.values(CrazyTimeSymbol)[r].toString()
}