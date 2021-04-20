export class Spin {

    constructor(
        // unique identifier
        public _id :  string,

        // time related - when the spin occurred
        public timeOfSpin : number,
        public rawTime : string,
        public date : Date,

        
        public slotResultSymbol : string,
        public slotResult : string,
        public spinResultSymbol : string,
        public multiplier : string,

        public totalWinners : number,
        public totalPayout : number,

        public watchVideo : string,
        public multiplierInfo : 'heads' | 'tails' | 'ct' | 'none',
        public sameSlotAndSpinResult : boolean,
    ){}

}

export enum CrazyTimeSymbol{
    one,
    two,
    five,
    ten,
    cashhunt,
    pachinko,
    coinflip,
    crazytime
}