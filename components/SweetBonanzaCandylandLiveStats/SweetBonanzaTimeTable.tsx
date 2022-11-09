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
import MultiplierTableCell from './MultiplierTableCell'
import { SweetBonanzaSpin } from '../../data/models/SweetBonanzaSpin'
import { injectCDN } from '../../utils/Utils'
import { symbolToStatImage, symbolToStatImage2 } from '../Cards/SweetBonanzaCandylandCard'

interface Props {
    rows: SweetBonanzaSpin[]
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
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof SweetBonanzaSpin) => void
    order: Order
    orderBy: string
    rowCount: number
}

interface HeadCell {
    disablePadding: boolean
    id: keyof SweetBonanzaSpin
    label: string
    numeric: boolean
}

const headCells: HeadCell[] = [
    { id: 'timeMillis', numeric: true, disablePadding: true, label: 'Occurred At' },
    { id: 'result', numeric: false, disablePadding: false, label: 'Result' },
    { id: 'multiplier', numeric: true, disablePadding: false, label: 'Multipliersb' },
    { id: 'sugarbomb', numeric: false, disablePadding: true, label: 'Sugarbomb' },
    { id: 'sbmul', numeric: true, disablePadding: false, label: 'Bomb Multiplier' },
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
    const createSortHandler = (property: keyof SweetBonanzaSpin) => (event: React.MouseEvent<unknown>) => {
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
    rows: SweetBonanzaSpin[]
}

export const SweetBonanzaTable: FunctionComponent<EnhancedTableProps> = ({ rows }) => {
    const classes = useStyles()
    const [order, setOrder] = useState<Order>('desc')
    const [orderBy, setOrderBy] = useState<keyof SweetBonanzaSpin>('timeMillis')
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [dense, setDense] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof SweetBonanzaSpin) => {
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

    const CandyDrop: FunctionComponent<{ data: any; rowId: string; sbmul: number }> = ({ data, sbmul }) => {
        const indexToImage = (i: number) => {
            switch (i) {
                case 0:
                    return injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sw-drop-blue-min.png')

                case 1:
                    return injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sw-drop-red-min.png')

                case 2:
                    return injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sw-drop-yellow-min.png')

                default:
                    return injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/sw-drop-blue-min.png')
            }
        }

        return (
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-evenly' }}>
                {data.map((d, i) => (
                    <div style={{ display: 'flex' }}>
                        <div style={{ minWidth: '30px' }}>{`${(d as number) * sbmul}x `}</div>
                        <img width={25} height={25} src={indexToImage(i)} />
                    </div>
                ))}
            </div>
        )
    }

    const resultToWinMultiplier = (result: string, row: any) => {
        let sbMul = 1

        if (row.sbmul.length > 0) {
            if (row.sbmul.length == 1) sbMul = row.sbmul[0]
            if (row.sbmul.length == 2) sbMul = row.sbmul[0] * row.sbmul[1]
            if (row.sbmul.length == 3) sbMul = row.sbmul[0] * row.sbmul[1] * row.sbmul[2]
            if (row.sbmul.length == 4) sbMul = row.sbmul[0] * row.sbmul[1] * row.sbmul[2] * row.sbmul[3]
            if (row.sbmul.length == 5) sbMul = row.sbmul[0] * row.sbmul[1] * row.sbmul[2] * row.sbmul[3] * row.sbmul[4]
            if (row.sbmul.length == 6)
                sbMul = row.sbmul[0] * row.sbmul[1] * row.sbmul[2] * row.sbmul[3] * row.sbmul[4] * row.sbmul[5]
            if (row.sbmul.length == 7)
                sbMul =
                    row.sbmul[0] *
                    row.sbmul[1] *
                    row.sbmul[2] *
                    row.sbmul[3] *
                    row.sbmul[4] *
                    row.sbmul[5] *
                    row.sbmul[6]
            if (row.sbmul.length == 7)
                sbMul =
                    row.sbmul[0] *
                    row.sbmul[1] *
                    row.sbmul[2] *
                    row.sbmul[3] *
                    row.sbmul[4] *
                    row.sbmul[5] *
                    row.sbmul[6] *
                    row.sbmul[7]

            console.log('hello there', row.sbmul.length, sbMul, row)
        }

        switch (result) {
            case '1':
                return <div>{(row.payout[0] - 1) * sbMul}x</div>

            case '2':
                return <div>{(row.payout[0] - 1) * sbMul}x</div>

            case '5':
                return <div>{(row.payout[0] - 1) * sbMul}x</div>

            case 'Bubble Surprise':
                return `${row.payout[0] * sbMul}x`

            case 'Sweet Spins':
                return `${row.payout[0] * sbMul}x`

            case 'Candy Drop':
                return <CandyDrop data={row.payout} rowId={row._id as string} sbmul={sbMul} />

            default:
                return <div>{row.multiplier}</div>
        }
    }

    const isBubbleAndSweet = (payout: any) => {
        if (![1, 2, 5, 10, 25].includes(payout[0])) return true
        return false
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
                                                    <SpinResultSpan>
                                                        {row.result !== 'Bubble Surprise' ? (
                                                            symbolToStatImage2(row.result as string)
                                                        ) : (row.payout as any).length > 1 ? (
                                                            <div style={{ display: 'flex' }}>
                                                                {/* {symbolToStatImage2('Bubble Surprise')}
                                                                {symbolToStatImage2('Candy Drop')} */}
                                                                <img
                                                                    width={90}
                                                                    height={50}
                                                                    src={injectCDN(
                                                                        'https://spike-images.s3.eu-central-1.amazonaws.com/cucciolone.png'
                                                                    )}
                                                                />
                                                            </div>
                                                        ) : isBubbleAndSweet(row.payout) ? (
                                                            <img
                                                                width={90}
                                                                height={50}
                                                                src={injectCDN(
                                                                    'https://spike-images.s3.eu-central-1.amazonaws.com/bubblesweet.png'
                                                                )}
                                                            />
                                                        ) : (
                                                            symbolToStatImage2(row.result as string)
                                                        )}
                                                    </SpinResultSpan>
                                                </TableCell>

                                                <TableCell align='center'>
                                                    <SpinResultSpan>
                                                        {row.result !== 'Bubble Surprise' ? (
                                                            resultToWinMultiplier(row.result as string, row)
                                                        ) : (row.payout as any).length > 1 ? (
                                                            <CandyDrop
                                                                data={row.payout}
                                                                rowId={row._id as string}
                                                                sbmul={row.sugarbomb ? row.sbmul[0] : 1}
                                                            />
                                                        ) : (
                                                            resultToWinMultiplier(row.result as string, row)
                                                        )}
                                                    </SpinResultSpan>
                                                </TableCell>

                                                <TableCell align='left'>
                                                    <SlotResultSpan>
                                                        {(row as unknown as SweetBonanzaSpin).sugarbomb == true ? (
                                                            <div>
                                                                {(row.sbmul as any).map((pay, index) => (
                                                                    <img
                                                                        key={`${row._id}-bomb-${index}`}
                                                                        style={{
                                                                            width: '30px',
                                                                            height: '30px',
                                                                            margin: 'auto auto',
                                                                        }}
                                                                        src={injectCDN(
                                                                            'https://spike-images.s3.eu-central-1.amazonaws.com/sb-bomb.png'
                                                                        )}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <img
                                                                style={{
                                                                    width: '30px',
                                                                    height: '30px',
                                                                    margin: 'auto auto',
                                                                }}
                                                                src={injectCDN(
                                                                    'https://spike-images.s3.eu-central-1.amazonaws.com/sb-bomb-gs-2.png'
                                                                )}
                                                            />
                                                        )}
                                                    </SlotResultSpan>
                                                </TableCell>

                                                <TableCell style={{ fontFamily: 'Montserrat' }} align='center'>
                                                    {(row.sbmul as any).length == 0 ? (
                                                        <div></div>
                                                    ) : (
                                                        (row.sbmul as any).map((value, index) => (
                                                            <div key={`${row._id}-${index}`}>{value}</div>
                                                        ))
                                                    )}
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
