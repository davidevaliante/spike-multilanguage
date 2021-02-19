import { editSlotInput } from './../schema'

export const CREATE_SLOT = `
     mutation CREATE_SLOT ($newSlotData : SlotInput!){
        createSlot(input:{
            data:$newSlotData                
        }){
            slot{
                name                
            }
        }
    }
`

export const UPDATE_RELATED_SLOTS = `
    mutation UPDATE_RELATED_SLOTS($where : InputID!, $data : editSlotInput!){
        updateSlot(input:{
            where: $where,
            data : $data
        }){
            slot{
                id
                name
            }
        }
    }
`

export const CREATE_SUPPORTED_COUNTRY = `
mutation MUTATION($input:SupportedCountryInput){
    createSupportedCountry(input:{
     data:$input
    }){
      supportedCountry{
        name
      }
    }
  }
`