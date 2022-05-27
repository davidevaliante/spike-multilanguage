import React, { useContext, useState, useEffect } from 'react'
import { FunctionComponent, Fragment } from 'react'
import { LocaleContext } from '../../../../context/LocaleContext'
import FullPageLoader from '../../../../components/Layout/FullPageLoader'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn, MainColumnScroll } from '../../../../components/Layout/Layout'
import io, { Socket } from 'socket.io-client'
import { Select, MenuItem, Paper, Divider, Backdrop, Input, Checkbox, ListItemText } from '@material-ui/core'
import { TimeFrame } from '../../../../data/models/TimeFrames'
import styled from 'styled-components'
import { crazyTimeSymbolToFilterOption } from '../../../../data/models/Spin'
import axios from 'axios'
import { CrazyTimeSymbolStat, SweetBonanzaCandylandStat } from '../../../../data/models/CrazyTimeSymbolStat'
import CrazyTimeStatCard from '../../../../components/Cards/CrazyTimeStatCard'
import { CrazyTimeTable } from '../../../../components/CrazyTimeLiveStats/CrazyTimeTable'
import AquaClient from '../../../../graphql/aquaClient'
import BonusStripe from '../../../../components/Cards/BonusStripe'
import { Bonus, CrazyTimeArticle } from '../../../../graphql/schema'
import DynamicContent, { articleBlockRenderer } from '../../../../components/DynamicContent/DynamicContent'
import Head from 'next/head'
import { format } from 'date-fns'
import now from 'lodash/now'
import BonusesBackdrop from '../../../../components/Singles/BonusesBackdrop'
import { HOME_BONUS_LIST } from '../../../../graphql/queries/bonus'
import { SweetBonanzaSpin } from '../../../../data/models/SweetBonanzaSpin'
import SweetBonanzaCandylandCard from '../../../../components/Cards/SweetBonanzaCandylandCard'
import { SweetBonanzaTable } from '../../../../components/SweetBonanzaCandylandLiveStats/SweetBonanzaTimeTable'

interface Props {
    _requestedCountryCode: string
    _stats: {
        totalSpins: number
        lastTenSpins: SweetBonanzaSpin[]
        stats: any
    }
    _lastTenSpins: SweetBonanzaSpin[]
    _bonuses: Bonus[]
    _pageContent: CrazyTimeArticle
    _countryCode: string
}

const SOCKET_ENDPOINT = 'https://sbcandyland.topadsservices.com'

// const SOCKET_ENDPOINT = 'localhost:5000'

// const PAGE_BONUSES = ['888 Casino', 'PokerStars Casino', 'StarCasinò', 'WinCasino', 'LeoVegas']

const PAGE_BONUSES = ['WinCasino', 'LeoVegas', 'StarCasinò', '888 Casino', 'Eurobet']

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

    const filterOptions = ['1', '2', '5', 'Bubble Surprise', 'Sweet Spins', 'Candy Drop']
    const [selectedFilters, setSelectedFilters] = useState(filterOptions)
    useEffect(() => {
        setFilteredRows(
            rows.filter((r) => {
                if (selectedFilters.includes('Candy Drop')) {
                    return r.result === 'Bubble Surprise' && r.payout.length > 1
                }
                return selectedFilters.includes(r.result)
            })
        )
    }, [selectedFilters])

    // keeps track of rows in the table
    const [rows, setRows] = useState<SweetBonanzaSpin[]>(_lastTenSpins)
    useEffect(() => {
        setFilteredRows(
            rows.filter((r) => {
                if (r.result === 'Bubble Surprise' && selectedFilters.includes('Candy Drop')) {
                    return r.payout.length > 1
                }
                return selectedFilters.includes(r.result)
            })
        )
        // console.log(filteredRows, 'fitlered rows')
    }, [rows])
    const [filteredRows, setFilteredRows] = useState<SweetBonanzaSpin[]>(_lastTenSpins)
    const [lastUpdate, setLastUpdate] = useState(now())

    // keeps track of the stats
    const [stats, setStats] = useState<SweetBonanzaCandylandStat[] | undefined>(_stats.stats)

    const [totalSpinsInTimeFrame, setTotalSpinsInTimeFrame] = useState(_stats.totalSpins)
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
                const topUpdate = data.stats.stats.stats
                // this is the update regarding the rows of the table
                const updatedRows = data.spins
                if (rows)
                    setRows(
                        mergeWithUpdate(
                            rows,
                            updatedRows.map((r) => {
                                r.timeMillis = r.timeMillis - 1000 * 60 * 60 * 1
                                return r
                            })
                        )
                    )
                setStats(topUpdate)
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
                // console.log(data, timeFrame)
                // this is the update regarding the top cards with percentages
                const topUpdate = data.stats.stats.stats
                // this is the update regarding the rows of the table
                const updatedRows = data.spins
                // we merge the current rows and the updated rows updating the table afterward
                if (rows)
                    setRows(
                        mergeWithUpdate(
                            rows,
                            updatedRows.map((r) => {
                                r.timeMillis = r.timeMillis - 1000 * 60 * 60 * 1
                                return r
                            })
                        )
                    )
                setStats(topUpdate)
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
        return () => {
            // cleaning up socket connection if it exists
            socket && socket.disconnect()
        }
    }, [])

    // handlers
    const handleTimeFrameChange = async (e) => setTimeFrame(e.target.value)

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const change = event.target.value as string[]
        // console.log(change)
        setSelectedFilters(change)
    }

    const seoTitle = 'Diretta Estrazioni | Sweet Bonanza Candyland | SPIKE Slot'
    const seoDescription =
        'Estrazioni in diretta, game show di Pragmatic Play. Controlla i dettagli di tutte le estrazioni. Crea con facilità una strategia unica per gestire il tuo Budget.🎡🎲'

    const imageSocial = 'https://spike-images.s3.eu-central-1.amazonaws.com/Sweet-Bonanza-Candyland-min.jpg'

    return (
        <Fragment>
            <NavbarProvider currentPage='Sweet Bonanza Stats' countryCode={contextCountry}>
                <Head>
                    <title>{seoTitle}</title>
                    <link rel='canonical' href={`https://spikeslot.com/live-stats/crazy-time/${contextCountry}`} />
                    <meta name='description' content={seoDescription}></meta>

                    <meta
                        itemProp='name'
                        content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                    />
                    <meta itemProp='description' content={seoDescription} />
                    <meta itemProp='image' content={imageSocial} />

                    <meta name='twitter:card' content='summary_large_image' />
                    <meta
                        name='twitter:title'
                        content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                    />
                    <meta name='twitter:description' content={seoDescription} />
                    <meta name='twitter:image' content={imageSocial} />

                    <meta property='og:image' content={imageSocial} />
                    <meta property='og:locale' content={'it'} />
                    <meta property='og:type' content='article' />
                    <meta property='og:description' content={seoDescription} />
                    <meta property='og:site_name' content={seoTitle} />

                    <meta httpEquiv='content-language' content='it-IT'></meta>
                    <meta property='og:image' content={imageSocial} />
                    <meta property='og:locale' content={'it'} />
                    <meta property='og:type' content='article' />
                    <meta property='og:description' content={seoDescription} />
                    <meta property='og:site_name' content={seoTitle} />
                </Head>

                <BodyContainer>
                    <MainColumnScroll
                        style={{ width: '100%', maxWidth: '90%', paddingBottom: '4rem', paddingTop: '2rem' }}
                    >
                        {articleBlockRenderer(
                            'top',
                            `## Statistiche delle Estrazioni in Tempo Reale Sweet Bonanza Candyland

Puoi trovare qui tutte le informazioni principali relative alle estrazioni in tempo reale del gioco Live di Pragmatic Play: Sweet Bonanza Candyland.<br>
Spikeslot.com è il primo sito al mondo ad ospitare le statistiche di Sweet Bonanza Candyland.<br>
È da sottolineare come a prescindere da come si interpretano i dati, il gioco a Sweet Bonanza Candyland farà sempre perdere gli utenti nel lungo periodo, avendo un RTP variabile tra **91.59%** e **96.95%**.<br><br>

Usufruendo degli strumenti qui forniti, potrai avere un’idea generale sul gioco, e **potrai verificare la frequenza dell’uscita dei numeri**, in modo tale da pensare a una tua strategia responsabile.<br>
**Giocate sempre responsabilmente e solo se avete compiuto i 18 anni**.`
                        )}

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
                                        {t('Sweet Bonanza Candyland Stats')}
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
                                    <SweetBonanzaCandylandCard
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
                        >{`${t('You can play at Sweet Bonanza Candyland HERE')}`}</h1>
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

                        {rows && <SweetBonanzaTable rows={filteredRows} />}

                        {articleBlockRenderer(
                            'bottom',
                            `## Verifica gli ultimi numeri estratti al gioco Live Sweet Bonanza Candyland

Sweet Bonanza Candyland è un gioco nel panorama del Casinò Live che permette di vivere un’esperienza prudente in un atmosfera piena di caramelle.<br>
In breve, c’è una ruota della fortuna con 54 settori che viene girata dal croupier presente all’interno dello studio, e il compito dei giocatori è quello di indovinare il valore di dove finirà il giro.<br>
Tuttavia, all’interno della sessione di gioco sono presenti delle funzioni danno più o meno un modo diversificato di intrattenersi.<br><br>

Scoprire, quindi, quali sono gli ultimi numeri estratti a questo gioco Live, può essere discretamente utile per creare **una propria strategia** e per avere un’idea generale su quali valori scommettere in maniera moderata.<br><br>

Più precisamente, nella parte in alto a destra, l’utente può **selezionare l’arco temporale durante cui vuole consultare le statistiche**.<br>
Su ogni numero sono presenti diverse informazioni concernenti la sua probabilità di uscita e l’ultima uscita nel corso dell’arco temporale considerato.<br>
In questo modo, si può rimanere aggiornati sull’andamento del gioco Live.<br><br>

Inoltre, si può contare quante volte è stato estratto un determinato numero nel corso della giornata, per chi volesse saperlo.<br>
Infine, riguardo allo storico, è stata messa a disposizione **nella parte in basso una tabella con i dati dei singolo spin**, in modo da dare un facile accesso ad essi.<br>
Ricordiamo comunque che il gioco è stato creato da Pragmatic per far perdere soldi a chi partecipa alla sessione.<br><br>


## Ci sono vantaggi  con possibilità di consultare le statistiche di Sweet Bonanza Candyland in tempo reale o solo svantaggi?

Consideriamo dapprima che i giocatori hanno la chance di **valutare le probabilità teoriche di uscita dei settori della ruota con la realtà**, e quindi con le uscite praticate durante la live.<br>
I provider dei giochi in genere dichiarano un valore teorico medio delle probabilità di uscita di un singolo numero.<br>
Per questo già si sa a priori che durante la partita i valori dei numeri ruoteranno intorno a certi valori di probabilità.<br><br>

Però ci possono essere delle piccole oscillazioni locali.<br>
Quindi, tenendo saldo il concetto per cui la fortuna svolge sempre il ruolo predominante in quanto tutti i giri sono indipendenti, le statistiche fornite in questa webpage di spikeslot.com possono dare una strada più facile per individuare una propria strategia.<br><br>

Nel caso in cui un certo valore non esca da un certo numero di giri, si potrebbe pensare di puntare proprio  su quel numero, anche se **non ci sono garanzie che venga recuperato il Budget iniziale dei giocatori**.<br><br>

Per questo, diciamo ancora una volta di giocare in maniera responsabile e consapevole, in quanto per la stragrande maggioranza degli utenti non si avrà un incremento delle scommesse all’interno del Casinò Live.<br><br>


## Intrattenimento responsabile con le statistiche di Sweet Bonanza Candyland

Tutti gli user del settore e in particolare del Casinò Live, hanno l’opportunità di consultare le statistiche di Sweet Bonanza Candyland consapevolmente in tempo reale, durante tutta la giornata e in maniera totalmente gratuita sul sito di SPIKE Slot.<br>
Ispezionare alcuni di questi dati può essere uno strumento in più per **monitorare come sta andando la sessione dal vivo** e scegliere eventualmente di usare una puntata piuttosto che un’altra.<br><br>

A lungo termine il gioco porterà ad una perdita di credito, come è già possibile intuire considerando il Return to Player, ossia Ritorno al Giocatore da **91.59%** a **96.95%**.<br>
In ogni caso, per avere maggiori informazioni concernenti questo titolo gioco Live e per verificare le possibili strategie da utilizzare, puoi visitare la [guida Sweet Bonanza Candy Land](https://spikeslot.com/articoli/guida-sweet-bonanza-candyland-live-pragmatic-play/it).<br><br>

![Sweet Bonanza Candyland Stats Live Card](https://spike-images.s3.eu-central-1.amazonaws.com/live-stats-sweet-bonanza-candyland_2ba18b4723.jpeg)

<br>

Non dimenticare che il divertimento deve essere figlio soltanto di un gioco moderato e prudente.<br><br><br>


Ultimo aggiornamento: **27 Maggio 2022**`
                        )}

                        {SPAM_BONUSES && <BonusesBackdrop bonuses={_bonuses} />}
                    </MainColumnScroll>
                </BodyContainer>
            </NavbarProvider>
        </Fragment>
    )
}

// helper function to merge exsisting rows with the update from the Socket
export const mergeWithUpdate = (current: SweetBonanzaSpin[], update: SweetBonanzaSpin[]) => {
    // the latest row in the table
    const lastFromCurrent = current[0]
    // slicing up the update array to the last known row based on the _id

    console.log(current, update)

    const slicedUpdate = update.slice(0, update.map((u) => u._id).indexOf(lastFromCurrent._id))
    // spreading the result so that is automatically ordered by time as returned by the Socket
    return [...slicedUpdate, ...current]
}

export const getServerSideProps = async ({ query, req, res }) => {
    const aquaClient = new AquaClient()

    const { countryCode } = query

    const _requestedCountryCode = query.countryCode
    const pageData = await axios.get('https://sbcandyland.topadsservices.com/api/data-in-the-last-hours/24')
    // console.log(pageData.data)

    // const pageContent = await aquaClient.query({
    //     query: PAGE_ARTICLE_QUERY,
    //     variables: {
    //         countryCode: countryCode,
    //     },
    // })

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
        Eurobet: 'https://record.betpartners.it/_E_C7XwxgprAZV93hC2dJ_GNd7ZgqdRLk/165',
    }

    return {
        props: {
            _requestedCountryCode,
            _stats: pageData.data.stats,
            _lastTenSpins: pageData.data.spinsInTimeFrame.map((r) => {
                r.timeMillis = r.timeMillis - 1000 * 60 * 60 * 1
                return r
            }),
            _bonuses:
                countryCode === 'it'
                    ? orderedBonusList.map((b) => {
                          const remap = bonusRemapping[b.name]
                          if (remap) b.link = bonusRemapping[b.name]
                          return b
                      })
                    : orderedBonusList,
            // _pageContent: pageContent.data.data.crazyTimeArticles[0],
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
