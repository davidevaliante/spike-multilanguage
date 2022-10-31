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

    return <StyledHeader>{countryToString(contextCountry)}</StyledHeader>
}

const StyledHeader = styled.h4`
    font-weight: bold;
    font-family: 'Kanit';
    color: ${(props) => props.theme.colors.primary};
    padding: 0rem 1rem;
    font-size: 1.5rem;
    position: absolute;
    top: 10px;
`

export default SidebarBonusHeader
