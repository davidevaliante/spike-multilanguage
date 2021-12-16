export class LightningDiceSpin {
    constructor(
        // unique identifier
        public _id: string,

        // time related - when the spin occurred
        public timeOfSpin: number,
        public rawTime: string,
        public date: Date,

        public multiplier: string,

        public isLightning: boolean,

        public dices: number[],
        public total: number,
        public lightningNumbers: {
            value: string
            multiplier: number
        }[],

        public totalWinners: number,
        public totalPayout: string
    ) {}
}
