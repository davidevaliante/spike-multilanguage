export class MegaWheelSpin {
    constructor(
        public _id: string,

        // time related - when the spin occurred
        public time: string,
        public timeMillis: number,
        public date: Date,

        public gameId: string,
        public result: number,

        public slot: number,

        public multiplier: number,

        public players: number,

        public dealer: string
    ) {}
}

// export enum SweetBonanzaSymbol {
//     ONE = '1',
//     TWO = '2',
//     FIVE = '5',
//     CANDY_DROP = 'Candy Drop',
//     SWEET_SPINS = 'Sweet Spins',
//     BUBBLE_SPINS = 'Bubble Surprise',
// }
