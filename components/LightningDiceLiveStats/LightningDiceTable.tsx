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
import { Spin } from '../../data/models/Spin'
import format from 'date-fns-tz/format'
import styled, { useTheme } from 'styled-components'
import { LocaleContext } from '../../context/LocaleContext'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import { DreamCatcherSpin } from '../../data/models/DreamCatcherSpin'
import { LightningDiceSpin } from '../../data/models/LightningDiceSpin'

interface Props {
    rows: LightningDiceSpin[]
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
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof LightningDiceSpin) => void
    order: Order
    orderBy: string
    rowCount: number
}

interface HeadCell {
    disablePadding: boolean
    id: keyof LightningDiceSpin
    label: string
    numeric: boolean
}

const headCells: HeadCell[] = [
    { id: 'date', numeric: true, disablePadding: true, label: 'Occurred At' },
    { id: 'multiplier', numeric: true, disablePadding: false, label: 'Multiplier' },
    { id: 'dices', numeric: false, disablePadding: true, label: 'Dice' },
    { id: 'total', numeric: true, disablePadding: true, label: 'Total' },
    { id: 'lightningNumbers', numeric: true, disablePadding: true, label: 'Lightning Numbers' },
    { id: 'totalWinners', numeric: true, disablePadding: false, label: 'Total Winners' },
    { id: 'totalPayout', numeric: true, disablePadding: false, label: 'Total Payout' },
]

export const EnhancedTableHead: FunctionComponent<TableHeadProps> = ({
    classes,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
}) => {
    const createSortHandler = (property: keyof LightningDiceSpin) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property)
    }

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    return (
        <TableHead style={{ background: '#db0d30' }}>
            <TableRow>
                {headCells.map((headCell, i) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={i == 0 ? 'center' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
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
    rows: LightningDiceSpin[]
}

export const LightningDiceTable: FunctionComponent<EnhancedTableProps> = ({ rows }) => {
    const classes = useStyles()
    const [order, setOrder] = useState<Order>('desc')
    const [orderBy, setOrderBy] = useState<keyof LightningDiceSpin>('date')
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [dense, setDense] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof LightningDiceSpin) => {
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

    const diceToImage = (dice: string) => {
        const ds = dice.split(',').map((s) => parseInt(s))

        const first = ds[0]
        const second = ds[1]
        const third = ds[2]

        console.log(first, second, third)

        const numberToImage = (n: number) => {
            switch (n) {
                case 1:
                    return '/icons/dice/dice_1.svg'
                case 2:
                    return '/icons/dice/dice_2.svg'
                case 3:
                    return '/icons/dice/dice_3.svg'
                case 4:
                    return '/icons/dice/dice_4.svg'
                case 5:
                    return '/icons/dice/dice_5.svg'
                case 6:
                    return '/icons/dice/dice_6.svg'
            }
        }

        return (
            <div>
                <img style={{ height: '42px', marginRight: '.2rem' }} src={numberToImage(first)} />
                <img style={{ height: '42px', marginRight: '.2rem' }} src={numberToImage(second)} />
                <img style={{ height: '42px' }} src={numberToImage(third)} />
            </div>
        )
    }

    const lightningNumbers = (arr: any) => {
        return <div style={{ fontSize: '.75rem' }}>{arr.map((e) => `${e.value}(${e.multiplier}X) `)}</div>
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
                                                    {format(row.timeOfSpin as number, 'dd/MM HH:mm')}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <SpinResultSpan>
                                                        {row.multiplier}
                                                        {row.isLightning && (
                                                            <span>
                                                                <svg viewBox='0 0 320 512' style={{ width: '.6rem' }}>
                                                                    <path
                                                                        fill='black'
                                                                        d='M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z'
                                                                    />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </SpinResultSpan>
                                                </TableCell>
                                                <TableCell align='left'>{diceToImage(row.dices.toString())}</TableCell>
                                                <TableCell align='center'>{row.total}</TableCell>
                                                <TableCell style={{ fontFamily: 'Montserrat' }} align='left'>
                                                    {lightningNumbers(row.lightningNumbers)}
                                                </TableCell>
                                                <TableCell style={{ fontFamily: 'Montserrat' }} align='center'>
                                                    {row.totalWinners}
                                                </TableCell>
                                                <TableCell style={{ fontFamily: 'Montserrat' }} align='center'>
                                                    {row.totalPayout}
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

    svg {
        margin-left: 0.3rem;
    }
`
