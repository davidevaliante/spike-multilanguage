import React, { useContext, useState, useEffect } from 'react'
import { FunctionComponent, Fragment } from 'react';
import { LocaleContext } from './../../../../context/LocaleContext';
import FullPageLoader from '../../../../components/Layout/FullPageLoader'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn } from '../../../../components/Layout/Layout'
import io, { Socket } from 'socket.io-client'
import { Select, MenuItem, TableCell, Paper, Divider, Backdrop} from '@material-ui/core'
import { TimeFrame } from '../../../../data/models/TimeFrames'
import styled from 'styled-components'
import { Spin } from '../../../../data/models/Spin'
import axios from 'axios'
import { CrazyTimeSymbolStat } from '../../../../data/models/CrazyTimeSymbolStat'
import CrazyTimeStatCard from '../../../../components/Cards/CrazyTimeStatCard'
import  { EnhancedTable } from '../../../../components/CrazyTimeLiveStats/CrazyTimeTable'
import AquaClient from './../../../../graphql/aquaClient';
import { BONUSES_BY_NAME } from '../../../../graphql/queries/bonus'
import BonusStripe from '../../../../components/Cards/BonusStripe'
import { Bonus } from '../../../../graphql/schema'
import BonusPlayCard from '../../../../components/Cards/BonusPlayCard'
import PrimaryBonusCard from './../../../../components/Cards/PrimaryBonusCard';
import { useRef } from 'react';
import useOnClickOutside from '../../../../hooks/useOnClickOutside'

import {
    isMobile,
    isDesktop,
    isTablet
  } from "react-device-detect";
import StickyBonus from '../../../../components/Singles/StickyBonus'

interface Props {
    _requestedCountryCode : string
    _stats : any
    _lastTenSpins : Spin[]
    _bonuses : Bonus[]
}

const SOCKET_ENDPOINT = 'https://crazytime.spike-realtime-api.eu'

const PAGE_BONUSES = ["BetFlag", "LeoVegas", "888 Casino", "StarCasinò", "Unibet", "PokerStars Casino"]

const SPAM_BONUSES = true

const SPAM_INTERVAL = 20000

const index : FunctionComponent<Props> = ({_requestedCountryCode, _stats, _lastTenSpins, _bonuses}) => {

    // keeps track of rows in the table
    const [rows, setRows] = useState<Spin[] | undefined>(_lastTenSpins)

    const [showSpamBonuses, setShowSpamBonuses] = useState(false)

    // keeps track of the stats
    const [stats, setStats] = useState<CrazyTimeSymbolStat[] | undefined>(_stats.stats)
    const [totalSpinsInTimeFrame, setTotalSpinsInTimeFrame] = useState(_stats.totalSpins)
    // the time frame currently selected
    const [timeFrame, setTimeFrame] = useState(TimeFrame.TWENTY_FOUR_HOURS)
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

    const [timeout, setTimeout] = useState<NodeJS.Timeout | undefined>(undefined)

    useEffect(() => {
        // at first render we initialize socket connection
        const initializedSocket = io(SOCKET_ENDPOINT,  {
            secure:true,  
            rejectUnauthorized : false
        })
        // set the new socket instance triggering the respective hook
        setSocket(initializedSocket)

        const spamBonusInterval = setInterval(() => setShowSpamBonuses(true), SPAM_INTERVAL)
        setTimeout(spamBonusInterval)


        return () => {
            // cleaning up socket connection if it exists
            socket && socket.disconnect()
            timeout && clearInterval(timeout)
        }
    }, [])

    const bonusRef = useRef()

    useOnClickOutside(bonusRef, () => handleCloseSpamBonuses())

    // handlers
    const handleTimeFrameChange = async (e) => setTimeFrame(e.target.value)

    const handleCloseSpamBonuses = () => {
        timeout && clearInterval(timeout)
        setShowSpamBonuses(false)
        const spamBonusInterval = setInterval(() => setShowSpamBonuses(true), SPAM_INTERVAL)
        setTimeout(spamBonusInterval)
    }

    // utils
    const getSliceSize = () => {
        if(isMobile) return 1
        if(isDesktop) return 3
        if(isTablet) return 2
    }

    if(loading) return <FullPageLoader />
    return <Fragment>
        <NavbarProvider  currentPage='Home' countryCode={contextCountry}>

            <BodyContainer>
                <MainColumn style={{width : '100%', maxWidth : '90%', paddingBottom : '4rem'}}>

                {SPAM_BONUSES && <Backdrop style={{zIndex : 10}} open={showSpamBonuses}>
                    <Paper ref={bonusRef} elevation={3} style={{padding : '2rem'}}>
                        <div style={{display : 'flex', justifyContent : 'space-between', alignItems : 'space-around'}}>
                            <h1 style={{marginLeft : '1rem', fontWeight : 'bold', fontSize : '1.5rem', color : 'crimson', }}>Exclusive Bonuses</h1>
                            <img onClick={() => handleCloseSpamBonuses()} style={{width : '36px', height : '36px', cursor : 'pointer'}} src='/icons/close_red.svg'/>
                        </div>
                        <div style={{display : 'flex', justifyContent : 'space-between'}}>
                            {[..._bonuses.slice(0,getSliceSize())].map(b => <PrimaryBonusCard key={b.name} style={{margin : '1rem'}} bonus={b}/>)}
                        </div>
                    </Paper>
                </Backdrop>}

                    <div style={{display : 'flex', justifyContent : 'space-between', alignItems : 'center', marginTop: '2rem'}}>
                        <div>
                            <h1 style={{ fontWeight : 'bold', fontSize : '2rem'}}>Crazy Time Statistics</h1>
                            <h1 style={{marginTop : '.5rem'}}>{`for the past ${timeFrame}`}<span style={{marginLeft : '1rem', fontWeight : 'bold', color : 'crimson'}}>In REAL TIME</span></h1>
                        </div>

                        <div>
                            <Select
                                labelId="demo-simple-select-label"
                                value={timeFrame}
                                onChange={(e) => handleTimeFrameChange(e)}>
                                {Object.values(TimeFrame).map((k, i) => <MenuItem key={k} value={k}>{Object.values(TimeFrame)[i]}</MenuItem>)}
                            </Select> 
                        </div>   
                    </div>
                    

                    <Divider style={{marginTop : '2rem'}}/>
                    <TimeFrameContainer>
                        
                    </TimeFrameContainer>    

                    {stats && <StatsContainer>
                        {stats.map(s => <CrazyTimeStatCard key={`stats_${s.symbol}`} stat={s} totalSpinsConsidered={totalSpinsInTimeFrame}/>)}    
                    </StatsContainer>}
                    
                    <h1 style={{ marginTop : '2rem', color : 'crimson', fontWeight : 'bold', fontSize : '1.4rem', textAlign : 'center'}}>You can play at CRAZY TIME here</h1>
                    <Paper elevation={6} style={{marginTop : '1rem', marginBottom : '4rem'}}> 
                        {_bonuses && _bonuses.map(b => <BonusStripe key={b.name} bonus={b} />)}
                    </Paper>

                    <h1 style={{ marginTop : '2rem', color : 'crimson', fontWeight : 'bold', fontSize : '1.4rem', marginBottom : '1rem'}}>Spin History</h1>
                    {rows && <EnhancedTable rows={rows} />}
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

    const aquaClient = new AquaClient()

    const _requestedCountryCode = query.countryCode
    const pageData  = await axios.get('https://crazytime.spike-realtime-api.eu/api/data-for-the-last-hours/24')
   
    const BONUS_QUERY = `
        query CRAZY_TIME_BONUSES($countryCode:String, $names:[String]){
            bonuses(
            where: 
                {
                country: {code:$countryCode}
                name_in:$names
                }
            ){
                name
                description
                withDeposit
                noDeposit
                backgroundColor
                borderColor
                rating
                link
                tips
                bonus_guide{
                    slug
                }
                circular_image{
                    url
                }
                country{
                    code
                }
            }
        }
    `


    const bonuses = await aquaClient.query({
        query : BONUS_QUERY,
        variables : {
            countryCode : 'it',
            names : PAGE_BONUSES
        }
    })

    const orderedBonusList : Bonus[] = []

    PAGE_BONUSES.forEach(name => orderedBonusList.push(bonuses.data.data.bonuses.find(it => it.name === name)))

    return {
        props : {
            _requestedCountryCode,
            _stats : pageData.data.stats,
            _lastTenSpins : pageData.data.spinsInTimeFrame,
            _bonuses : orderedBonusList
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


const TimeFrameContainer = styled.div`
    display : flex;
    width : 100%;
    justify-content : flex-end;
    margin : 2rem 0rem;
`


export default index
