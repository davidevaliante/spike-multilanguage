import React, { useState, createContext, useEffect, SetStateAction } from "react"
import { FunctionComponent } from "react"
import { translate } from "../translations/TranslationsUtils"

interface LocaleContextInterface {
    contextCountry : string,
    setContextCountry : any,
    userCountry : any,
    setUserCountry : any,
    t : any
}

// Create Context Object
export const LocaleContext = createContext<LocaleContextInterface>({
    contextCountry : 'it',
    setContextCountry : {},
    userCountry : undefined,
    setUserCountry : undefined,
    t : undefined
})

// Create a provider for components to consume and subscribe to changes
export const LocaleContextProvider : FunctionComponent = ( props : any) => {

    const [country, setCountry] = useState('it')
    const [_userCountry, set_userCountry] = useState('')
    
    const t = (key : string) => translate(country, key)

    const setContextCountry = (countryCode :string) => setCountry(countryCode)
    const setUserCountry = (countryCode : string) => set_userCountry(countryCode)

    return(
        <LocaleContext.Provider value={{
            contextCountry : country, 
            setContextCountry, 
            t, 
            userCountry : _userCountry,
            setUserCountry
        }}>
            {props.children}
        </LocaleContext.Provider>
    )
}