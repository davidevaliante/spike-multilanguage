export class SweetBonanzaSpin {
    constructor(
        // unique identifier
        public _id: string,

        // time related - when the spin occurred
        public time: string,
        public timeMillis: number,
        public date: string,

        public dealer: string,
        public gameId: string,
        public multiplier: number,

        public sugarbomb: boolean,
        public rc: number,
        public payout: number[],

        public result: string,
        public sbmul: number[],

        public players: number,

        public winner?: string
    ) {}
}

export enum SweetBonanzaSymbol {
    ONE = '1',
    TWO = '2',
    FIVE = '5',
    CANDY_DROP = 'Candy Drop',
    SWEET_SPINS = 'Sweet Spins',
    BUBBLE_SPINS = 'Bubble Surprise',
}
