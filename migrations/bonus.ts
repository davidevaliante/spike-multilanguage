import axios from 'axios'
import { SupportedCountries } from '../context/CountryContext';
import { firebaseDatabaseUrl } from './../data/firebaseConfig';
import { plainToClass } from 'class-transformer';
import { mapJsonToArray } from './../utils/Utils';
import { Bonus } from '../data/models/Bonus';

export const getAllBonuses = async (country: SupportedCountries): Promise<Bonus[]> => {
    const list = await axios(`${firebaseDatabaseUrl}/Bonus/${country}.json`)

    return plainToClass(Bonus, mapJsonToArray(list.data, true))
}

export const ALL_BONUSES_BY_COUNTRY = `
    query BONUS_BY_COUNTRY($code:String){
        bonuses(where: {country:{code:$code}}){
            id
            name
            legacyId
        }
    }
`