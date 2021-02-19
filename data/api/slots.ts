import { SupportedCountries } from "../../context/CountryContext"
import { SlotCard } from "../models/Slot"
import axios from 'axios'
import { firebaseDatabaseUrl } from "../firebaseConfig"
import { plainToClass } from 'class-transformer'
import { mapJsonToArray } from './../../utils/Utils'
import { OldSlot } from '../models/Slot'
import upperCase from 'lodash/upperCase'

export const getSlotCardById = async (slotId: string, countryCode: SupportedCountries): Promise<SlotCard> => {

    const result = await axios.get(`${firebaseDatabaseUrl}/SlotsCard/${countryCode}/${slotId}.json`)

    const slotCard = new SlotCard(
        slotId,
        result.data.description,
        result.data.name,
        result.data.producer,
        result.data.rating,
        result.data.specialBonusLink,
        result.data.time,
        result.data.type
    )
    return slotCard
}

export const getLatestOnlineSlot = async (countryCode: SupportedCountries): Promise<SlotCard[]> => {

    const result = await axios.get(`${firebaseDatabaseUrl}/SlotsCard/${countryCode}.json?orderBy="time"&limitToLast=21`)

    return plainToClass(SlotCard, result.data)
}

export const getSlotByName = async (slotName: string, country: SupportedCountries): Promise<OldSlot[]> => {
    
    const slotData = await axios.get(`${firebaseDatabaseUrl}/Slots/${country}.json?orderBy="name"&equalTo="${upperCase(slotName)}"`)

    return plainToClass(OldSlot, mapJsonToArray(slotData.data, true))
}

