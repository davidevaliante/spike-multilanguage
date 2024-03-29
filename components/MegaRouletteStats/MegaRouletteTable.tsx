import React, { FunctionComponent, useState, useContext } from 'react'
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Button,
    withStyles,
    Theme,
    createStyles,
    Checkbox,
    TableSortLabel,
    makeStyles,
    TablePagination,
    FormControlLabel,
    Switch,
    IconButton,
} from '@material-ui/core'
import { symbolToSlotResultImage, symbolToSpinResultImage } from '../../utils/ImageUtils'
import format from 'date-fns-tz/format'
import styled, { useTheme } from 'styled-components'
import { orderBy } from 'lodash'
import { LocaleContext } from '../../context/LocaleContext'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import { injectCDN } from '../../utils/Utils'
import { symbolToStatImage2 } from '../Cards/SweetBonanzaCandylandCard'
import { symbolToStatImage } from '../Cards/MegaWheelCard'
import { MegaRouletteSpin } from '../../data/models/MegaRouletteSpin'
import { megaRouletteSymbolToColor } from '../Cards/MegaRouletteCard'

interface Props {
    rows: MegaRouletteSpin[]
}

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    })
)(TableRow)

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
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
    classes: ReturnType<typeof useStyles>
    numSelected: number
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof MegaRouletteSpin) => void
    order: Order
    orderBy: string
    rowCount: number
}

interface HeadCell {
    disablePadding: boolean
    id: keyof MegaRouletteSpin
    label: string
    numeric: boolean
}

const headCells: HeadCell[] = [
    { id: 'timeMillis', numeric: true, disablePadding: true, label: 'Occurred At' },
    { id: 'result', numeric: false, disablePadding: false, label: 'Result' },
    { id: 'slots', numeric: false, disablePadding: true, label: 'Mega Multipliers' },
    { id: 'multiplier', numeric: true, disablePadding: false, label: 'Multipliersb' },
    { id: 'dealer', numeric: false, disablePadding: false, label: 'Dealer' },
    { id: 'players', numeric: true, disablePadding: false, label: 'Players' },
]

export const EnhancedTableHead: FunctionComponent<TableHeadProps> = ({
    classes,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
}) => {
    const createSortHandler = (property: keyof MegaRouletteSpin) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property)
    }

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    return (
        <TableHead style={{ background: '#db0d30' }}>
            <TableRow>
                {headCells.map((headCell, i) => (
                    <StyledTableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {t(headCell.label)}
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
    rows: MegaRouletteSpin[]
}

export const MegaRouletteTable: FunctionComponent<EnhancedTableProps> = ({ rows }) => {
    const classes = useStyles()
    const [order, setOrder] = useState<Order>('desc')
    const [orderBy, setOrderBy] = useState<keyof MegaRouletteSpin>('timeMillis')
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [dense, setDense] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof MegaRouletteSpin) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    return (
        <TableWrapper>
            <div className={classes.root}>
                <Paper elevation={6} className={classes.paper}>
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby='tableTitle'
                            size={dense ? 'small' : 'medium'}
                            aria-label='enhanced table'
                        >
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
                                        const labelId = `enhanced-table-checkbox-${index}`

                                        return (
                                            <StyledTableRow hover tabIndex={-1} key={`orderable_${index}`}>
                                                <TableCell
                                                    style={{ fontFamily: 'Montserrat' }}
                                                    align='center'
                                                    component='th'
                                                    id={labelId}
                                                    scope='row'
                                                    padding='none'
                                                >
                                                    {format(
                                                        new Date(row.timeMillis as number).getTime() + 2 * 3600 * 1000,
                                                        'dd/MM HH:mm'
                                                    )}
                                                </TableCell>

                                                <TableCell align='left'>
                                                    <SlotSymbol
                                                        bgColor={megaRouletteSymbolToColor(row.result as number)}
                                                    >
                                                        {row.result}
                                                    </SlotSymbol>
                                                </TableCell>

                                                <TableCell style={{ fontFamily: 'Montserrat' }} align='left'>
                                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                        {(row.slots as unknown as any).map((data: any) => (
                                                            <MultiplierCard
                                                                bgColor={megaRouletteSymbolToColor(
                                                                    data.result as number
                                                                )}
                                                            >
                                                                {data.result}
                                                                <div className='mega-multiplier'>
                                                                    {`x${data.multiplier}`}
                                                                </div>
                                                            </MultiplierCard>
                                                        ))}
                                                    </div>
                                                </TableCell>

                                                <TableCell
                                                    align='left'
                                                    style={{
                                                        fontWeight: (row.slots as unknown as any)
                                                            .map((mm) => mm.result)
                                                            .includes(row.result)
                                                            ? 'bold'
                                                            : 'normal',
                                                        fontSize: (row.slots as unknown as any)
                                                            .map((mm) => mm.result)
                                                            .includes(row.result)
                                                            ? '1.5rem'
                                                            : '1rem',
                                                    }}
                                                >
                                                    {row.multiplier}x
                                                </TableCell>

                                                <TableCell style={{ fontFamily: 'Montserrat' }} align='left'>
                                                    {row.dealer}
                                                </TableCell>

                                                <TableCell style={{ fontFamily: 'Montserrat' }} align='center'>
                                                    {row.players}
                                                </TableCell>
                                            </StyledTableRow>
                                        )
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component='div'
                        labelRowsPerPage={<p>{t('Rows per page')}</p>}
                        labelDisplayedRows={({ from, to, count }) => ``}
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </Paper>
            </div>
        </TableWrapper>
    )
}

const SlotSymbol = styled.div<{ bgColor: string }>`
    background-color: ${(props) => props.bgColor};
    width: 46px;
    height: 46px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-weight: bold;
`

const MultiplierCard = styled.div<{ bgColor: string }>`
    background-color: ${(props) => props.bgColor};
    width: 46px;
    height: 46px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-weight: bold;

    border: 4px solid gold;

    position: relative;

    .mega-multiplier {
        border: 2px solid gold;
        position: absolute;
        bottom: -16px;
        background-color: ${(props) => props.bgColor};
        padding: 0rem 0.5rem;
        border-radius: 6px;
        font-size: 0.6rem;
    }
`

interface TablePaginationActionsProps {
    count: number
    page: number
    rowsPerPage: number
    onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme()
    const { count, page, rowsPerPage, onChangePage } = props

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, 0)
    }

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page - 1)
    }

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page + 1)
    }

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <div>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label='first page'>
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label='previous page'>
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label='next page'
            >
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label='last page'
            >
                <LastPageIcon />
            </IconButton>
        </div>
    )
}

// const CrazyTimeTable : FunctionComponent<Props> = ({rows}) => {

//     // opens the video windows on a free Vercel instance
//     const handleOpenVideo = (url : string) => window.open(`https://crazy-time-scalper.vercel.app/video/${url.split('/').pop()}`)

//     return (
//         <TableWrapper>
//             <TableContainer component={Paper}>
//                 <Table aria-label="simple table">
//                     <TableHead style={{background : '#db0d30' }}>
//                         <TableRow>
//                             <StyledTableCell>Occured at</StyledTableCell>
//                             <StyledTableCell align="left">Slot Result</StyledTableCell>
//                             <StyledTableCell align="left">Spin Result</StyledTableCell>
//                             <StyledTableCell align="left">Multiplier</StyledTableCell>
//                             <StyledTableCell align="left">Total Winner</StyledTableCell>
//                             <StyledTableCell align="left">Total Payout</StyledTableCell>
//                             <StyledTableCell align="right">Watch Video</StyledTableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                     {rows.map((row) => (
//                         <StyledTableRow key={row._id}>
//                             <TableCell component="th" scope="row">
//                                 {format(row.timeOfSpin, 'dd/MM HH:mm')}
//                             </TableCell>
//                             <TableCell align="left">
//                                 <SlotResultSpan>
//                                     {symbolToSlotResultImage(row.slotResultSymbol)}
//                                     <p>{row.slotResult}</p>
//                                 </SlotResultSpan>
//                             </TableCell>
//                             <TableCell align="left">
//                                 <SpinResultSpan>
//                                     {symbolToSpinResultImage(row.spinResultSymbol)}
//                                 </SpinResultSpan>
//                             </TableCell>
//                             <MultiplierTableCell spin={row}/>
//                             <TableCell align="left">{row.totalWinners}</TableCell>
//                             <TableCell align="left">{row.totalPayout}€</TableCell>
//                             <TableCell align="right">{row.watchVideo !== 'no_video' ? <Button onClick={() => handleOpenVideo(row.watchVideo)} color='primary' variant='contained'>Watch</Button> : ''}</TableCell>
//                         </StyledTableRow>
//                     ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </TableWrapper>
//     )
// }

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
    })
)

const TableWrapper = styled.div``

export const StyledTableCell = styled(TableCell)`
    font-weight: bold !important;
    color: white !important;
    padding: 16px;
`

const SlotResultSpan = styled.span`
    display: inline-flex;
    align-items: center;

    p {
        margin-left: 1rem;
    }
`
const SpinResultSpan = styled.span`
    display: inline-flex;
    align-items: center;

    p {
        margin-left: 1rem;
    }
`
