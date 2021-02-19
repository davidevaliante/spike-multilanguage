import { SupportedCountries } from "../../context/CountryContext"
import axios from 'axios'
import { firebaseDatabaseUrl } from "../firebaseConfig"
import { plainToClass } from 'class-transformer'
import { mapJsonToArray } from './../../utils/Utils'
import { Bonus } from "../models/Bonus"
import snakeCase from 'lodash/snakeCase'

export const getBonusById = async (bonusId: string, countryCode: SupportedCountries): Promise<Bonus> => {

    const result = await axios.get(`${firebaseDatabaseUrl}/Bonus/${countryCode}/${bonusId}.json`)

    const { data } = result
    
    const b = new Bonus(
        bonusId,
        bonusId,
        snakeCase(data.name),
        data.bonus,
        data.bonusImageBg,
        data.borderColor,
        data.bonusCompareLink,
        data.guideId,
        data.link,
        data.name,
        data.noDepositText,
        data.rating,
        data.time,
        data.tips,
        data.withDepositText,
        'public'
    )

    return b
}

export const getHomeBonus = async (countryCode: SupportedCountries): Promise<Bonus[]> => {

    const result = await axios.get(`${firebaseDatabaseUrl}/Bonus/${countryCode}.json?orderBy="name"&limitToFirst=5`)

    const { data } = result

    return plainToClass(Bonus, mapJsonToArray(data, true))
}

