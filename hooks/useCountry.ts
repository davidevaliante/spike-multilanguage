import { useState, useCallback, useEffect } from 'react'
import { CountryContext } from '../context/CountryContext'
import { DEFAULT_COUNTRY } from '../context/CountryContext';
import {useTranslation} from 'react-i18next'

export const useCountry = (): CountryContext => {
    
    const {i18n} = useTranslation()
    const [country, setCountry] = useState('')

    // setCurrent country code using the 'public-ip' plugin 
    const setCurrentCountry = useCallback(async() => {
        const publicIp = require('public-ip');
        let ip: any
        ip = await publicIp.v4()
        const res = await fetch('http://ip-api.com/json/' + ip)
        const country: any = await res.json()
        const countryCode = country.countryCode.toLowerCase(); // get current country code
        
        if(countryCode){
            i18n.changeLanguage(countryCode) // set current country code for language
            setCountry(countryCode) // set current country code for redirecting page with current country code
        }else{
            i18n.changeLanguage(DEFAULT_COUNTRY) // not getting country code then pass current country code as default country code
            setCountry(DEFAULT_COUNTRY)
        }
    }, [country,setCountry])


    useEffect(() => {
        setCurrentCountry()
    },[setCurrentCountry])
   
    return {
        currentCountry: country,
        setCurrentCountry
    }
    
}