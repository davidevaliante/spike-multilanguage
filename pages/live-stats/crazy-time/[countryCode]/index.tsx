import React, { useContext, useState, useEffect } from 'react'
import { FunctionComponent } from 'react';
import { LocaleContext } from './../../../../context/LocaleContext';
import FullPageLoader from '../../../../components/Layout/FullPageLoader'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn } from '../../../../components/Layout/Layout'
import io, { Socket } from 'socket.io-client'
import { Select, MenuItem, InputLabel, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Divider, Card, CardContent, withStyles, Theme, createStyles } from '@material-ui/core'
import { TimeFrame } from '../../../../data/models/TimeFrames'
import styled from 'styled-components'
import { Spin, CrazyTimeSymbol } from '../../../../data/models/Spin'
import { buildRandomMockSpins } from './../../../../utils/Mocks';
import Image from 'next/image'
import format from 'date-fns-tz/format'
import axios from 'axios'
import itaLocale from 'date-fns/locale/it';
import { zonedTimeToUtc } from 'date-fns-tz'

interface Props {
    _requestedCountryCode : string
    _stats : any
    _lastTenSpins : Spin[]
}

const SOCKET_ENDPOINT = 'https://crazytime.spike-realtime-api.eu'

const RESULTS_IN_TABLE = 15


interface Stat {
    symbol : string,
    lands : number,
    percentage : number,
    spinSince : number
}

interface CardProps {
    stat : Stat,
    totalSpinsConsidered : number
}

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);


const CrazyTimeStatCard : FunctionComponent<CardProps> = ({stat, totalSpinsConsidered}) => {

    const expectation = (s : string) => {
        if(s === 'one') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>21 / 54</p>
                    <p>(38.89%) Expected</p>
                </span>
            </div>
        )
        if(s === 'two') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>13 / 54</p>
                    <p>(24.07%) Expected</p>
                </span>
            </div>
        )
        if(s === 'five') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>7 / 54</p>
                    <p>(12.96%) Expected</p>
                </span>
            </div>
        )
        if(s === 'ten') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>4 / 54</p>
                    <p>(7.41%) Expected</p>
                </span>
            </div>
        )
        if(s === 'cashhunt') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>2 / 54</p>
                    <p>(3.70%) Expected</p>
                </span>
            </div>
        )
        if(s === 'coinflip') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>4 / 54</p>
                    <p>(7.41%) Expected</p>
                </span>
            </div>
        )
        if(s === 'pachinko') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>2 / 54</p>
                    <p>(3.70%) Expected</p>
                </span>
            </div>
        )
        if(s === 'crazytime') return(
            <div style={{marginTop : '1rem'}}>
                <span style = {{fontSize : '.8rem', display : 'flex'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.5rem'}}>1 / 54</p>
                    <p>(1.85%) Expected</p>
                </span>
            </div>
        )
    }

    return(
        <Card style={{width : '250px', display : 'flex', flexDirection : 'column', justifyContent : 'center', alignItems : 'center', marginBottom : '2rem'}}>
            <CardContent style={{display : 'flex', flexDirection : 'column', justifyContent : 'center', alignItems : 'center',}}>
                {symbolToStatImage(stat.symbol)}
                <p style={{fontWeight : 'bold', fontSize : '2rem', textAlign : 'center', marginTop : '1rem'}}>{Math.round(stat.percentage * 100) / 100} %</p>
                <span style={{display : 'flex', alignItems : 'center', justifyContent : 'center', marginTop : '1rem'}}>
                    <p style={{fontWeight : 'bold', marginRight : '.4rem'}}>{stat.spinSince != totalSpinsConsidered ? stat.spinSince  : `> ${totalSpinsConsidered}`}</p>
                    <p>Spins Since</p>
                </span>
                <p style={{ fontSize : '1rem', textAlign : 'center', marginTop : '1rem'}}>{stat.lands} Lands</p>
                {expectation(stat.symbol)}
            </CardContent>
        </Card>
    )
}

const index : FunctionComponent<Props> = ({_requestedCountryCode, _stats, _lastTenSpins}) => {

    console.log(_stats, _lastTenSpins)

    const [socket, setSocket] = useState<Socket | undefined>(undefined)
    const [timeFrame, setTimeFrame] = useState(TimeFrame.ONE_HOUR)
    const {contextCountry} = useContext(LocaleContext)
    const [loading, setLoading] = useState(false)

    const [rows, setRows] = useState<Spin[] | undefined>(_lastTenSpins)
    const [stats, setStats] = useState<Stat[] | undefined>(_stats.stats)
    const [totalSpinsInTimeFrame, setTotalSpinsInTimeFrame] = useState(_stats.totalSpins)

    // table Ordering
    const [order, setOrder] = useState<'asc' | 'des'>('des')

    useEffect(() => {
        console.log(rows, 'rows changed')
    }, [rows])


    useEffect(() => {
        console.log('socket changed')
        if(socket) {
            socket.emit('1h')
            socket.on(timeFrame, (data) => {
                console.log(data, 'update')
                if(rows) setRows(mergeWithUpdate(rows, data.spins))
                setStats(data.stats.stats)
            })
        }
    }, [socket])

    useEffect(() => {
        if(socket){
            console.log(`changing to ${timeFrame}`)

            console.log(timeFrame)
            socket.off(timeFrame)
            socket.emit(timeFrame)
            setTimeFrame(timeFrame)
            socket.on(timeFrame, data => {
                if(rows) setRows(mergeWithUpdate(rows, data.spins))
                setStats(data.stats.stats)
            })
        }
    }, [timeFrame])

    useEffect(() => {
        // setRows(buildRandomMockSpins(25))
        setUpSocketConnection()
        return () => {
            socket && socket.disconnect()
        }
    }, [])

    const setUpSocketConnection = async () => {
        const s = io(SOCKET_ENDPOINT,  {

            secure:true,
    
   
            rejectUnauthorized : false
    
        })
        setSocket(s)
    }

    const handleTimeFrameChange = async (e) => {
        setTimeFrame(e.target.value)
    }

    const openVideo = (url : string) => {
        window.open(`https://crazy-time-scalper.vercel.app/video/${url.split('/').pop()}`)
    }

    const renderMultiplierCell = (spin : Spin) => {
        if(spin.multiplierInfo === 'none') return <TableCell align="left">{spin.multiplier}</TableCell>
        if(spin.multiplierInfo === 'heads') return <TableCell align="left">
            <span style={{display : 'flex', alignItems : 'center', justifyContent : 'flex-start'}}>
                <p style={{marginRight : '1rem'}}>{spin.multiplier}</p>
                <Image width='36px' height='36px' src='/icons/crazy-time/heads.svg'/> 
            </span>
        </TableCell>
        if(spin.multiplierInfo === 'tails') return <TableCell align="left">
            <span style={{display : 'flex', alignItems : 'center', justifyContent : 'flex-start'}}>
                <p style={{marginRight : '1rem'}}>{spin.multiplier}</p>
                <Image width='36px' height='36px' src='/icons/crazy-time/tails.svg'/> 
            </span>
        </TableCell>
        if(spin.multiplierInfo === 'ct') return <TableCell align="left">
        <span>
            {spin.multiplier}
        </span>
    </TableCell>
    }

    if(loading) return <FullPageLoader />
    return <div>
        <NavbarProvider currentPage='Home' countryCode={contextCountry}>
            <BodyContainer>
                <MainColumn style={{width : '100%', maxWidth : '90%', paddingBottom : '4rem'}}>
                    <TimeFrameContainer>
                        <Select
                            labelId="demo-simple-select-label"
                            value={timeFrame}
                            onChange={(e) => handleTimeFrameChange(e)}
                            >
                            {Object.values(TimeFrame).map((k, i) => <MenuItem key={k} value={k}>{Object.values(TimeFrame)[i]}</MenuItem>)}
                        </Select>    
                    </TimeFrameContainer>    

                    {stats && <StatsContainer>
                        {stats.map(s => <CrazyTimeStatCard key={`stats_${s.symbol}`} stat={s} totalSpinsConsidered={totalSpinsInTimeFrame}/>)}    
                    </StatsContainer>}
                    

                    {rows && <TableWrapper>
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
                                        {renderMultiplierCell(row)}
                                        <TableCell align="left">{row.totalWinners}</TableCell>
                                        <TableCell align="left">{row.totalPayout}€</TableCell>
                                        <TableCell align="right">{row.watchVideo !== 'no_video' ? <Button onClick={() => openVideo(row.watchVideo)} color='primary' variant='contained'>Watch</Button> : ''}</TableCell>
                                    </StyledTableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TableWrapper>}
                </MainColumn>
            </BodyContainer>
        </NavbarProvider>
    </div>
}

export const StatsContainer = styled.div`
    display : flex;
    flex-wrap : wrap;
    justify-content : space-around;
`

export const VerticalDivider = styled.div`
    width : 1px;
    height : 100%;
`

export const StyledTableCell = styled(TableCell)`
    font-weight : bold !important;
    color : white !important;
`

export const mergeWithUpdate = (current : Spin[], update : Spin[]) => {
    const lastFromCurrent = current[0]
    const slicedUpdate = update.slice(0, update.map(u => u._id).indexOf(lastFromCurrent._id))
    return [...slicedUpdate, ...current]
} 

export const getServerSideProps = async ({query, req, res}) => {

    const _requestedCountryCode = query.countryCode
    const _stats = await axios.get('https://crazytime.spike-realtime-api.eu/api/stats-in-the-last-hours/1')
    const _lastTenSpins = await axios.get(`https://crazytime.spike-realtime-api.eu/api/get-latest/${RESULTS_IN_TABLE}`)

    return {
        props : {
            _requestedCountryCode,
            _stats : _stats.data.stats,
            _lastTenSpins : _lastTenSpins.data.latestSpins
        }
    }
}

const root = '/icons/crazy-time/'

const squareLength = '50px'

const rectWidht = '89px'

const rectHeight = '49px'

const symbolToSlotResultImage = (symbolString : string) => {
    switch(symbolString){
        case 'one':
            const oneS = root + 'ico-crazytime-slot-1.png'
            return <Image width={squareLength} height={squareLength} src={oneS}/>
        case 'two':
            const twoS = root + 'ico-crazytime-slot-2.png'
            return <Image width={squareLength} height={squareLength} src={twoS}/>
        case 'five':
            const fiveS = root + 'ico-crazytime-slot-5.png'
            return <Image width={squareLength} height={squareLength} src={fiveS}/>
        case 'ten':
            const tenS = root + 'ico-crazytime-slot-10.png'
            return <Image width={squareLength} height={squareLength} src={tenS}/>
        case 'coinflip':
            const coinFlipS = root + 'ico-crazytime-slot-cf.png'
            return <Image width={rectWidht} height={rectHeight} src={coinFlipS}/>
        case 'cashhunt':
            const cashHuntS = root + 'ico-crazytime-slot-ch.png'
            return <Image width={rectWidht} height={rectHeight} src={cashHuntS}/>
        case 'crazytime':
            const crazyTimeS = root + 'ico-crazytime-slot-ct.png'
            return <Image width={rectWidht} height={rectHeight} src={crazyTimeS}/>
        case 'pachinko':
            const pachinkoS = root + 'ico-crazytime-slot-pa.png'
            return <Image width={rectWidht} height={rectHeight} src={pachinkoS}/>
    }
}


const _squareLength = '100px'

const _rectWidht = '150px'

const _rectHeight = '80px'

const symbolToStatImage = (symbolString : string) => {
    switch(symbolString){
        case 'one':
            const oneS = root + 'ico-crazytime-slot-1.png'
            return <Image width={_squareLength} height={_squareLength} src={oneS}/>
        case 'two':
            const twoS = root + 'ico-crazytime-slot-2.png'
            return <Image width={_squareLength} height={_squareLength} src={twoS}/>
        case 'five':
            const fiveS = root + 'ico-crazytime-slot-5.png'
            return <Image width={_squareLength} height={_squareLength} src={fiveS}/>
        case 'ten':
            const tenS = root + 'ico-crazytime-slot-10.png'
            return <Image width={_squareLength} height={_squareLength} src={tenS}/>
        case 'coinflip':
            const coinFlipS = root + 'ico-crazytime-slot-cf.png'
            return <Image width={_rectWidht} height={_rectHeight} src={coinFlipS}/>
        case 'cashhunt':
            const cashHuntS = root + 'ico-crazytime-slot-ch.png'
            return <Image width={_rectWidht} height={_rectHeight} src={cashHuntS}/>
        case 'crazytime':
            const crazyTimeS = root + 'ico-crazytime-slot-ct.png'
            return <Image width={_rectWidht} height={_rectHeight} src={crazyTimeS}/>
        case 'pachinko':
            const pachinkoS = root + 'ico-crazytime-slot-pa.png'
            return <Image width={_rectWidht} height={_rectHeight} src={pachinkoS}/>
    }
}

const symbolToSpinResultImage = (symbolString : string) => {
    switch(symbolString){
        case 'one':
            const oneS = root + 'ico-crazytime-1.png'
            return <Image width={rectWidht} height={rectHeight} src={oneS}/>
        case 'two':
            const twoS = root + 'ico-crazytime-2.png'
            return <Image width={rectWidht} height={rectHeight} src={twoS}/>
        case 'five':
            const fiveS = root + 'ico-crazytime-5.png'
            return <Image width={rectWidht} height={rectHeight} src={fiveS}/>
        case 'ten':
            const tenS = root + 'ico-crazytime-10.png'
            return <Image width={rectWidht} height={rectHeight} src={tenS}/>
        case 'coinflip':
            const coinFlipS = root + 'ico-crazytime-cf.png'
            return <Image width={rectWidht} height={rectHeight} src={coinFlipS}/>
        case 'cashhunt':
            const cashHuntS = root + 'ico-crazytime-ch.png'
            return <Image width={rectWidht} height={rectHeight} src={cashHuntS}/>
        case 'crazytime':
            const crazyTimeS = root + 'ico-crazytime-ct.png'
            return <Image width={rectWidht} height={rectHeight} src={crazyTimeS}/>
        case 'pachinko':
            const pachinkoS = root + 'ico-crazytime-pa.png'
            return <Image width={rectWidht} height={rectHeight} src={pachinkoS}/>
    }
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


const TimeFrameContainer = styled.div`
    display : flex;
    width : 100%;
    justify-content : flex-end;

    margin : 2rem 0rem;
`


export default index
