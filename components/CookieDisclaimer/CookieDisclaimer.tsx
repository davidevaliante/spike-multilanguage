import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { tablet } from './../Responsive/Breakpoints'
import { LocaleContext } from '../../context/LocaleContext'

interface Props {
    onCookiesAccepted: () => void
    onCookiesRefused: () => void
}

const CookieDisclaimer: FunctionComponent<Props> = ({ onCookiesAccepted, onCookiesRefused }) => {
    const {
        t,
        appCountry: contextCountry,
        setAppCountry: setContextCountry,
        userCountry,
        setUserCountry,
    } = useContext(LocaleContext)

    const countryCodeToCountryName = (cc: string) => {
        switch (cc) {
            case 'it':
                return 'in Italy'

            case 'ca':
                return 'in Canada'

            case 'nz':
                return 'in New Zeland'

            case 'gb':
                return 'in the United Kingdom'

            case 'rs':
                return 'in Serbia'

            case 'me':
                return 'in Montenegro'

            default:
                return ''
        }
    }

    return (
        <StyleProvider>
            <p>
                This website uses real time data about bonuses offered by selected and legal Bookmakers{' '}
                {countryCodeToCountryName(contextCountry)}. Please do NOT continue on this website if you are under 18
                years old. This site uses cookies and geolocation to personalize content and to analyse traffic. If you
                continue without changing your settings, we'll assume that you are happy to receive all cookies on Spike
                Slot. <a href='/cookie-privacy-policy'>Learn More</a>
            </p>

            <div className='button-container'>
                <h1 className='accept' onClick={() => onCookiesAccepted()}>
                    {t('Accept')}
                </h1>
                <h1 className='refuse' onClick={() => onCookiesRefused()}>
                    {t('Refuse')}
                </h1>
            </div>
        </StyleProvider>
    )
}

const StyleProvider = styled.div`
    position: fixed;
    bottom: 0;
    justify-content: center;
    color: white;
    padding: 1rem;
    z-index: 999;
    background: #ff955c;
    text-align: center;

    .button-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        h1 {
            cursor: pointer;
            padding: 0.7rem 1rem;
        }
    }

    .accept {
        background: #06bf09;
        width: 250px;
        text-align: center;
        margin-top: 0.5rem;
        border-radius: 4px;
        color: white;

        ${tablet} {
            margin-right: 1rem;
        }
    }

    .refuse {
        background: ${(props) => props.theme.colors.primary};
        width: 250px;
        text-align: center;
        margin-top: 0.5rem;
        border-radius: 4px;
        color: white;

        ${tablet} {
            margin-left: 1rem;
        }
    }

    P {
        font-size: 0.8rem;
        padding: 1rem;
    }

    a {
        cursor: pointer;
        color: #0502e2;
        font-weight: bold;
    }
`

export default CookieDisclaimer
