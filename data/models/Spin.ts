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

export const stringToCrazyTimeSymbol = (s : string) => {
    if(s === "1") return CrazyTimeSymbol.one
    if(s === "2") return CrazyTimeSymbol.two
    if(s === "5") return CrazyTimeSymbol.five
    if(s === "10") return CrazyTimeSymbol.ten
    if(s === "Cash Hunt") return CrazyTimeSymbol.cashhunt
    if(s === "Coin Flip") return CrazyTimeSymbol.coinflip
    if(s === "Crazy Time") return CrazyTimeSymbol.crazytime
    if(s === "Pachinko") return CrazyTimeSymbol.pachinko
}

export const crazyTimeSymbolToFilterOption = (s : string) => {
    if(s === CrazyTimeSymbol[CrazyTimeSymbol.one]) return "1"
    if(s === CrazyTimeSymbol[CrazyTimeSymbol.two]) return "2"
    if(s === CrazyTimeSymbol[CrazyTimeSymbol.five]) return "5"
    if(s === CrazyTimeSymbol[CrazyTimeSymbol.ten]) return "10"
    if(s === CrazyTimeSymbol[CrazyTimeSymbol.cashhunt]) return "Cash Hunt"
    if(s === CrazyTimeSymbol[CrazyTimeSymbol.coinflip]) return "Coin Flip"
    if(s === CrazyTimeSymbol[CrazyTimeSymbol.pachinko]) return "Pachinko"
    if(s === CrazyTimeSymbol[CrazyTimeSymbol.crazytime]) return "Crazy Time"
    return "1"
}