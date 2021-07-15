export class DreamCatcherSpin {
    constructor(
        // unique identifier
        public _id :  string,

        // time related - when the spin occurred
        public timeOfSpin : number,
        public rawTime : string,
        public date : Date,

        public spinResultSymbol : string,
        public multiplier : string,

        public specialMultiplier : string,

        public totalWinners : number,
        public totalPayout : number,

        public watchVideo : string,
    ){}
}

export enum DreamCatcherSymbol{
    one='one',
    two='two',
    five='five',
    ten='ten',
    twenty='twenty',
    fourty='fourty',
    twox='twox',
    sevenx='sevenx'
}

export const stringToDreamcatcherSymbol = (s : string) => {
    if(s === "one") return DreamCatcherSymbol.one
    if(s === "two") return DreamCatcherSymbol.two
    if(s === "five") return DreamCatcherSymbol.five
    if(s === "ten") return DreamCatcherSymbol.ten
    if(s === "twenty") return DreamCatcherSymbol.twenty
    if(s === "fourty") return DreamCatcherSymbol.fourty
    if(s === "twox") return DreamCatcherSymbol.twox
    if(s === "sevenx") return DreamCatcherSymbol.sevenx
}

export const dreamcatcherSymbolToFilterOption = (s : string) => {
    if(s === DreamCatcherSymbol[DreamCatcherSymbol.one]) return "1"
    if(s === DreamCatcherSymbol[DreamCatcherSymbol.two]) return "2"
    if(s === DreamCatcherSymbol[DreamCatcherSymbol.five]) return "5"
    if(s === DreamCatcherSymbol[DreamCatcherSymbol.ten]) return "10"
    if(s === DreamCatcherSymbol[DreamCatcherSymbol.twenty]) return "20"
    if(s === DreamCatcherSymbol[DreamCatcherSymbol.fourty]) return "40"
    if(s === DreamCatcherSymbol[DreamCatcherSymbol.twox]) return "2x"
    if(s === DreamCatcherSymbol[DreamCatcherSymbol.sevenx]) return "7x"
    return "1"
}