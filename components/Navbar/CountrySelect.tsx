import { Button, Menu, MenuItem } from '@material-ui/core';
import React, {useState} from 'react'
import { FunctionComponent } from 'react';
import styled from 'styled-components'

interface Props {
    initialCountry : string
}

const supportedCountries = ['it', 'row']

const getInitialCountry = (countryCode : string) => {
    if(supportedCountries.includes(countryCode)) return countryCode
    else return 'row'
}

const CountrySelect : FunctionComponent<Props> = ({initialCountry}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [items, setItems] = useState(supportedCountries)
    const [selectedFlag, setSelectedFlag] = useState(getInitialCountry(initialCountry))

    const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleCountryChange = (countryCode : string) => {
        setSelectedFlag(countryCode)
        handleClose()
    }

    return (
        <div>
            <Flag 
                onClick={handleClick}
                src={`/flags/${selectedFlag}.svg`} />

            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                    {items.map(i => <MenuItem>
                        <Flag 
                            onClick={ _ => handleCountryChange(i)}
                            src={`/flags/${i}.svg`}/>
                    </MenuItem>)}
            </Menu>
        </div>
        
    )
}

export const Flag = styled.img`
    cursor : pointer;
    height : 36px;
    width : 36px;
    border : 2px solid white;
    border-radius : 50%;
`

export default CountrySelect
