import React, { useContext, useState, useEffect } from 'react'
import { FunctionComponent } from 'react';
import { LocaleContext } from './../../../../context/LocaleContext';
import FullPageLoader from '../../../../components/Layout/FullPageLoader'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn } from '../../../../components/Layout/Layout'
import io, { Socket } from 'socket.io-client'
import { Select, MenuItem, InputLabel, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core'
import { TimeFrame } from '../../../../data/models/TimeFrames'
import styled from 'styled-components'
import { Spin } from '../../../../data/models/Spin'
import { buildRandomMockSpins } from './../../../../utils/Mocks';
import Image from 'next/image'
import format from 'date-fns/format'

interface Props {
    
}

// New
// https://demogamesfree.pragmaticplay.net/gs2c/html5Game.do?extGame=1&symbol=vs40madwheel&gname=The%20Wild%20Machine&jurisdictionID=UK&lobbyUrl=https%3A%2F%2Fwww.pragmaticplay.com&mgckey=stylename@generic~SESSION@baa58bc3-06ea-4792-9918-c3e5d9f61fb6

// Old
// https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=it&cur=EUR&gameSymbol=vswaysrhino&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net

const SOCKET_ENDPOINT = 'http://crazytime.spike-realtime-api.eu:5001'

const index : FunctionComponent<Props> = ({}) => {

    const [socket, setSocket] = useState<Socket | undefined>(undefined)
    const [timeFrame, setTimeFrame] = useState(TimeFrame.ONE_HOUR)
    const {contextCountry} = useContext(LocaleContext)
    const [loading, setLoading] = useState(false)

    const [rows, setRows] = useState<Spin[] | undefined>(undefined)

    // table Ordering
    const [order, setOrder] = useState<'asc' | 'des'>('des')

    useEffect(() => {
        console.log(rows)
    }, [rows])


    useEffect(() => {
        console.log('socket changed')
        if(socket) {
            socket.emit('1h')
            socket.emit('message', 'hey there')
            socket.on(timeFrame, (data) => {
                setRows(data.spins)
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
                setRows(data.spins)
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
        const s = io(SOCKET_ENDPOINT)
        setSocket(s)
    }

    const handleTimeFrameChange = async (e) => {
        setTimeFrame(e.target.value)
    }

    if(loading) return <FullPageLoader />
    return <div>
        <NavbarProvider currentPage='Home' countryCode={contextCountry}>
            <BodyContainer>
                <MainColumn style={{width : '100%', maxWidth : '90%'}}>
                    <TimeFrameContainer>
                        <Select
                            labelId="demo-simple-select-label"
                            value={timeFrame}
                            onChange={(e) => handleTimeFrameChange(e)}
                            >
                            {Object.values(TimeFrame).map((k, i) => <MenuItem value={k}>{Object.values(TimeFrame)[i]}</MenuItem>)}
                        </Select>    
                    </TimeFrameContainer>    

                    {rows && <TableWrapper>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Occured at</TableCell>
                                    <TableCell align="center">Slot Result</TableCell>
                                    <TableCell align="center">Spin Result</TableCell>
                                    <TableCell align="center">Multiplier</TableCell>
                                    <TableCell align="center">Total Winner</TableCell>
                                    <TableCell align="center">Total Payout</TableCell>
                                    <TableCell align="right">Watch Video</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row._id}>
                                        <TableCell component="th" scope="row">
                                            {format(row.timeOfSpin, 'dd/MM hh:mm')}
                                        </TableCell>
                                        <TableCell align="center">
                                            <SlotResultSpan>
                                                {symbolToSlotResultImage(row.slotResultSymbol)}
                                                <p>{row.slotResult}</p>
                                            </SlotResultSpan>
                                        </TableCell>
                                        <TableCell align="right">
                                            <SpinResultSpan>
                                                {symbolToSpinResultImage(row.spinResultSymbol)}
                                                <p>{row.slotResult}</p>
                                            </SpinResultSpan>
                                        </TableCell>
                                        <TableCell align="right">{row.multiplier}</TableCell>
                                        <TableCell align="right">{row.totalWinners}</TableCell>
                                        <TableCell align="right">{row.totalPayout}</TableCell>
                                        <TableCell align="right">{row.watchVideo !== 'no_video' ? <Button variant='contained'>Watch</Button> : ''}</TableCell>
                                    </TableRow>
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
