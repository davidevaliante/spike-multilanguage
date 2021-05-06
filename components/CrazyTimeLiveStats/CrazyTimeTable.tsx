import React, { FunctionComponent, useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, Button, withStyles, Theme, createStyles, Checkbox, TableSortLabel, makeStyles, TablePagination, FormControlLabel, Switch } from '@material-ui/core'
import { symbolToSlotResultImage, symbolToSpinResultImage } from '../../utils/ImageUtils'
import MultiplierTableCell from './MultiplierTableCell'
import { Spin } from '../../data/models/Spin'
import format from 'date-fns-tz/format'
import styled from 'styled-components'
import { orderBy } from 'lodash'
import classes from '*.module.css'

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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface TableHeadProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Spin) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}


interface HeadCell {
    disablePadding: boolean
    id: keyof Spin
    label: string
    numeric: boolean
}

const headCells: HeadCell[] = [
    { id: 'date', numeric: true, disablePadding: true, label: 'Occurred At' },
    { id: 'slotResultSymbol', numeric: false, disablePadding: true, label: 'Slot Result' },
    { id: 'spinResultSymbol', numeric: true, disablePadding: false, label: 'Spin Result' },
    { id: 'multiplier', numeric: true, disablePadding: false, label: 'Multiplier' },
    { id: 'totalWinners', numeric: true, disablePadding: false, label: 'Total Winners' },
    { id: 'totalPayout', numeric: true, disablePadding: false, label: 'Total Payout' },
    { id: 'watchVideo', numeric: false, disablePadding: false, label: 'Watch Video' },
]

export const EnhancedTableHead : FunctionComponent<TableHeadProps> = ({ classes,  order, orderBy, numSelected, rowCount, onRequestSort }) => {

    const createSortHandler = (property: keyof Spin) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property)
    }


    return(
        <TableHead style={{background : '#db0d30'}}>
            <TableRow>
                {headCells.map((headCell, i) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={i == 0 ? 'center' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}>
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}>
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

interface EnhancedTableProps {
    rows : Spin[]
}

export const EnhancedTable : FunctionComponent<EnhancedTableProps> = ({rows}) => {

    const classes = useStyles()
    const [order, setOrder] = useState<Order>('desc')
    const [orderBy, setOrderBy] = useState<keyof Spin>('date')
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [dense, setDense] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Spin) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    }
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    
    const handleOpenVideo = (url : string) => window.open(`https://crazy-time-scalper.vercel.app/video/${url.split('/').pop()}`)

    return(
        <TableWrapper>
            <div className={classes.root}>
                <Paper elevation={6} className={classes.paper}>
                    <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table">
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                        {stableSort(rows as any, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <StyledTableRow
                                        hover
                                        tabIndex={-1}
                                        key={`orderable_${index}`}>
                                        <TableCell style={{fontFamily : 'Montserrat'}} align="center" component="th" id={labelId} scope="row" padding="none">
                                            {format(row.timeOfSpin, 'dd/MM HH:mm')}
                                        </TableCell>
                                        <TableCell align='left'>
                                            <SlotResultSpan>
                                                {symbolToSlotResultImage(row.slotResultSymbol as string)}
                                                <p style={{fontFamily : 'Montserrat'}}>{row.slotResult}</p>
                                            </SlotResultSpan>
                                        </TableCell>
                                        <TableCell align='left'>
                                            <SpinResultSpan>
                                                {symbolToSpinResultImage(row.spinResultSymbol as string)}
                                            </SpinResultSpan>
                                        </TableCell>
                                        <MultiplierTableCell spin={row as unknown as Spin}/>                                        
                                        <TableCell style={{fontFamily : 'Montserrat'}} align='left'>{row.totalWinners}</TableCell>
                                        <TableCell style={{fontFamily : 'Montserrat'}} align='left'>{row.totalPayout}</TableCell>
                                        <TableCell style={{fontFamily : 'Montserrat'}} align='right'>
                                            {row.watchVideo !== 'no_video' ? <Button onClick={() => handleOpenVideo(row.watchVideo as string)} color='primary' variant='contained'>Watch</Button> : ''}
                                        </TableCell>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </TableWrapper>
        
    )
}

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
)

const TableWrapper = styled.div`

`

export const StyledTableCell = styled(TableCell)`
    font-weight : bold !important;
    color : white !important;
    padding : 16px;
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

