import { useState, useCallback, useEffect } from 'react'
import { CookieContext } from '../context/CookieContext';
import { useCookies } from 'react-cookie'

export const useMyCookies = (): CookieContext => {

    const [cookies, setCookie, removeCookie] = useCookies(['accepted']);
    const [cookieAcceptedStatus, setCookiesAccepted] = useState<'accepted' | 'not_accepted' | 'unknown'>('accepted')

    useEffect(() => {
        console.log(cookieAcceptedStatus)
    }, [cookieAcceptedStatus])

    useEffect(() => {
        if (cookies.accepted && cookies.accepted === 'accepted') setCookiesAccepted('accepted')
        else {
            if (!cookies || cookies.accepted === undefined) {
                setCookiesAccepted('unknown')
            }
            if (cookies.accepted === 'not_accepted') setCookiesAccepted('not_accepted')
        }
    }, [cookies])

    const updateCookiesAccepted = useCallback((updatedCookieStatus: boolean): void => {
        if (updatedCookieStatus === true) {
            setCookie('accepted', 'accepted', {
                maxAge: 60 * 60 * 24 * 365
            })
            setCookiesAccepted('accepted')
        } else {
            setCookie('accepted', 'not_accepted', {
                maxAge: 60 * 60 * 24 * 365
            })
            setCookiesAccepted('not_accepted')
        }
    }, [])

    return {
        cookiesAccepted: cookieAcceptedStatus,
        updateCookiesAccepted
    }
}