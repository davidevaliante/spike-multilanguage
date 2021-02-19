import axios from 'axios'
import { SupportedCountries } from '../context/CountryContext'
import { firebaseDatabaseUrl } from './../data/firebaseConfig';
import { plainToClass } from 'class-transformer';
import { mapJsonToArray } from './../utils/Utils';
import { OldSlot } from '../data/models/Slot';

export const getAllSlots = async (country: SupportedCountries): Promise<OldSlot[]> => {
  const list = await axios(`${firebaseDatabaseUrl}/Slots/${country}.json`)

  return plainToClass(OldSlot, mapJsonToArray(list.data, true))
}

export const ALL_SLOTS_BY_COUNTRY = `
query SLOTS_BY_COUNTRY($code:String){
    slots(where: {country:{code:$code}}){
      id
      name
      description
      country{
        code
      }
      legacyId
    }
  }
`