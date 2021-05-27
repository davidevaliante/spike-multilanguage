export class MonopolySpin {
    constructor(
        // unique identifier
        public _id :  string,

        // time related - when the spin occurred
        public timeOfSpin : number,
        public rawTime : string,
        public date : Date,

        public spinResultSymbol : string,
        public multiplier : string,

        public boardRolls : string,
        public chanceMultiplier : string,

        public totalWinners : number,
        public totalPayout : number,

        public watchVideo : string,
    ){}
}

export enum MonopolySymbol{
    one='one',
    two='two',
    five='five',
    ten='ten',
    tworolls='tworolls',
    fourrolls='fourrolls',
    chance='chance'
}

export const stringToMonopolySymbol = (s : string) => {
    if(s === "one") return MonopolySymbol.one
    if(s === "two") return MonopolySymbol.two
    if(s === "five") return MonopolySymbol.five
    if(s === "ten") return MonopolySymbol.ten
    if(s === "tworolls") return MonopolySymbol.tworolls
    if(s === "fourrolls") return MonopolySymbol.fourrolls
    if(s === "chance") return MonopolySymbol.chance
}

export const monopolySymbolToFilterOption = (s : string) => {
    if(s === MonopolySymbol[MonopolySymbol.one]) return "1"
    if(s === MonopolySymbol[MonopolySymbol.two]) return "2"
    if(s === MonopolySymbol[MonopolySymbol.five]) return "5"
    if(s === MonopolySymbol[MonopolySymbol.ten]) return "10"
    if(s === MonopolySymbol[MonopolySymbol.tworolls]) return "2 Rolls"
    if(s === MonopolySymbol[MonopolySymbol.fourrolls]) return "4 Rolls"
    if(s === MonopolySymbol[MonopolySymbol.chance]) return "Chance"
    return "1"
}