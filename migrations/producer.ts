import axios from 'axios'
import { SupportedCountries } from '../context/CountryContext'
import { Producer } from '../data/models/Producer'
import { firebaseDatabaseUrl } from './../data/firebaseConfig';
import { plainToClass } from 'class-transformer';
import { mapJsonToArray } from './../utils/Utils';

export const getAllProducers = async (country: SupportedCountries): Promise<Producer[]> => {
    const list = await axios(`${firebaseDatabaseUrl}/Producer/${country}.json`)

    return plainToClass(Producer, mapJsonToArray(list.data, true))
}

export const ALL_PRODUCERS_BY_COUNTRY = `
query PRODUCERS_BY_COUNTRY($code:String){
    producers(where:{country:{code:$code}}){
        id
        name
        legacyId
        description
    }
}
`

