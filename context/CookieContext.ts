import { createContext } from 'react'

export interface CookieContext {
    cookiesAccepted: 'accepted' | 'not_accepted' | 'unknown'
    updateCookiesAccepted: (updateCookiestatus: boolean) => void
}

export const DEFAULT_COOKIE_ACCEPTED = false

// build CONTEXT
export const CookieContextDefaultValue: CookieContext = {
    cookiesAccepted: 'unknown',
    updateCookiesAccepted: (updateCookiestatus: boolean) => { }
}

export const cookieContext = createContext<CookieContext>(CookieContextDefaultValue)