import React, { FunctionComponent } from 'react'
import { Spin } from '../../data/models/Spin'
import { TableCell } from '@material-ui/core'
import Image from 'next/image'

interface Props {
    spin : Spin
}

const MultiplierTableCell : FunctionComponent<Props>= ({spin}) => {

    // helper render method for the multiplier column (Might be refactored in it's own component)
    const renderMultiplierCell = (spin : Spin) => {
        if(spin.multiplierInfo === 'none') return (
            <TableCell align="left">{spin.multiplier}</TableCell>
        )

        if(spin.multiplierInfo === 'heads') return (
            <TableCell align="left">
                <span style={{display : 'flex', alignItems : 'center', justifyContent : 'flex-start'}}>
                    <p style={{marginRight : '1rem'}}>{spin.multiplier}</p>
                    <Image width='36px' height='36px' src='/icons/crazy-time/heads.svg'/> 
                </span>
            </TableCell>
        )
        if(spin.multiplierInfo === 'tails') return (
            <TableCell align="left">
                <span style={{display : 'flex', alignItems : 'center', justifyContent : 'flex-start'}}>
                    <p style={{marginRight : '1rem'}}>{spin.multiplier}</p>
                    <Image width='36px' height='36px' src='/icons/crazy-time/tails.svg'/> 
                </span>
            </TableCell>
        )
        if(spin.multiplierInfo === 'ct') return (
            <TableCell align="left">
                <span>
                    {spin.multiplier}
                </span>
            </TableCell>
        )

        return <div></div>
    }

    return renderMultiplierCell(spin)
}

export default MultiplierTableCell
