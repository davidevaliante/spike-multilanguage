
export const CREATE_BONUS = `
     mutation CreateBonus ($newBonusData : BonusInput!){
        createBonus(input:{
            data:$newBonusData                
        }){
            bonus{
                name                
            }
        }
    }
`