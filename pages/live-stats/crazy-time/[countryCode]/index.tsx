import React, { useContext, useState, useEffect } from 'react'
import { FunctionComponent, Fragment } from 'react';
import { LocaleContext } from './../../../../context/LocaleContext';
import FullPageLoader from '../../../../components/Layout/FullPageLoader'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn } from '../../../../components/Layout/Layout'
import io, { Socket } from 'socket.io-client'
import { Select, MenuItem, TableCell} from '@material-ui/core'
import { TimeFrame } from '../../../../data/models/TimeFrames'
import styled from 'styled-components'
import { Spin } from '../../../../data/models/Spin'
import axios from 'axios'
import { CrazyTimeSymbolStat } from '../../../../data/models/CrazyTimeSymbolStat'
import CrazyTimeStatCard from '../../../../components/Cards/CrazyTimeStatCard'
import CrazyTimeTable from '../../../../components/CrazyTimeLiveStats/CrazyTimeTable'

interface Props {
    _requestedCountryCode : string
    _stats : any
    _lastTenSpins : Spin[]
}

const SOCKET_ENDPOINT = 'https://crazytime.spike-realtime-api.eu'

const RESULTS_IN_TABLE = 15



const index : FunctionComponent<Props> = ({_requestedCountryCode, _stats, _lastTenSpins}) => {

    // keeps track of rows in the table
    const [rows, setRows] = useState<Spin[] | undefined>(_lastTenSpins)
    // keeps track of the stats
    const [stats, setStats] = useState<CrazyTimeSymbolStat[] | undefined>(_stats.stats)
    const [totalSpinsInTimeFrame, setTotalSpinsInTimeFrame] = useState(_stats.totalSpins)
    // the time frame currently selected
    const [timeFrame, setTimeFrame] = useState(TimeFrame.ONE_HOUR)
    useEffect(() => {
        // see [socket] hook before this
        if(socket){
            // whenever TimeFrame is changed we ask the socket server to join the new time frame updates (server takes care of leaving the previous TimeFrame updates)
            socket.emit(timeFrame)
            setTimeFrame(timeFrame)
            // we'll receive updates from the newly joined TimeFrame here
            socket.on(timeFrame, data => {
                console.log(data, timeFrame)
                // this is the update regarding the top cards with percentages
                const topUpdate = data.stats.stats
                // this is the update regarding the rows of the table
                const updatedRows = data.spins
                if(rows) setRows(mergeWithUpdate(rows, updatedRows))
                setStats(topUpdate)
            })
        }
    }, [timeFrame])

    // the socket instance to receive real time updates
    const [socket, setSocket] = useState<Socket | undefined>(undefined)
    useEffect(() => {
        // the socket instance should only really change when it is initialized
        if(socket) {
            // we send a message to the socket server asking to subscribe a given TimeFrame updates
            socket.emit(timeFrame)
            // whenever the server sends updates to a given TimeFrame subcribers we receive them here
            socket.on(timeFrame, (data) => {
                console.log(data, timeFrame)
                // this is the update regarding the top cards with percentages
                const topUpdate = data.stats.stats
                // this is the update regarding the rows of the table
                const updatedRows = data.spins
                // we merge the current rows and the updated rows updating the table afterward
                if(rows) setRows(mergeWithUpdate(rows, updatedRows))
                setStats(topUpdate)
            })
        }
    }, [socket])
  
    // table Ordering
    const [order, setOrder] = useState<'asc' | 'des'>('des')
    // stuff for multilanguage porpouses
    const {contextCountry} = useContext(LocaleContext)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // at first render we initialize socket connection
        const initializedSocket = io(SOCKET_ENDPOINT,  {
            secure:true,  
            rejectUnauthorized : false
        })
        // set the new socket instance triggering the respective hook
        setSocket(initializedSocket)

        return () => {
            // cleaning up socket connection if it exists
            socket && socket.disconnect()
        }
    }, [])

    // handlers
    const handleTimeFrameChange = async (e) => setTimeFrame(e.target.value)

    if(loading) return <FullPageLoader />
    return <Fragment>
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
                    {rows && <CrazyTimeTable rows={rows} />}
                </MainColumn>
            </BodyContainer>
        </NavbarProvider>
    </Fragment>
}

// helper function to merge exsisting rows with the update from the Socket
export const mergeWithUpdate = (current : Spin[], update : Spin[]) => {
    // the latest row in the table
    const lastFromCurrent = current[0]
    // slicing up the update array to the last known row based on the _id
    const slicedUpdate = update.slice(0, update.map(u => u._id).indexOf(lastFromCurrent._id))
    // spreading the result so that is automatically ordered by time as returned by the Socket
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



// styling stuff
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


const TimeFrameContainer = styled.div`
    display : flex;
    width : 100%;
    justify-content : flex-end;
    margin : 2rem 0rem;
`


export default index
