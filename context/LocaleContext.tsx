import React, { useState, createContext, useEffect, SetStateAction } from "react"
import { FunctionComponent } from "react"
import { translate } from "../translations/TranslationsUtils"

interface LocaleContextInterface {
    contextCountry : string,
    setContextCountry : any,
    t : any
}

// Create Context Object
export const LocaleContext = createContext<LocaleContextInterface>({
    contextCountry : 'it',
    setContextCountry : {},
    t : undefined
})

// Create a provider for components to consume and subscribe to changes
export const LocaleContextProvider : FunctionComponent = ( props : any) => {

    const [country, setCountry] = useState('it')

    useEffect(() => {
        console.log(country)
    }, [country])
    
    const t = (key : string) => translate(country, key)

    const setContextCountry = (countryCode :string) => setCountry(countryCode)

    return(
        <LocaleContext.Provider value={{contextCountry : country, setContextCountry, t}}>
            {props.children}
        </LocaleContext.Provider>
    )

}