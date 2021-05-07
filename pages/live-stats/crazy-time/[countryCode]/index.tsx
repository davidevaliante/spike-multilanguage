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
import { Bonus, CrazyTimeArticle } from '../../../../graphql/schema'
import BonusPlayCard from '../../../../components/Cards/BonusPlayCard'
import PrimaryBonusCard from './../../../../components/Cards/PrimaryBonusCard';
import { useRef } from 'react';
import useOnClickOutside from '../../../../hooks/useOnClickOutside'
import { isMobile, isDesktop, isTablet } from "react-device-detect";
import StickyBonus from '../../../../components/Singles/StickyBonus'
import DynamicContent from '../../../../components/DynamicContent/DynamicContent'
import Head from 'next/head'

interface Props {
    _requestedCountryCode : string
    _stats : any
    _lastTenSpins : Spin[]
    _bonuses : Bonus[]
    _pageContent : CrazyTimeArticle
}
/* 
 TODO per oggi  :

  - Aggiungere articolo Top e Bottom
  
  - Aggiungere Seo component

  - Rimappare link bonus con quelli nuovi

  - Mettere CTA in Home e in navbar per andare alla pagina

  - NON ESCE DA X TIRI
    8:05
    mettiamo quello grande e sotto mettiamo la percentuale che è uscito ma in modo che si capisca cos'è
    8:05
    tipo "X% nell'arco temporale"

  - Traduzioni almeno in ita

  - Fare pagina per LIVE senza bonus spam

  - Aggiungere simbolo Euro al Total Payout

  - Aggiungere icona doppia freccia al cash hunt
 
 */


const SOCKET_ENDPOINT = 'https://crazytime.spike-realtime-api.eu'

const PAGE_BONUSES = ["BetFlag", "LeoVegas", "888 Casino", "StarCasinò", "Unibet", "PokerStars Casino"]

const SPAM_BONUSES = false

const SPAM_INTERVAL = 20000

const index : FunctionComponent<Props> = ({_requestedCountryCode, _stats, _lastTenSpins, _bonuses, _pageContent}) => {

    const aquaClient = new AquaClient()

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    // keeps track of rows in the table
    const [rows, setRows] = useState<Spin[] | undefined>(_lastTenSpins)

    const [showSpamBonuses, setShowSpamBonuses] = useState(false)
    const bonusRef = useRef()
    useOnClickOutside(bonusRef, () => handleCloseSpamBonuses())

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
        <NavbarProvider  currentPage='Crazy Time Stats' countryCode={contextCountry}>
            <Head>
                <title>{_pageContent.seo?.seoTitle}</title>
                <link rel="canonical" href="https://spikeslot.com" />
                <meta
                    name="description"
                    content={_pageContent.seo.seoDescription}>
                </meta>
                <meta httpEquiv="content-language" content="it-IT"></meta>
                <meta property="og:image" content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property="og:locale" content={'it'} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content={_pageContent.seo?.seoDescription} />
                <meta property="og:site_name" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
            </Head>

            <BodyContainer>
                <MainColumn style={{width : '100%', maxWidth : '90%', paddingBottom : '4rem', paddingTop : '2rem'}}>

                    <DynamicContent content={_pageContent.topContent}/>

                    <Divider style={{marginTop : '2rem'}} />

                    <div style={{display : 'flex', justifyContent : 'space-between', alignItems : 'center', marginTop: '2rem'}}>
                        <div>
                            <h1 style={{ fontWeight : 'bold', fontSize : '2rem'}}>{t('Crazy Time Statistics')}</h1>
                            <h1 style={{marginTop : '.5rem'}}>{`${t('for the past')} ${timeFrame}`}<span style={{marginLeft : '1rem', fontWeight : 'bold', color : 'crimson'}}>In REAL TIME</span></h1>
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
                    

                    <Divider style={{marginTop : '2rem', marginBottom : '2rem'}}/>

                    {stats && <StatsContainer>
                        {stats.map(s => <CrazyTimeStatCard key={`stats_${s.symbol}`} stat={s} totalSpinsConsidered={totalSpinsInTimeFrame} timeFrame={timeFrame}/>)}    
                    </StatsContainer>}
                    
                    <h1 style={{ marginTop : '2rem', color : 'crimson', fontWeight : 'bold', fontSize : '1.4rem', textAlign : 'center'}}>{`${t('You can play at CRAZY TIME here')}`}</h1>
                    <Paper elevation={6} style={{marginTop : '1rem', marginBottom : '4rem'}}> 
                        {_bonuses && _bonuses.map(b => <BonusStripe key={b.name} bonus={b} />)}
                    </Paper>

                    <h1 style={{ marginTop : '2rem', color : 'crimson', fontWeight : 'bold', fontSize : '1.4rem', marginBottom : '1rem'}}>
                      {`${t('Spin History')}`}
                    </h1>
                    {rows && <EnhancedTable rows={rows} />}
                    <DynamicContent content={_pageContent.bottomContent}/>

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
   
    
    const pageContent = await aquaClient.query({
        query : PAGE_ARTICLE_QUERY,
        variables : {
            countryCode : 'it'
        }
    })

    const bonuses = await aquaClient.query({
        query : BONUS_QUERY,
        variables : {
            countryCode : 'it',
            names : PAGE_BONUSES
        }
    })

    const orderedBonusList : Bonus[] = []

    PAGE_BONUSES.forEach(name => orderedBonusList.push(bonuses.data.data.bonuses.find(it => it.name === name)))

    const bonusRemapping = {
        'BetFlag' : 'https://adv.betflag.com/redirect.aspx?pid=5262&bid=2690',
        'LeoVegas' : 'https://ads.leovegas.com/redirect.aspx?pid=3704489&bid=14965',
        '888 Casino' : 'https://ic.aff-handler.com/c/43431?sr=1868828',
        'StarCasinò' : 'https://record.starcasino.it/_SEA3QA6bJTNXl890vMAfUGNd7ZgqdRLk/131/',
        'Unibet' : 'https://b1.trickyrock.com/redirect.aspx?pid=70955130&bid=21251',
        'PokerStars Casino' : 'https://secure.starsaffiliateclub.com/C.ashx?btag=a_182773b_4095c_&affid=100976968&siteid=182773&adid=4095&c='
    }

    return {
        props : {
            _requestedCountryCode,
            _stats : pageData.data.stats,
            _lastTenSpins : pageData.data.spinsInTimeFrame,
            _bonuses : orderedBonusList.map(b => {
                b.link = bonusRemapping[b.name]
                return b
            }),
            _pageContent : pageContent.data.data.crazyTimeArticles[0]
        }
    }
}

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

const PAGE_ARTICLE_QUERY = `
query CRAZY_TIME_PAGE($countryCode:String="it"){
    crazyTimeArticles(
      where:{
        country:{code: $countryCode}
      }
    ){
      country{
        code
      }
      seo{
        seoTitle
        seoDescription
      }
      topContent{
                ...on ComponentArticleArticle{
              type
              article
            }
  
            ...on ComponentBonusListBonusList{
              type
              direction
              bonus{
                bonus{
                  name
                  bonus_guide{
                    slug
                  }
                  withDeposit
                  noDeposit
                  link
                  borderColor
                  backgroundColor
                  tips
                  circular_image{
                    url
                  }
                }
              }
            }
  
            ...on ComponentSlotListSlotList{
              type
              slot{
                slot{
                  name
                  rating
                  slug
                  image{
                    url
                  }
                }
              }
            }
  
           ...on ComponentVideoComponentVideoComponent{
              type
              videoUrl
              thumbnailUrl
          }
      }
      bottomContent{
                ...on ComponentArticleArticle{
              type
              article
            }
  
            ...on ComponentBonusListBonusList{
              type
              direction
              bonus{
                bonus{
                  name
                  bonus_guide{
                    slug
                  }
                  withDeposit
                  noDeposit
                  link
                  borderColor
                  backgroundColor
                  tips
                  circular_image{
                    url
                  }
                }
              }
            }
  
            ...on ComponentSlotListSlotList{
              type
              slot{
                slot{
                  name
                  rating
                  slug
                  image{
                    url
                  }
                }
              }
            }
  
           ...on ComponentVideoComponentVideoComponent{
              type
              videoUrl
              thumbnailUrl
          }
      }
    }
  }
`



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
