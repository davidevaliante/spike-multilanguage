import React, { FunctionComponent } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, Button, withStyles, Theme, createStyles } from '@material-ui/core'
import { StyledTableCell } from '../../pages/live-stats/crazy-time/[countryCode]'
import { symbolToSlotResultImage, symbolToSpinResultImage } from '../../utils/ImageUtils'
import MultiplierTableCell from './MultiplierTableCell'
import { Spin } from '../../data/models/Spin'
import format from 'date-fns-tz/format'
import styled from 'styled-components'

interface Props {
    rows : Spin[]
}

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow)

const CrazyTimeTable : FunctionComponent<Props> = ({rows}) => {

    // opens the video windows on a free Vercel instance
    const handleOpenVideo = (url : string) => window.open(`https://crazy-time-scalper.vercel.app/video/${url.split('/').pop()}`)

    return (
        <TableWrapper>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead style={{background : '#db0d30' }}>
                        <TableRow>
                            <StyledTableCell>Occured at</StyledTableCell>
                            <StyledTableCell align="left">Slot Result</StyledTableCell>
                            <StyledTableCell align="left">Spin Result</StyledTableCell>
                            <StyledTableCell align="left">Multiplier</StyledTableCell>
                            <StyledTableCell align="left">Total Winner</StyledTableCell>
                            <StyledTableCell align="left">Total Payout</StyledTableCell>
                            <StyledTableCell align="right">Watch Video</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row._id}>
                            <TableCell component="th" scope="row">
                                {format(row.timeOfSpin, 'dd/MM HH:mm')}
                            </TableCell>
                            <TableCell align="left">
                                <SlotResultSpan>
                                    {symbolToSlotResultImage(row.slotResultSymbol)}
                                    <p>{row.slotResult}</p>
                                </SlotResultSpan>
                            </TableCell>
                            <TableCell align="left">
                                <SpinResultSpan>
                                    {symbolToSpinResultImage(row.spinResultSymbol)}
                                </SpinResultSpan>
                            </TableCell>
                            <MultiplierTableCell spin={row}/>
                            <TableCell align="left">{row.totalWinners}</TableCell>
                            <TableCell align="left">{row.totalPayout}€</TableCell>
                            <TableCell align="right">{row.watchVideo !== 'no_video' ? <Button onClick={() => handleOpenVideo(row.watchVideo)} color='primary' variant='contained'>Watch</Button> : ''}</TableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </TableWrapper>
    )
}

const TableWrapper = styled.div`

`

const SlotResultSpan = styled.span`
    display : inline-flex;
    align-items: center;  

    p{
        margin-left : 1rem
    }
`
const SpinResultSpan = styled.span`
    display : inline-flex;
    align-items: center;  

    p{
        margin-left : 1rem
    }
`

export default CrazyTimeTable
