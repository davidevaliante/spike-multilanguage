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
import { CrazyTimeSymbolStat } from '../../../../data/models/CrazyTimeSymbolStat'
import CrazyTimeStatCard from '../../../../components/Cards/CrazyTimeStatCard'
import { CrazyTimeTable } from '../../../../components/CrazyTimeLiveStats/CrazyTimeTable'
import AquaClient from './../../../../graphql/aquaClient'
import BonusStripe from '../../../../components/Cards/BonusStripe'
import { Bonus, CrazyTimeArticle } from '../../../../graphql/schema'
import DynamicContent from '../../../../components/DynamicContent/DynamicContent'
import Head from 'next/head'
import { format } from 'date-fns'
import now from 'lodash/now'
import BonusesBackdrop from '../../../../components/Singles/BonusesBackdrop'
import { HOME_BONUS_LIST } from '../../../../graphql/queries/bonus'
import StatsCta from '../../../../components/Singles/StatsCta'
import { substituteName } from '../../../../config'
import BlockingOverlay from '../../../../components/Ui/BlockingOverlay'
import { getUserCountryCode } from '../../../../utils/Utils'

interface Props {
    _requestedCountryCode: string
    _stats: any
    _lastTenSpins: Spin[]
    _bonuses: Bonus[]
    _pageContent: CrazyTimeArticle
    _countryCode: string
}

const SOCKET_ENDPOINT = 'https://casinowizard.topadscron.it/crazy-time'

const PAGE_BONUSES = ['888 Casino', 'StarCasinò', 'WinCasino', 'LeoVegas', 'Unibet']

const SPAM_BONUSES = false

const index: FunctionComponent<Props> = ({
    _requestedCountryCode,
    _stats,
    _lastTenSpins,
    _bonuses,
    _pageContent,
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

    const lazyUpdateInitialData = async () => {
        const update = await axios.get(`https://casinowizard.topadscron.it/crazy-time?hours=24`)

        console.log(update.data.data)
        setStats(orderStats(update.data.data.snapshotData))
        setRows(update.data.data.resultsData)
    }

    const filterOptions = ['1', '2', '5', '10', 'Pachinko', 'Cash Hunt', 'Coin Flip', 'Crazy Time']
    const [selectedFilters, setSelectedFilters] = useState(filterOptions)
    useEffect(() => {
        setFilteredRows(rows.filter((r) => selectedFilters.includes(crazyTimeSymbolToFilterOption(r.spinResultSymbol))))
    }, [selectedFilters])

    // keeps track of rows in the table
    const [rows, setRows] = useState<Spin[]>(_lastTenSpins)
    useEffect(() => {
        setFilteredRows(rows.filter((r) => selectedFilters.includes(crazyTimeSymbolToFilterOption(r.spinResultSymbol))))
    }, [rows])
    const [filteredRows, setFilteredRows] = useState<Spin[]>(_lastTenSpins)
    const [lastUpdate, setLastUpdate] = useState(now())

    // keeps track of the stats
    const [stats, setStats] = useState<CrazyTimeSymbolStat[] | undefined>(_stats)
    const [totalSpinsInTimeFrame, setTotalSpinsInTimeFrame] = useState(_stats.totalSpins)
    // the time frame currently selected
    const [timeFrame, setTimeFrame] = useState(TimeFrame.TWENTY_FOUR_HOURS)
    useEffect(() => {
        if (socket) {
            socket.emit('1h')
            setTimeFrame(timeFrame)
            socket.on('newEntry', (data) => {
                console.log(data, timeFrame)
                if (rows) {
                    let newEntry = data.entries
                    setRows((prev) => mergeWithUpdate(prev, [newEntry]))
                }
                setStats(orderStats(data.stats))
            })
        }
    }, [timeFrame])

    // the socket instance to receive real time updates
    const [socket, setSocket] = useState<Socket | undefined>(undefined)
    useEffect(() => {
        if (socket) {
            socket.emit('1h')
            socket.on('newEntry', (data) => {
                console.log(data, timeFrame)
                if (rows) {
                    let newEntry = data.entries
                    setRows((prev) => mergeWithUpdate(prev, [newEntry]))
                }

                setStats(orderStats(data.stats))
                setLastUpdate(now())
            })
        }
    }, [socket])

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
        setSelectedFilters(change)
    }

    useEffect(() => {
        lazyUpdateInitialData()
    }, [])

    return (
        <Fragment>
            <NavbarProvider currentPage='Crazy Time Stats' countryCode={contextCountry}>
                <Head>
                    <title>{_pageContent.seo?.seoTitle}</title>
                    <link rel='canonical' href={`https://spikeslot.com/live-stats/crazy-time/${contextCountry}`} />
                    <meta name='description' content={_pageContent.seo.seoDescription}></meta>

                    {/* <!-- Google / Search Engine Tags --> */}
                    <meta
                        itemProp='name'
                        content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                    />
                    <meta itemProp='description' content={_pageContent.seo.seoDescription} />
                    <meta itemProp='image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                    {/* <!-- Twitter Meta Tags --> */}
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta
                        name='twitter:title'
                        content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                    />
                    <meta name='twitter:description' content={_pageContent.seo.seoDescription} />
                    <meta name='twitter:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                    {/* <!-- Facebook Meta Tags --> */}
                    <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                    <meta property='og:locale' content={'it'} />
                    <meta property='og:type' content='article' />
                    <meta property='og:description' content={_pageContent.seo.seoDescription} />
                    <meta property='og:site_name' content={_pageContent.seo?.seoTitle} />

                    <meta httpEquiv='content-language' content='it-IT'></meta>
                    <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                    <meta property='og:locale' content={'it'} />
                    <meta property='og:type' content='article' />
                    <meta property='og:description' content={_pageContent.seo?.seoDescription} />
                    <meta property='og:site_name' content={_pageContent.seo?.seoTitle} />
                </Head>

                <BodyContainer>
                    <BlockingOverlay redirectLink='/live-stats/crazy-time/it' userCountry={userCountry} />
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
                                    <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>
                                        {t('Crazy Time Statistics')}
                                    </h1>
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
                                    <CrazyTimeStatCard
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
                        >{`${t('You can play at CRAZY TIME here')}`}</h1>
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

                        {rows && <CrazyTimeTable rows={filteredRows} />}

                        <StatsCta exclude={'crazy-time'} />

                        <DynamicContent content={_pageContent.bottomContent} />

                        {SPAM_BONUSES && <BonusesBackdrop bonuses={_bonuses} />}
                    </MainColumnScroll>
                </BodyContainer>
            </NavbarProvider>
        </Fragment>
    )
}

// helper function to merge exsisting rows with the update from the Socket
export const mergeWithUpdate = (current: Spin[], update: Spin[]) => {
    // spreading the result so that is automatically ordered by time as returned by the Socket
    return [...update, ...current]
}

export const getServerSideProps = async ({ query, req, res }) => {
    const aquaClient = new AquaClient()

    const { countryCode } = query

    const _requestedCountryCode = query.countryCode
    const { data: pageData } = await axios.get('https://casinowizard.topadscron.it/crazy-time?hours=3')

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

    const bonusRemapping = {
        BetFlag: 'https://adv.betflag.com/redirect.aspx?pid=5262&bid=2690',
        LeoVegas: 'https://ads.leovegas.com/redirect.aspx?pid=3704489&bid=14965',
        '888 Casino': 'https://ic.aff-handler.com/c/43431?sr=1868828',
        StarCasinò: 'https://record.starcasino.it/_SEA3QA6bJTNXl890vMAfUGNd7ZgqdRLk/131/',
        Unibet: 'https://b1.trickyrock.com/redirect.aspx?pid=70955130&bid=21251',
        'PokerStars Casino':
            'https://secure.starsaffiliateclub.com/C.ashx?btag=a_182773b_6258c_&affid=100976968&siteid=182773&adid=6258&c=',
        WinCasino: 'https://www.wincasinopromo.it/?=registration&mp=cd6cb4e9-42cc-4d51-bc95-46bbb80844a2',
    }

    const snapshot = pageData.data.snapshotData

    return {
        props: {
            _requestedCountryCode,
            _stats: orderStats(snapshot),
            _lastTenSpins: pageData.data.resultsData,
            _bonuses:
                countryCode === 'it'
                    ? orderedBonusList.map((b) => {
                          const remap = bonusRemapping[b.name]
                          if (remap) b.link = bonusRemapping[b.name]
                          return b
                      })
                    : orderedBonusList,
            _pageContent: pageContent.data.data.crazyTimeArticles[0],
            _countryCode: countryCode,
        },
    }
}

export const orderStats = (arr: any[]) => [arr[4], arr[5], arr[6], arr[7], arr[1], arr[2], arr[3], arr[0]]

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
