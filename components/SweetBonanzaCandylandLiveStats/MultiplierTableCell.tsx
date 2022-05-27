import React, { FunctionComponent } from 'react'
import { Spin } from '../../data/models/Spin'
import { TableCell } from '@material-ui/core'
import Image from 'next/image'
import styled from 'styled-components'
import { SweetBonanzaSpin } from '../../data/models/SweetBonanzaSpin'

interface Props {
    spin: SweetBonanzaSpin
}

const MultiplierTableCell: FunctionComponent<Props> = ({ spin }) => {
    // helper render method for the multiplier column (Might be refactored in it's own component)
    const renderMultiplierCell = (spin: SweetBonanzaSpin) => {
        return <div>{spin.multiplier}</div>
    }

    return renderMultiplierCell(spin)
}

export default MultiplierTableCell
