export class MegaRouletteSpin {
    constructor(
        public _id: string,

        // time related - when the spin occurred
        public time: string,
        public timeMillis: number,
        public date: Date,

        public gameId: string,
        public result: number,
        public color: string,

        public slots: {
            result: number
            multiplier: number
        }[],

        public multiplier: number,

        public players: number,

        public dealer: string
    ) {}
}
