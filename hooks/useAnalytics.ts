import { useContext, useEffect } from 'react'
import { initializeAnalytics } from '../analytics/base'
import { cookieContext } from '../context/CookieContext'

export const useAnalytics = (pageName: string) => {
    const { cookiesAccepted, updateCookiesAccepted } = useContext(cookieContext)

    useEffect(() => {
        if (cookiesAccepted === 'accepted') initializeAnalytics(pageName)
    }, [cookiesAccepted])
}
