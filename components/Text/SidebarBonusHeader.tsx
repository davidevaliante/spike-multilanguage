import { StyledProps } from '@material-ui/core'
import React, { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import { LocaleContext } from '../../context/LocaleContext'

interface ISidebarBonusHeader {}

const SidebarBonusHeader: FunctionComponent<ISidebarBonusHeader> = () => {
    const {
        t,
        appCountry: contextCountry,
        setAppCountry: setContextCountry,
        userCountry,
        setUserCountry,
    } = useContext(LocaleContext)

    const countryToString = (cc: string) => {
        switch (cc) {
            case 'it':
                return 'Comparazione offerte di Benvenuto di siti legali'

            default:
                return 'Best Welcome Bonuses'
        }
    }

    return <StyledHeader className='font-serif'>{countryToString(contextCountry)}</StyledHeader>
}

const StyledHeader = styled.h4`
    font-weight: bold;
    color: ${(props) => props.theme.colors.primary};
    font-size: 1.1rem;
    position: absolute;
    top: 1px;
`

export default SidebarBonusHeader
