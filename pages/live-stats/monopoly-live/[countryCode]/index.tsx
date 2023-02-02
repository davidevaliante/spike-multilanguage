import React, { useContext, useState, useEffect } from 'react'
import { FunctionComponent, Fragment } from 'react'
import { LocaleContext } from './../../../../context/LocaleContext'
import FullPageLoader from '../../../../components/Layout/FullPageLoader'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn, MainColumnScroll } from '../../../../components/Layout/Layout'
import io, { Socket } from 'socket.io-client'
import { Select, MenuItem, Paper, Divider, Backdrop, Input, Checkbox, ListItemText } from '@material-ui/core'
import { TimeFrame } from '../../../../data/models/TimeFrames'
import styled from 'styled-components'
import { Spin, crazyTimeSymbolToFilterOption } from '../../../../data/models/Spin'
import axios from 'axios'
import { CrazyTimeSymbolStat, MonopolySymbolStat } from '../../../../data/models/CrazyTimeSymbolStat'
import CrazyTimeStatCard from '../../../../components/Cards/CrazyTimeStatCard'
import { CrazyTimeTable } from '../../../../components/CrazyTimeLiveStats/CrazyTimeTable'
import AquaClient from './../../../../graphql/aquaClient'
import BonusStripe from '../../../../components/Cards/BonusStripe'
import { Bonus, CrazyTimeArticle, MonopolyArticle } from '../../../../graphql/schema'
import DynamicContent from '../../../../components/DynamicContent/DynamicContent'
import Head from 'next/head'
import { format } from 'date-fns'
import now from 'lodash/now'
import BonusesBackdrop from '../../../../components/Singles/BonusesBackdrop'
import { MonopolyTables } from './../../../../data/models/MonopolyTable'
import { MonopolySpinTable } from '../../../../components/MonopolyLiveStats/MonopolySpinTable'
import { monopolySymbolToFilterOption } from '../../../../data/models/MonopolySpin'
import { MonopolySpin } from './../../../../data/models/MonopolySpin'
import MonopolyDiceRollTable from '../../../../components/MonopolyLiveStats/MonopolyDiceRollTable'
import MonopolyStatCard from '../../../../components/Cards/MonopolyStatCard'
import { HOME_BONUS_LIST } from '../../../../graphql/queries/bonus'
import StatsCta from '../../../../components/Singles/StatsCta'
import { getUserCountryCode } from '../../../../utils/Utils'
import BlockingOverlay from '../../../../components/Ui/BlockingOverlay'

interface Props {
    _requestedCountryCode: string
    _stats: {
        totalSpins: number
        lastTenSpins: Spin[]
        stats: any
    }
    _tables: MonopolyTables
    _lastTenSpins: MonopolySpin[]
    _bonuses: Bonus[]
    _pageContent: MonopolyArticle
    _countryCode: string
}

const SOCKET_ENDPOINT = 'https://monopoly.spike-realtime-api.eu'

const PAGE_BONUSES = ['888 Casino', 'StarCasinò', 'WinCasino', 'LeoVegas', 'William Hill']

const SPAM_BONUSES = true

const index: FunctionComponent<Props> = ({
    _requestedCountryCode,
    _tables,
    _lastTenSpins,
    _bonuses,
    _pageContent,
    _stats,
    _countryCode,
}) => {
    const aquaClient = new AquaClient()
    const MenuProps = {
        disableAutoFocusItem: true,
        PaperProps: {
            style: {
                width: 250,
            },
        },
    }

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const filterOptions = ['1', '2', '5', '10', 'Chance', '2 Rolls', '4 Rolls']
    const [selectedFilters, setSelectedFilters] = useState(filterOptions)
    useEffect(() => {
        setFilteredRows(rows.filter((r) => selectedFilters.includes(monopolySymbolToFilterOption(r.spinResultSymbol))))
    }, [selectedFilters])

    // keeps track of rows in the table
    const [rows, setRows] = useState<MonopolySpin[]>(_lastTenSpins)
    useEffect(() => {
        setFilteredRows(rows.filter((r) => selectedFilters.includes(monopolySymbolToFilterOption(r.spinResultSymbol))))
    }, [rows])
    const [filteredRows, setFilteredRows] = useState<MonopolySpin[]>(_lastTenSpins)
    const [lastUpdate, setLastUpdate] = useState(now())

    const [stats, setStats] = useState<MonopolySymbolStat[] | undefined>(_stats.stats)
    const [totalSpinsInTimeFrame, setTotalSpinsInTimeFrame] = useState(_stats.totalSpins)

    // keeps track of the stats
    const [tables, setTables] = useState<MonopolyTables | undefined>(_tables)
    // const [totalSpinsInTimeFrame, setTotalSpinsInTimeFrame] = useState(_stats.totalSpins)

    // the time frame currently selected
    const [timeFrame, setTimeFrame] = useState(TimeFrame.TWENTY_FOUR_HOURS)
    useEffect(() => {
        // see [socket] hook before this
        if (socket) {
            // whenever TimeFrame is changed we ask the socket server to join the new time frame updates (server takes care of leaving the previous TimeFrame updates)
            socket.emit(timeFrame)
            setTimeFrame(timeFrame)
            // we'll receive updates from the newly joined TimeFrame here
            socket.on(timeFrame, (data) => {
                // console.log(data, timeFrame)
                // this is the update regarding the top cards with percentages
                const topUpdate = data.stats.stats
                // this is the update regarding the rows of the table
                const updatedRows = data.spins
                if (rows)
                    setRows(
                        mergeWithUpdate(
                            rows,
                            updatedRows.map((r) => {
                                r.timeOfSpin = r.timeOfSpin - 1000 * 60 * 60 * 1
                                return r
                            })
                        )
                    )
                setTables(data.tables[0])
            })
        }
    }, [timeFrame])

    // the socket instance to receive real time updates
    const [socket, setSocket] = useState<Socket | undefined>(undefined)
    useEffect(() => {
        // the socket instance should only really change when it is initialized
        if (socket) {
            // we send a message to the socket server asking to subscribe a given TimeFrame updates
            socket.emit(timeFrame)
            // whenever the server sends updates to a given TimeFrame subcribers we receive them here
            socket.on(timeFrame, (data) => {
                console.log(data)
                // console.log(data, timeFrame)
                // this is the update regarding the top cards with percentages
                const topUpdate = data.stats.stats
                // this is the update regarding the rows of the table
                const updatedRows = data.spins
                // we merge the current rows and the updated rows updating the table afterward
                if (rows)
                    setRows(
                        mergeWithUpdate(
                            rows,
                            updatedRows.map((r) => {
                                r.timeOfSpin = r.timeOfSpin - 1000 * 60 * 60 * 1
                                return r
                            })
                        )
                    )
                setTables(data.tables[0])
                setLastUpdate(now())
            })
        }
    }, [socket])

    // table Ordering
    const [order, setOrder] = useState<'asc' | 'des'>('des')
    // stuff for multilanguage porpouses
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setContextCountry(_countryCode)
        // at first render we initialize socket connection
        const initializedSocket = io(SOCKET_ENDPOINT, {
            secure: true,
            rejectUnauthorized: false,
        })
        // set the new socket instance triggering the respective hook
        setSocket(initializedSocket)
        geoLocate()
        return () => {
            // cleaning up socket connection if it exists
            socket && socket.disconnect()
        }
    }, [])

    const geoLocate = async () => {
        const uc = await getUserCountryCode()
        setUserCountry(uc)
    }

    // handlers
    const handleTimeFrameChange = async (e) => setTimeFrame(e.target.value)

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const change = event.target.value as string[]
        console.log(change)
        setSelectedFilters(change)
    }

    return (
        <Fragment>
            <NavbarProvider currentPage='Monopoly Stats' countryCode={contextCountry}>
                <Head>
                    <title>{_pageContent.seo[0]?.seoTitle}</title>
                    <link rel='canonical' href={`https://spikeslot.com/live-stats/monopoly-live/${contextCountry}`} />
                    <meta name='description' content={_pageContent.seo[0].seoDescription}></meta>

                    {/* <!-- Google / Search Engine Tags --> */}
                    <meta
                        itemProp='name'
                        content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                    />
                    <meta itemProp='description' content={_pageContent.seo[0].seoDescription} />
                    <meta itemProp='image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                    {/* <!-- Twitter Meta Tags --> */}
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta
                        name='twitter:title'
                        content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                    />
                    <meta name='twitter:description' content={_pageContent.seo[0].seoDescription} />
                    <meta name='twitter:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                    {/* <!-- Facebook Meta Tags --> */}
                    <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                    <meta property='og:locale' content={'it'} />
                    <meta property='og:type' content='article' />
                    <meta property='og:description' content={_pageContent.seo[0].seoDescription} />
                    <meta property='og:site_name' content={_pageContent.seo[0]?.seoTitle} />

                    <meta httpEquiv='content-language' content='it-IT'></meta>
                    <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                    <meta property='og:locale' content={'it'} />
                    <meta property='og:type' content='article' />
                    <meta property='og:description' content={_pageContent.seo[0].seoDescription} />
                    <meta property='og:site_name' content={_pageContent.seo[0]?.seoTitle} />
                </Head>

                <BodyContainer>
                    <BlockingOverlay redirectLink='/live-stats/monopoly-live/it' userCountry={userCountry} />

                    <MainColumnScroll
                        style={{ width: '100%', maxWidth: '90%', paddingBottom: '4rem', paddingTop: '2rem' }}
                    >
                        <DynamicContent content={_pageContent.topContent} />
                        <Divider style={{ marginTop: '2rem' }} />

                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '2rem',
                                }}
                            >
                                <div>
                                    <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{t('Monopoly Statistics')}</h1>
                                    <h1 style={{ marginTop: '.5rem' }}>
                                        {`${t('for the past')} ${timeFrame}`}
                                        <span style={{ marginLeft: '1rem', fontWeight: 'bold', color: 'crimson' }}>
                                            In REAL TIME
                                        </span>
                                    </h1>
                                </div>

                                <div>
                                    <Select
                                        labelId='demo-simple-select-label'
                                        value={timeFrame}
                                        onChange={(e) => handleTimeFrameChange(e)}
                                    >
                                        {Object.values(TimeFrame).map((k, i) => (
                                            <MenuItem key={k} value={k}>
                                                {Object.values(TimeFrame)[i]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '.9rem' }}>{`${t('Last Update')} ${format(
                                lastUpdate,
                                'dd/MM HH:mm:ss'
                            )}`}</p>
                        </div>

                        <Divider style={{ marginTop: '2rem', marginBottom: '2rem' }} />

                        {stats && (
                            <StatsContainer>
                                {stats.map((s) => (
                                    <MonopolyStatCard
                                        key={`stats_${s.symbol}`}
                                        stat={s}
                                        totalSpinsConsidered={totalSpinsInTimeFrame}
                                        timeFrame={timeFrame}
                                    />
                                ))}
                            </StatsContainer>
                        )}

                        <h1
                            style={{
                                marginTop: '2rem',
                                color: 'crimson',
                                fontWeight: 'bold',
                                fontSize: '1.4rem',
                                textAlign: 'center',
                            }}
                        >{`${t('You can play at Monopoly here')}`}</h1>
                        <Paper elevation={6} style={{ marginTop: '1rem', marginBottom: '4rem' }}>
                            {_bonuses && _bonuses.map((b) => <BonusStripe key={b.name} bonus={b} />)}
                        </Paper>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                            }}
                        >
                            <h1
                                style={{
                                    marginTop: '2rem',
                                    color: 'crimson',
                                    fontWeight: 'bold',
                                    fontSize: '1.4rem',
                                    marginBottom: '1rem',
                                }}
                            >
                                {`${t('Spin History')}`}
                            </h1>

                            <div>
                                <Select
                                    labelId='demo-mutiple-checkbox-label'
                                    id='demo-mutiple-checkbox'
                                    multiple
                                    value={selectedFilters}
                                    onChange={handleChange}
                                    input={<Input />}
                                    renderValue={(selected) => 'Filtri'}
                                    MenuProps={MenuProps}
                                >
                                    {filterOptions.map((name) => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={selectedFilters.indexOf(name) > -1} />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {rows && <MonopolySpinTable rows={filteredRows} />}

                        {tables && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    marginTop: '4rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <MonopolyDiceRollTable type='low' rows={tables.lowTierTable.rows} />
                                <MonopolyDiceRollTable type='mid' rows={tables.midTierTable.rows} />
                                <MonopolyDiceRollTable type='high' rows={tables.highTierTable.rows} />
                            </div>
                        )}

                        <StatsCta exclude={'monopoly'} />

                        <DynamicContent content={_pageContent.bottomContent} />

                        {SPAM_BONUSES && <BonusesBackdrop bonuses={_bonuses} />}
                    </MainColumnScroll>
                </BodyContainer>
            </NavbarProvider>
        </Fragment>
    )
}

// helper function to merge exsisting rows with the update from the Socket
export const mergeWithUpdate = (current: MonopolySpin[], update: MonopolySpin[]) => {
    // the latest row in the table
    const lastFromCurrent = current[0]
    // slicing up the update array to the last known row based on the _id
    const slicedUpdate = update.slice(0, update.map((u) => u._id).indexOf(lastFromCurrent._id))
    // spreading the result so that is automatically ordered by time as returned by the Socket
    return [...slicedUpdate, ...current]
}

export const getServerSideProps = async ({ query, req, res }) => {
    const { countryCode } = query

    console.log(countryCode, 'country code  ')

    const aquaClient = new AquaClient()

    const _requestedCountryCode = query.countryCode
    const pageData = await axios.get('https://monopoly.spike-realtime-api.eu/api/data-for-the-last-hours/24')

    const pageContent = await aquaClient.query({
        query: PAGE_ARTICLE_QUERY,
        variables: {
            countryCode: countryCode,
        },
    })

    const orderedBonusList: Bonus[] = []

    if (countryCode === 'it') {
        const bonuses = await aquaClient.query({
            query: BONUS_QUERY,
            variables: {
                countryCode: countryCode,
                names: PAGE_BONUSES,
            },
        })

        PAGE_BONUSES.forEach((name) => orderedBonusList.push(bonuses.data.data.bonuses.find((it) => it.name === name)))
    } else {
        const bonuses = await aquaClient.query({
            query: HOME_BONUS_LIST,
            variables: {
                countryCode: countryCode,
            },
        })
        bonuses.data.data.homes[0].bonuses.bonus.forEach((b) => orderedBonusList.push(b.bonus))
    }

    const bonuses = await aquaClient.query({
        query: BONUS_QUERY,
        variables: {
            countryCode: 'it',
            names: PAGE_BONUSES,
        },
    })

    const bonusRemapping = {
        BetFlag: 'https://adv.betflag.com/redirect.aspx?pid=5262&bid=2690',
        LeoVegas: 'https://ntrfr.leovegas.com/redirect.aspx?pid=3704489&lpid=1757&bid=19140',
        '888 Casino': 'https://ic.aff-handler.com/c/43431?sr=1868828',
        StarCasinò: 'https://record.starcasino.it/_SEA3QA6bJTNXl890vMAfUGNd7ZgqdRLk/131/',
        Unibet: 'https://b1.trickyrock.com/redirect.aspx?pid=70955130&bid=21251',
        'William Hill':
            'https://campaigns.williamhill.it/C.ashx?btag=a_200887b_834c_&affid=1742025&siteid=200887&adid=834&c=',
        'PokerStars Casino':
            'https://secure.starsaffiliateclub.com/C.ashx?btag=a_182773b_6258c_&affid=100976968&siteid=182773&adid=6258&c=',
    }

    console.log(pageData.data)

    return {
        props: {
            _requestedCountryCode,
            _tables: pageData.data.tables[0],
            _lastTenSpins: pageData.data.spinsInTimeFrame.map((r) => {
                r.timeOfSpin = r.timeOfSpin - 1000 * 60 * 60 * 1
                return r
            }),
            _stats: pageData.data.stats,
            _bonuses:
                countryCode === 'it'
                    ? orderedBonusList.map((b) => {
                          if (b.name !== 'WinCasino') b.link = bonusRemapping[b.name]
                          return b
                      })
                    : orderedBonusList,
            _pageContent: pageContent.data.data.monopolyArticles[0],
            _countryCode: countryCode,
        },
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
    monopolyArticles(
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`

export const VerticalDivider = styled.div`
    width: 1px;
    height: 100%;
`

const TimeFrameContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
    margin: 2rem 0rem;
`

export default index
