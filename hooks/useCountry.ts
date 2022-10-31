import { useEffect, useState } from 'react'
import { mainCountry } from '../config'
import { getUserCountryCode } from '../utils/Utils'

export const useCountry = () => {
    const [country, setCountry] = useState(mainCountry)

    useEffect(() => {
        geolocateUser()
    }, [country])

    const geolocateUser = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        setCountry(geoLocatedCountryCode)
    }

    return country
}
