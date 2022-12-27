import { Divider, Select, MenuItem, Paper, Input, Checkbox, ListItemText } from '@material-ui/core'
import axios from 'axios'
import { format } from 'date-fns'
import { now } from 'lodash'
import Head from 'next/head'
import React, { useContext, useState, useEffect } from 'react'
import { FunctionComponent, Fragment } from 'react'
import { Socket, io } from 'socket.io-client'
import styled from 'styled-components'
import BonusStripe from '../../../../components/Cards/BonusStripe'
import MegaWheelCard from '../../../../components/Cards/MegaWheelCard'
import SweetBonanzaCandylandCard from '../../../../components/Cards/SweetBonanzaCandylandCard'
import { articleBlockRenderer } from '../../../../components/DynamicContent/DynamicContent'
import { BodyContainer, MainColumnScroll } from '../../../../components/Layout/Layout'
import { MegaWheelTable } from '../../../../components/MegaWheelStats/MegaWheelTable'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import BonusesBackdrop from '../../../../components/Singles/BonusesBackdrop'
import StatsCta from '../../../../components/Singles/StatsCta'
import { SweetBonanzaTable } from '../../../../components/SweetBonanzaCandylandLiveStats/SweetBonanzaTimeTable'
import BlockingOverlay from '../../../../components/Ui/BlockingOverlay'
import { LocaleContext } from '../../../../context/LocaleContext'
import { MegaWheelStat, SweetBonanzaCandylandStat } from '../../../../data/models/CrazyTimeSymbolStat'
import { MegaWheelSpin } from '../../../../data/models/MegaWheelSpin'
import { TimeFrame } from '../../../../data/models/TimeFrames'
import AquaClient from '../../../../graphql/aquaClient'
import { HOME_BONUS_LIST } from '../../../../graphql/queries/bonus'
import { Bonus, CrazyTimeArticle } from '../../../../graphql/schema'
import { getUserCountryCode } from '../../../../utils/Utils'

interface Props {
    _requestedCountryCode: string
    _stats: {
        totalSpins: number
        lastTenSpins: MegaWheelSpin[]
        stats: any
    }
    _lastTenSpins: MegaWheelSpin[]
    _bonuses: Bonus[]
    _pageContent: CrazyTimeArticle
    _countryCode: string
}

const SOCKET_ENDPOINT = 'https://megaball.topadsservices.com'

// const SOCKET_ENDPOINT = 'localhost:5000'

// const PAGE_BONUSES = ['888 Casino', 'PokerStars Casino', 'StarCasinò', 'WinCasino', 'LeoVegas']

const PAGE_BONUSES = ['WinCasino', 'LeoVegas', 'StarCasinò', '888 Casino', 'King Casino']

const SPAM_BONUSES = true

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

    const filterOptions = [1, 2, 5, 8, 10, 15, 20, 30, 40]
    const [selectedFilters, setSelectedFilters] = useState(filterOptions)
    useEffect(() => {
        setFilteredRows(rows.filter((r) => selectedFilters.includes(r.result)))
    }, [selectedFilters])

    // keeps track of rows in the table
    const [rows, setRows] = useState<MegaWheelSpin[]>(_lastTenSpins)
    useEffect(() => {
        setFilteredRows(rows.filter((r) => selectedFilters.includes(r.result)))
        // console.log(filteredRows, 'fitlered rows')
    }, [rows])
    const [filteredRows, setFilteredRows] = useState<MegaWheelSpin[]>(_lastTenSpins)
    const [lastUpdate, setLastUpdate] = useState(now())

    // keeps track of the stats
    const [stats, setStats] = useState<MegaWheelStat[] | undefined>(_stats.stats)

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
        const change = event.target.value as number[]
        // console.log(change)
        setSelectedFilters(change)
    }

    const seoTitle = 'Diretta Estrazioni | Mega Wheel | SPIKE Slot'
    const seoDescription =
        'Estrazioni in diretta, game show di Pragmatic Play. Controlla i dettagli di tutte le estrazioni. Crea con facilità una strategia unica per gestire il tuo Budget.🎡🎲'

    const imageSocial = 'https://spike-images.s3.eu-central-1.amazonaws.com/megawheel.webp'

    return (
        <Fragment>
            <NavbarProvider currentPage='Mega Wheel Stats' countryCode={contextCountry}>
                <Head>
                    <title>{MegaWheelArticles(contextCountry, 'title')}</title>
                    <link rel='canonical' href={`https://spikeslot.com/live-stats/mega-wheel/${contextCountry}`} />
                    <meta name='description' content={MegaWheelArticles(contextCountry, 'desc')}></meta>

                    <meta
                        itemProp='name'
                        content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                    />
                    <meta itemProp='description' content={MegaWheelArticles(contextCountry, 'desc')} />
                    <meta itemProp='image' content={imageSocial} />

                    <meta name='twitter:card' content='summary_large_image' />
                    <meta
                        name='twitter:title'
                        content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                    />
                    <meta name='twitter:description' content={MegaWheelArticles(contextCountry, 'desc')} />
                    <meta name='twitter:image' content={imageSocial} />

                    <meta property='og:image' content={imageSocial} />
                    <meta property='og:locale' content={'it'} />
                    <meta property='og:type' content='article' />
                    <meta property='og:description' content={MegaWheelArticles(contextCountry, 'desc')} />
                    <meta property='og:site_name' content={MegaWheelArticles(contextCountry, 'title')} />

                    <meta httpEquiv='content-language' content='it-IT'></meta>
                    <meta property='og:image' content={imageSocial} />
                    <meta property='og:locale' content={'it'} />
                    <meta property='og:type' content='article' />
                    <meta property='og:description' content={MegaWheelArticles(contextCountry, 'desc')} />
                    <meta property='og:site_name' content={MegaWheelArticles(contextCountry, 'title')} />
                </Head>

                <BodyContainer>
                    <BlockingOverlay redirectLink='/live-stats/mega-wheel/it' userCountry={userCountry} />

                    <MainColumnScroll
                        style={{ width: '100%', maxWidth: '90%', paddingBottom: '4rem', paddingTop: '2rem' }}
                    >
                        {articleBlockRenderer('top', MegaWheelArticles(contextCountry, 'top'))}

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
                                    <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{`Mega Wheel Stats`}</h1>
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
                                    <MegaWheelCard
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
                        >
                            {contextCountry === 'it'
                                ? `Puoi giocare alla Mega Wheel QUI`
                                : `You can play at MegaWheel HERE`}
                        </h1>
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

                        {rows && <MegaWheelTable rows={filteredRows} />}

                        <StatsCta exclude={'megawheel'} />

                        {articleBlockRenderer('bottom', MegaWheelArticles(contextCountry, 'bottom'))}

                        {SPAM_BONUSES && <BonusesBackdrop bonuses={_bonuses} />}
                    </MainColumnScroll>
                </BodyContainer>
            </NavbarProvider>
        </Fragment>
    )
}

// helper function to merge exsisting rows with the update from the Socket
export const mergeWithUpdate = (current: MegaWheelSpin[], update: MegaWheelSpin[]) => {
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
    // const pageData = await axios.get('https://sbcandyland.topadsservices.com/api/data-in-the-last-hours/24')

    const pageData = await axios.get('https://megaball.topadsservices.com/api/data-in-the-last-hours/24')

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
        'King Casino': 'https://spikestats.kingcasino.it/',
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

const MegaWheelArticles = (country: string, type: 'top' | 'bottom' | 'title' | 'desc') => {
    const text = {
        it: {
            title: 'Diretta Estrazioni | Mega Wheel | SPIKE Slot',
            desc: 'Estrazioni in diretta, game show di Pragmatic Play. Controlla i dettagli di tutte le estrazioni. Crea con facilità una strategia unica per gestire il tuo Budget.🎡🎲',
            top: `## Statistiche delle Estrazioni in Tempo Reale Mega Wheel

Questa pagina è dedicata alle informazioni principali relative alle estrazioni in tempo reale del gioco Live di Pragmatic Play: Mega Wheel.<br>
Spikeslot.com è il primo sito al mondo in cui poter verificare le statistiche live di Mega Wheel.<br><br>

Prima di considerare nello specifico tali dati, è fondamentale sottolineare che il gioco da casinò in generale porta a perdere a lungo andare, e che pertanto bisogna giocare sempre responsabilmente e con moderazione.<br>Anche Mega Wheel non fa eccezione avendo un **RTP del 96,51%**.<br>
In aggiunta, il gioco da casinò è vietato ai minori di diciotto anni.<br><br>

Attraverso questa guida, avrai la possibilità di comprendere al meglio il funzionamento del gioco, e di **verificare la frequenza dell’estrazione dei singoli numeri di Mega Wheel**.<br>In questo modo, avrai anche la possibilità di definire una strategia consapevole e prudente.`,
            bottom: `<br>

## Controlla gli ultimi numeri estratti al gioco Live Mega Wheel

Mega Wheel è un gioco Live che viene condotto in diretta dagli studi di Pragmatic Play, per garantire agli appassionati un’esperienza di gioco dinamica, interattiva e sempre moderata.<br><br>

Gli utenti si ritrovano infatti all’interno di un vero e proprio show, caratterizzato dalla presenza di una ruota colorata composta da cinquantaquattro segmenti, a ciascuno dei quali viene associato un premio differente.<br>La ruota è girata direttamente dal croupier presente all’interno dello studio, e il compito principale dei giocatori è quello di riuscire ad indovinare il numero esatto su cui si fermerà la ruota di Mega Wheel.<br><br>

Tuttavia, durante il gioco si alternano anche svariate funzioni speciali, come ad esempio Mega Lucky Number, che rappresenta un numero casuale selezionato prima di ogni giro e che può contribuire ad incrementare l’eventuale vincita potenziale.<br><br>

Avere quindi la possibilità di consultare gli **ultimi numeri estratti**, può rappresentare forse una comodità per gli appassionati che intendono effettuare una sessione di gioco a Mega Wheel, in quanto **si può definire una propria strategia e nel contempo si ha un’idea più consapevole e approfondita** sui valori che vengono estratti in maniera più frequente.<br><br>

Per essere più precisi, in alto a destra dello schermo di gioco, l’utente ha la possibilità di selezionare l’arco temporale durante cui intende visualizzare le statistiche.<br>Ogni numero presenta una serie di informazioni relative alla sua probabilità di uscita, e nel contempo alla sua ultima estrazione nell’arco temporale considerato.<br>In questo modo, si ha la possibilità di essere sempre **aggiornati in tempo reale sul gioco Live Mega Wheel**.<br><br>

In aggiunta, è anche possibile visualizzare il numero di volte in cui un singolo numero è stato estratto nel corso della giornata, e successivamente consultare una tabella posizionata nella parte bassa dello schermo, per visionare il risultato di ogni singolo spin.<br><br>

Ricordiamo però ancora una volta l’importanza del gioco responsabile e consapevole, in quanto questo gioco Live è stato creato per far perdere i giocatori con il passare del tempo, e per questo non bisogna mai perdere il controllo.<br><br>


## Quali sono i vantaggi o gli svantaggi che derivano dalla possibilità di consultare le statistiche di Mega Wheel in tempo reale?

I giocatori hanno la possibilità di paragonare le probabilità teoriche di uscita dei vari segmenti della ruota con la realtà, avendo quindi una conoscenza più approfondita del **gioco Live** considerato.<br>Generalmente infatti, i provider di giochi digitali dichiarano un valore approssimativo dell’uscita di un determinato numero, e per questo è già chiaro che nel corso della partita i valori dei numeri ruoteranno attorno a determinate probabilità.<br><br>

Tuttavia, possono esserci sempre dei colpi di scena durante una sessione di gioco, poiché la fortuna gioca un ruolo fondamentale.<br>Per questa ragione, le **statistiche** fornite in questa pagina web di spikeslot.com, possono essere molto utili per definire una strategia valida e prudente.<br><br>

Per esempio, nel caso in cui un segmento non venga estratto per un notevole numero di giri, si potrebbe pensare di puntare proprio su quel determinato valore, tenendo in considerazione però che non ci sono garanzie che venga recuperato il **Budget** investito inizialmente dai singoli utenti.<br><br>

Per questo, bisogna riconoscere ancora una volta quanto sia importante giocare con prudenza, al fine di vivere al meglio la sessione di gioco e di non essere protagonisti di situazioni spiacevoli, come quella della dipendenza patologica.<br><br>


## Intrattenimento responsabile con le statistiche di Mega Wheel

**Le statistiche di Mega Wheel sono sempre disponibili sul sito di SPIKE Slot, e sono accessibili in qualsiasi momento in maniera totalmente gratuita**, al fine di permettere agli utenti di avere un’idea chiara della situazione.<br><br>

Avere la possibilità di seguire l’andamento della sessione di gioco in tempo reale, può essere molto utile per comprendere al meglio il funzionamento di Mega Wheel, e nel contempo per decidere di effettuare una puntata piuttosto che un’altra.<br>Maggiori informazioni sulle tipologie di strategie che si possono scegliere sono disponibili nella nostra guida Mega Wheel.<br><br>

A lungo termine il gioco porterà ad una perdita di credito, come è già possibile notare consultando il valore del Ritorno al Giocatore o RTP di Mega Wheel; tale valore teorico infatti corrisponde a 96.51%.<br><br>

![Statistiche Live Mega Wheel Casino](https://spike-images.s3.eu-central-1.amazonaws.com/live-stats-mega-wheel_738b160bf9.jpeg)

<br>

Non dimenticare che il gioco da casinò è soltanto semplice e puro divertimento, e non deve mai trasformarsi in una dipendenza.<br><br><br>


Ultimo aggiornamento: **30 Maggio 2022**`,
        },
        row: {
            title: 'Live Drawings | Mega Wheel | SPIKE Slot',
            desc: 'Live draws, Pragmatic Play game show. Check all the draws details. Easily create a unique strategy to manage your budget.🎡🎲',
            top: `## Real-Time Mega Wheel Drawing Statistics

This page is mainly dedicated to information relating to the Pragmatic Play Live Game: Mega Wheel Live Draw. <br>
Spikeslot.com is the first world site where you can check Mega Wheel's live stats. <br><br>

Before considering specifically such data, it is essential to underline that casino gambling in general leads to a loss in the long run, and therefore you must always play responsibly and with moderation.<br>
Mega Wheel makes no exception having a **96.51% RTP** value. <br>
In addition, casino gambling is prohibited in some jurisdictions where there are no laws regulating it.<br><br>

Through this guide, you will have the opportunity to better understand how the game works, and to **check the drawing frequency of individual Mega Wheel numbers**. <br>
In this way, you will also have the possibility to define a satisfying strategy.`,
            bottom: `<br>

## Check out the latest numbers drawn in the Live Mega Wheel game

Mega Wheel is a Live game conducted by Pragmatic Play studios, to guarantee fans a dynamic, interactive and fun gaming experience. <br><br>

In fact, users find themselves inside a real show, characterized by the presence of a colored wheel made up of 54 segments, each of which is associated with a different prize. <br>
The wheel is turned directly by the croupier present  inside the studio, and the main task of the players is to guess the exact number on which the wheel of Mega Wheel will stop.<br><br>

However, various special functions also alternate during the game, such as Mega Lucky Number, which represents a random number selected before each spin and which can help increase any potential winnings. <br><br>

Therefore, having the possibility to consult the **latest drawn numbers**, can represent a convenience for fans who intend to carry out a game session at Mega Wheel, as **you can define your own strategy and at the same time you have a cleare idea** about the values ​​that most frequently come out.<br><br>

To be more precise, at the game screen top right, the user has the possibility to select the time span during which he intends to view the statistics. <br>
Each number presents a series of information relating to its drawing probability and last extractions in the considered time frame. <br>
In this way, you are always **updated in real time on the Live Mega Wheel game**. <br><br>

In addition, it is also possible to view the number of times a single number has been drawn during the day, and subsequently consult a table located at the bottom of the screen, to view each single spin result. <br><br>

However, we remind you once again the importance of responsible and conscious gaming, as you must never lose control in this Live game.<br><br>


## What are advantages of consulting real time Mega Wheel stats?

Players have the opportunity to compare the theoretical drawing odds of the wheel various segments with reality, thus having a deeper knowledge of the considered **Live game**. <br>
Generally, digital game providers declare an average value for a certain number drawing chance, and for this reason it is already known that in the course of the game the number values will revolve around certain probabilities. <br><br>

However, there can always be twists and turns during a game session, as luck plays a huge role. <br>
For this reason, the **statistics** provided on this spikeslot.com webpage can be very useful to define a valid strategy. <br><br>

For example, in the event that a sector is not drawn for a considerable spin numbers, one could think of betting on that particular value. In this way, hopefully, the session can be optimized and the odds of recovering the Budget are increased.<br><br>


## Awesome entertainment with Mega Wheel stats

**Mega Wheel statistics are always available on the SPIKE Slot website, and they are accessible at any time for free from any device**. In this way all the users will have a clear idea about the current situation in the Live game session. <br><br>

Following the progress of the game session in real time can be very useful to better understand how Mega Wheel works, and at the same time to decide about placing a bet rather than another. <br>
More information among the types of strategies you can choose is available in our [Mega Wheel guide](/articoli/mega-wheel-live-guide/row). <br><br>

The Mega Wheel Return to Player (or RTP) value corresponds to **96.51%**. <br><br>

![Live Statistics Mega Wheel Real Time Casino](https://spike-images.s3.eu-central-1.amazonaws.com/live-statistics-mega-wheel_e43c522bb2.jpeg)

<br>

Always be gamble aware and play responsibly.<br><br><br>
`,
        },
        ca: {
            title: 'Live Drawings | Mega Wheel | SPIKE Slot',
            desc: 'Live draws, Pragmatic Play game show. Check all the draws details. Easily create a unique strategy to manage your budget.🎡🎲',
            top: `## Real-Time Mega Wheel Drawing Statistics for All CA Users

This page is mainly dedicated to information relating to the Pragmatic Play Live Game: Mega Wheel Live Draw. <br>
Spikeslot.com is the first world site where you can check Mega Wheel's live stats. <br><br>

Before considering specifically such data, it is essential to underline that casino gambling in general leads to a loss in the long run, and therefore you must always play responsibly and with moderation.<br>
Mega Wheel makes no exception having a **96.51% RTP** value. <br>
In addition, casino gambling is prohibited in some jurisdictions where there are no laws regulating it.<br><br>

Through this guide, you will have the opportunity to better understand how the game works, and to **check the drawing frequency of individual Mega Wheel numbers**. <br>
In this way, you will also have the possibility to define a satisfying strategy.`,
            bottom: `<br>

## Check out the latest numbers drawn in the Live Mega Wheel game

Mega Wheel is a Live game conducted by Pragmatic Play studios, to guarantee fans a dynamic, interactive and fun gaming experience. <br><br>

In fact, users find themselves inside a real show, characterized by the presence of a colored wheel made up of 54 segments, each of which is associated with a different prize. <br>
The wheel is turned directly by the croupier present  inside the studio, and the main task of the players is to guess the exact number on which the wheel of Mega Wheel will stop.<br><br>

However, various special functions also alternate during the game, such as Mega Lucky Number, which represents a random number selected before each spin and which can help increase any potential winnings. <br><br>

Therefore, having the possibility to consult the **latest drawn numbers**, can represent a convenience for fans who intend to carry out a game session at Mega Wheel, as **you can define your own strategy and at the same time you have a cleare idea** about the values ​​that most frequently come out.<br><br>

To be more precise, at the game screen top right, the user has the possibility to select the time span during which he intends to view the statistics. <br>
Each number presents a series of information relating to its drawing probability and last extractions in the considered time frame. <br>
In this way, you are always **updated in real time on the Live Mega Wheel game**. <br><br>

In addition, it is also possible to view the number of times a single number has been drawn during the day, and subsequently consult a table located at the bottom of the screen, to view each single spin result. <br><br>

However, we remind you once again the importance of responsible and conscious gaming, as you must never lose control in this Live game.<br><br>


## What are advantages of consulting real time Mega Wheel stats?

Canadian players have the opportunity to compare the theoretical drawing odds of the wheel various segments with reality, thus having a deeper knowledge of the considered **Live game**. <br>
Generally, digital game providers declare an average value for a certain number drawing chance, and for this reason it is already known that in the course of the game the number values will revolve around certain probabilities. <br><br>

However, there can always be twists and turns during a game session, as luck plays a huge role. <br>
For this reason, the **statistics** provided on this spikeslot.com webpage can be very useful to define a valid strategy. <br><br>

For example, in the event that a sector is not drawn for a considerable spin numbers, one could think of betting on that particular value. In this way, hopefully, the session can be optimized and the odds of recovering the Budget are increased.<br><br>


## Awesome entertainment with Mega Wheel stats

**Mega Wheel statistics are always available on the SPIKE Slot website, and they are accessible at any time for free from any device**. In this way all the users will have a clear idea about the current situation in the Live game session. <br><br>

Following the progress of the game session in real time can be very useful to better understand how Mega Wheel works, and at the same time to decide about placing a bet rather than another. <br>
More information among the types of strategies you can choose is available in our [Mega Wheel guide](/articoli/mega-wheel-live-guide/ca). <br><br>

The Mega Wheel Return to Player (or RTP) value corresponds to **96.51%**. <br><br>

![Live Statistics Mega Wheel Real Time Casino](https://spike-images.s3.eu-central-1.amazonaws.com/live-statistics-mega-wheel_e43c522bb2.jpeg)

<br>

Always be gamble aware and play responsibly.<br><br><br>

`,
        },
        gb: {
            title: 'Live Drawings | Mega Wheel | SPIKE Slot',
            desc: 'Live draws, Pragmatic Play game show. Check all the draws details. Easily create a unique strategy to manage your budget.🎡🎲',
            top: `## Real-Time Mega Wheel Drawing Statistics for All UK Users

This page is mainly dedicated to information relating to the Pragmatic Play Live Game: Mega Wheel Live Draw. <br>
Spikeslot.com is the first world site where you can check Mega Wheel's live stats. <br><br>

Before considering specifically such data, it is essential to underline that casino gambling in general leads to a loss in the long run, and therefore you must always play responsibly and with moderation.<br>
Mega Wheel makes no exception having a **96.51% RTP** value. <br>
In addition, casino gambling is prohibited in some jurisdictions where there are no laws regulating it.<br><br>

Through this guide, you will have the opportunity to better understand how the game works, and to **check the drawing frequency of individual Mega Wheel numbers**. <br>
In this way, you will also have the possibility to define a satisfying strategy.`,
            bottom: `<br>

## Check out the latest numbers drawn in the Live Mega Wheel game

Mega Wheel is a Live game conducted by Pragmatic Play studios, to guarantee fans a dynamic, interactive and fun gaming experience. <br><br>

In fact, users find themselves inside a real show, characterized by the presence of a colored wheel made up of 54 segments, each of which is associated with a different prize. <br>
The wheel is turned directly by the croupier present  inside the studio, and the main task of the players is to guess the exact number on which the wheel of Mega Wheel will stop.<br><br>

However, various special functions also alternate during the game, such as Mega Lucky Number, which represents a random number selected before each spin and which can help increase any potential winnings. <br><br>

Therefore, having the possibility to consult the **latest drawn numbers**, can represent a convenience for fans who intend to carry out a game session at Mega Wheel, as **you can define your own strategy and at the same time you have a cleare idea** about the values ​​that most frequently come out.<br><br>

To be more precise, at the game screen top right, the user has the possibility to select the time span during which he intends to view the statistics. <br>
Each number presents a series of information relating to its drawing probability and last extractions in the considered time frame. <br>
In this way, you are always **updated in real time on the Live Mega Wheel game**. <br><br>

In addition, it is also possible to view the number of times a single number has been drawn during the day, and subsequently consult a table located at the bottom of the screen, to view each single spin result. <br><br>

However, we remind you once again the importance of responsible and conscious gaming, as you must never lose control in this Live game.<br><br>


## What are advantages of consulting real time Mega Wheel stats?

New Zealander players have the opportunity to compare the theoretical drawing odds of the wheel various segments with reality, thus having a deeper knowledge of the considered **Live game**. <br>
Generally, digital game providers declare an average value for a certain number drawing chance, and for this reason it is already known that in the course of the game the number values will revolve around certain probabilities. <br><br>

However, there can always be twists and turns during a game session, as luck plays a huge role. <br>
For this reason, the **statistics** provided on this spikeslot.com webpage can be very useful to define a valid strategy. <br><br>

For example, in the event that a sector is not drawn for a considerable spin numbers, one could think of betting on that particular value. In this way, hopefully, the session can be optimized and the odds of recovering the Budget are increased.<br><br>


## Awesome entertainment with Mega Wheel stats

**Mega Wheel statistics are always available on the SPIKE Slot website, and they are accessible at any time for free from any device**. In this way all the users will have a clear idea about the current situation in the Live game session. <br><br>

Following the progress of the game session in real time can be very useful to better understand how Mega Wheel works, and at the same time to decide about placing a bet rather than another. <br>
More information among the types of strategies you can choose is available in our [Mega Wheel guide](/articoli/mega-wheel-live-guide/nz). <br><br>

The Mega Wheel Return to Player (or RTP) value corresponds to **96.51%**. <br><br>

![Live Statistics Mega Wheel Real Time Casino](https://spike-images.s3.eu-central-1.amazonaws.com/live-statistics-mega-wheel_e43c522bb2.jpeg)

<br>

Always be gamble aware and play responsibly.<br><br><br>

`,
        },
        nz: {
            title: 'Live Drawings | Mega Wheel | SPIKE Slot',
            desc: 'Live draws, Pragmatic Play game show. Check all the draws details. Easily create a unique strategy to manage your budget.🎡🎲',
            top: `## Real-Time Mega Wheel Drawing Statistics for All NZ Users

This page is mainly dedicated to information relating to the Pragmatic Play Live Game: Mega Wheel Live Draw. <br>
Spikeslot.com is the first world site where you can check Mega Wheel's live stats. <br><br>

Before considering specifically such data, it is essential to underline that casino gambling in general leads to a loss in the long run, and therefore you must always play responsibly and with moderation.<br>
Mega Wheel makes no exception having a **96.51% RTP** value. <br>
In addition, casino gambling is prohibited in some jurisdictions where there are no laws regulating it.<br><br>

Through this guide, you will have the opportunity to better understand how the game works, and to **check the drawing frequency of individual Mega Wheel numbers**. <br>
In this way, you will also have the possibility to define a satisfying strategy.`,
            bottom: `<br>

## Check out the latest numbers drawn in the Live Mega Wheel game

Mega Wheel is a Live game conducted by Pragmatic Play studios, to guarantee fans a dynamic, interactive and fun gaming experience. <br><br>

In fact, users find themselves inside a real show, characterized by the presence of a colored wheel made up of 54 segments, each of which is associated with a different prize. <br>
The wheel is turned directly by the croupier present  inside the studio, and the main task of the players is to guess the exact number on which the wheel of Mega Wheel will stop.<br><br>

However, various special functions also alternate during the game, such as Mega Lucky Number, which represents a random number selected before each spin and which can help increase any potential winnings. <br><br>

Therefore, having the possibility to consult the **latest drawn numbers**, can represent a convenience for fans who intend to carry out a game session at Mega Wheel, as **you can define your own strategy and at the same time you have a cleare idea** about the values ​​that most frequently come out.<br><br>

To be more precise, at the game screen top right, the user has the possibility to select the time span during which he intends to view the statistics. <br>
Each number presents a series of information relating to its drawing probability and last extractions in the considered time frame. <br>
In this way, you are always **updated in real time on the Live Mega Wheel game**. <br><br>

In addition, it is also possible to view the number of times a single number has been drawn during the day, and subsequently consult a table located at the bottom of the screen, to view each single spin result. <br><br>

However, we remind you once again the importance of responsible and conscious gaming, as you must never lose control in this Live game.<br><br>


## What are advantages of consulting real time Mega Wheel stats?

British players have the opportunity to compare the theoretical drawing odds of the wheel various segments with reality, thus having a deeper knowledge of the considered **Live game**. <br>
Generally, digital game providers declare an average value for a certain number drawing chance, and for this reason it is already known that in the course of the game the number values will revolve around certain probabilities. <br><br>

However, there can always be twists and turns during a game session, as luck plays a huge role. <br>
For this reason, the **statistics** provided on this spikeslot.com webpage can be very useful to define a valid strategy. <br><br>

For example, in the event that a sector is not drawn for a considerable spin numbers, one could think of betting on that particular value. In this way, hopefully, the session can be optimized and the odds of recovering the Budget are increased.<br><br>


## Awesome entertainment with Mega Wheel stats

**Mega Wheel statistics are always available on the SPIKE Slot website, and they are accessible at any time for free from any device**. In this way all the users will have a clear idea about the current situation in the Live game session. <br><br>

Following the progress of the game session in real time can be very useful to better understand how Mega Wheel works, and at the same time to decide about placing a bet rather than another. <br>
More information among the types of strategies you can choose is available in our Mega Wheel guide. <br><br>

The Mega Wheel Return to Player (or RTP) value corresponds to **96.51%**. <br><br>

![Live Statistics Mega Wheel Real Time Casino](https://spike-images.s3.eu-central-1.amazonaws.com/live-statistics-mega-wheel_e43c522bb2.jpeg)

<br>

Always be gamble aware and play responsibly.<br><br><br>

`,
        },
    }

    if (text[country]) return text[country][type]
    else return text['row'][type]
}
