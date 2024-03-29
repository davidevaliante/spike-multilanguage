export interface MonopolyTables {
    _id : string,
    time : number
    lowTierTable : {
        id : string,
        type : 'low' | 'mid' | 'high',
        timeOfSpins : number,
        rows : MonopolyTableRow[]
    },
    midTierTable : {
        id : string,
        type : 'low' | 'mid' | 'high',
        timeOfSpins : number,
        rows : {
          rowPosition : number,
          percentage : number,
          lands : number,
          total : number
        }[]
    },
    highTierTable : {
        id : string,
        type : 'low' | 'mid' | 'high',
        timeOfSpins : number,
        rows : {
          rowPosition : number,
          percentage : number,
          lands : number,
          total : number
        }[]
    }
}

export interface MonopolyTableRow {
  rowPosition : number,
  percentage : number,
  lands : number,
  total : number
}