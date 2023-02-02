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
import MegaRouletteCard from '../../../../components/Cards/MegaRouletteCard'
import MegaRouletteCardZero from '../../../../components/Cards/MegaRouletteCardZero'
import MegaWheelCard from '../../../../components/Cards/MegaWheelCard'
import SweetBonanzaCandylandCard from '../../../../components/Cards/SweetBonanzaCandylandCard'
import { articleBlockRenderer } from '../../../../components/DynamicContent/DynamicContent'
import { BodyContainer, MainColumnScroll } from '../../../../components/Layout/Layout'
import { MegaRouletteTable } from '../../../../components/MegaRouletteStats/MegaRouletteTable'
import { MegaWheelTable } from '../../../../components/MegaWheelStats/MegaWheelTable'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import { OnlyDesktop, OnlyMobile } from '../../../../components/Responsive/Only'
import BonusesBackdrop from '../../../../components/Singles/BonusesBackdrop'
import StatsCta from '../../../../components/Singles/StatsCta'
import { SweetBonanzaTable } from '../../../../components/SweetBonanzaCandylandLiveStats/SweetBonanzaTimeTable'
import BlockingOverlay from '../../../../components/Ui/BlockingOverlay'
import { LocaleContext } from '../../../../context/LocaleContext'
import { MegaWheelStat, SweetBonanzaCandylandStat } from '../../../../data/models/CrazyTimeSymbolStat'
import { MegaRouletteSpin } from '../../../../data/models/MegaRouletteSpin'
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
        lastTenSpins: MegaRouletteSpin[]
        stats: any
    }
    _lastTenSpins: MegaRouletteSpin[]
    _bonuses: Bonus[]
    _pageContent: CrazyTimeArticle
    _countryCode: string
}

const SOCKET_ENDPOINT = 'https://megaroulette.topadsservices.com'

// const DATA_ENDPOINT = 'localhost:5000'

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

    const filterOptions = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36,
    ]

    const [selectedFilters, setSelectedFilters] = useState(filterOptions)
    useEffect(() => {
        setFilteredRows(rows.filter((r) => selectedFilters.includes(r.result)))
    }, [selectedFilters])

    // keeps track of rows in the table
    const [rows, setRows] = useState<MegaRouletteSpin[]>(_lastTenSpins)
    useEffect(() => {
        setFilteredRows(rows.filter((r) => selectedFilters.includes(r.result)))
        // console.log(filteredRows, 'fitlered rows')
    }, [rows])
    const [filteredRows, setFilteredRows] = useState<MegaRouletteSpin[]>(_lastTenSpins)
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
        const initializedSocket = io('https://megaroulette.topadsservices.com', {
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

    const seoTitle = 'Diretta Estrazioni | Mega Roulette | SPIKE Slot'
    const seoDescription =
        'Estrazioni in diretta, live casino di Pragmatic Play. Controlla i dettagli di tutte le estrazioni. Crea con facilità una strategia unica per gestire il tuo Budget.🎡🎲'

    const imageSocial = 'https://spike-images.s3.eu-central-1.amazonaws.com/mega_roulette_thumbnail.png'

    return (
        <Fragment>
            <NavbarProvider currentPage='Mega Roulette Stats' countryCode={contextCountry}>
                <Head>
                    <title>{seoTitle}</title>
                    <link rel='canonical' href={`https://spikeslot.com/live-stats/mega-roulette/${contextCountry}`} />
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
                    <BlockingOverlay redirectLink='/live-stats/mega-roulette/it' userCountry={userCountry} />

                    <MainColumnScroll
                        style={{ width: '100%', maxWidth: '90%', paddingBottom: '4rem', paddingTop: '2rem' }}
                    >
                        {articleBlockRenderer(
                            'top',
                            `## Statistiche delle Estrazioni in Tempo Reale Mega Roulette

In questa pagina hai la possibilità di trovare tutti i dati principali relativi alle estrazioni in tempo reale del gioco Live di Pragmatic Play: **Mega Roulette**.<br>Questa rappresenta una peculiarità del sito spikeslot.com, in quanto è il primo al mondo in cui gli appassionati hanno la possibilità di consultare le statistiche live di Mega Roulette.<br><br>

In ogni caso però, prima di fornire una spiegazione più dettagliata a riguardo, è fondamentale sottolineare l’importanza del gioco responsabile e consapevole, in quanto il gioco da casinò è stato creato per far perdere i giocatori a lungo andare.<br>Infatti, questa caratteristica si nota anche prendendo in considerazione il Return to Player di Mega Roulette, anche conosciuto con il nome di RTP, che si aggira intorno a **97.30%**.<br><br>

Grazie a questa semplice guida, avrai la possibilità di capire in maniera approfondita il funzionamento di Mega Roulette, e nel contempo di verificare in qualsiasi momento la frequenza dell’uscita dei singoli numeri di questo gioco Live.<br>In questo modo, risulterà anche più semplice definire una strategia valida e sempre consapevole.`
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
                                    <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{`Mega Roulette Stats`}</h1>
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
                            <div>
                                <OnlyDesktop>
                                    <div
                                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '545px',
                                                backgroundColor: 'green',
                                                borderRadius: '6px',
                                            }}
                                        >
                                            {[...stats].splice(0, 1).map((s) => (
                                                <MegaRouletteCardZero
                                                    key={`stats_${s.symbol}`}
                                                    stat={s}
                                                    totalSpinsConsidered={totalSpinsInTimeFrame}
                                                    timeFrame={timeFrame}
                                                />
                                            ))}
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {[...stats]
                                                    .splice(1, stats.length - 1)
                                                    .filter((it) => firstLineIndeces.includes(it.symbol))
                                                    .map((s) => (
                                                        <MegaRouletteCard
                                                            key={`stats_${s.symbol}`}
                                                            stat={s}
                                                            totalSpinsConsidered={totalSpinsInTimeFrame}
                                                            timeFrame={timeFrame}
                                                        />
                                                    ))}
                                            </div>

                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {[...stats]
                                                    .splice(1, stats.length - 1)
                                                    .filter((it) => secondLineIndeces.includes(it.symbol))
                                                    .map((s) => (
                                                        <MegaRouletteCard
                                                            key={`stats_${s.symbol}`}
                                                            stat={s}
                                                            totalSpinsConsidered={totalSpinsInTimeFrame}
                                                            timeFrame={timeFrame}
                                                        />
                                                    ))}
                                            </div>

                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {[...stats]
                                                    .splice(1, stats.length - 1)
                                                    .filter((it) => thirdLineIndeces.includes(it.symbol))
                                                    .map((s) => (
                                                        <MegaRouletteCard
                                                            key={`stats_${s.symbol}`}
                                                            stat={s}
                                                            totalSpinsConsidered={totalSpinsInTimeFrame}
                                                            timeFrame={timeFrame}
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </OnlyDesktop>

                                <OnlyMobile>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            gap: 4,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {[...stats].splice(1, stats.length - 1).map((s) => (
                                            <MegaRouletteCard
                                                key={`stats_${s.symbol}`}
                                                stat={s}
                                                totalSpinsConsidered={totalSpinsInTimeFrame}
                                                timeFrame={timeFrame}
                                            />
                                        ))}
                                        {[...stats].splice(0, 1).map((s) => (
                                            <MegaRouletteCardZero
                                                key={`stats_${s.symbol}`}
                                                stat={s}
                                                totalSpinsConsidered={totalSpinsInTimeFrame}
                                                timeFrame={timeFrame}
                                            />
                                        ))}
                                    </div>
                                </OnlyMobile>
                            </div>
                        )}

                        <h1
                            style={{
                                marginTop: '2rem',
                                color: 'crimson',
                                fontWeight: 'bold',
                                fontSize: '1.4rem',
                                textAlign: 'center',
                            }}
                        >{`Puoi giocare alla Mega Roulette QUI`}</h1>
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

                        {rows && <MegaRouletteTable rows={filteredRows} />}

                        <StatsCta exclude={'megaroulette'} />

                        {articleBlockRenderer(
                            'bottom',
                            `<br>

## Verifica quali sono gli ultimi numeri estratti al gioco Live Mega Roulette

Mega Roulette è un gioco Live che garantisce una maggiore interazione tra i partecipanti del gioco e il dealer, poiché viene condotto in diretta dagli studi di Pragmatic Play e i giocatori hanno sempre la possibilità di utilizzare una Live Chat per poter dialogare.<br><br>

Questo gioco Live rappresenta una versione piuttosto innovativa della tradizionale roulette francese, in quanto mantiene lo stesso formato ma aggiunge al gioco una serie di “**Mega Multiplier**”.<br>Infatti, prima di ogni giro un minimo di uno e un massimo di cinque moltiplicatori, vengono assegnati casualmente ai numeri presenti sulla roulette.<br><br>

Il giocatore ha quindi la possibilità di effettuare una serie di puntate differenti, che talvolta riguardano un singolo numero e altre volte invece riguardano le tradizionali combinazioni della roulette.<br>
Avere quindi sempre la possibilità di verificare quali sono gli ultimi numeri estratti al gioco Live Mega Roulette, può rappresentare un vantaggio, poiché **si può avere un’idea più chiara della situazione generale e della sessione di gioco**.<br><br>

Infatti, in questo modo si può definire una strategia prendendo in considerazione i valori che vengono estratti in maniera più frequente, ricordando sempre di giocare con consapevolezza e moderazione.<br><br>

Per visualizzare le statistiche, gli utenti possono selezionare nella parte alta dello schermo del sito spikeslot.com l’arco temporale che intendono prendere in considerazione.<br>È importante a questo punto considerare ogni numero, poiché ognuno di essi presenta una serie di informazioni relative alla sua probabilità di estrazione e anche alla sua ultima uscita nel corso dell’arco temporale considerato.<br><br>

Questo permette ai giocatori di essere aggiornati in tempo reale sul gioco Live Mega Roulette.<br>
Inoltre, nella parte inferiore dello schermo di gioco, è presente anche una tabella che contiene le informazioni relative al numero di volte in cui un determinato numero è stato estratto durante l’intera giornata ed anche al risultato di ogni singolo round.<br><br>

Va sottolineata ancora una volta però l’importanza del gioco prudente, in quanto bisogna svolgere le sessioni di gioco nel massimo della consapevolezza e senza mai perdere il controllo.<br><br>


## Quali sono i pro e i contro generati dalla possibilità di visualizzare le statistiche di Mega Roulette in tempo reale?

Grazie alla possibilità di visualizzare le statistiche di Mega Roulette in tempo reale, **i giocatori riescono ad approfondire la loro conoscenza di questo gioco Live e a comparare la probabilità teorica di uscita dei singoli numeri con la realtà**.<br>
In linea generale, infatti, le varie Software Houses dichiarano un valore approssimativo dell’estrazione di un determinato numero, e pertanto è già noto che durante la sessione di gioco i valori dei singoli numeri ruoteranno intorno a probabilità ben precise.<br><br>

Tuttavia, l’esperienza di gioco può presentare sempre colpi di scena e sorprese inaspettate, e pertanto le statistiche fornite nella pagina web spikeslot.com possono risultare molto utili per definire una strategia piuttosto valida, ma sempre moderata.<br><br>

Ad esempio, nel caso in cui un determinato numero non venga estratto per un lungo periodo di tempo, si potrebbe pensare di puntare su di esso.<br>In ogni caso però, non ci sono garanzie relative ad una vincita e non è detto che il giocatore riuscirà a recuperare il **Budget** iniziale.<br>
Pertanto, giocare consapevolmente e con moderazione può aiutare a vivere una sessione di gioco piacevole e sicura.<br><br>


## Intrattenimento responsabile con le statistiche di Mega Roulette

Gli utenti hanno la possibilità di consultare le **statistiche di Mega Roulette sul sito di SPIKE Slot** in qualsiasi momento della giornata e in maniera totalmente gratuita.<br>
Seguire il gioco Live in tempo reale può essere utile per definire una strategia ben precisa, e soprattutto per comprendere l’andamento di Mega Roulette in quel determinato momento.<br>
È possibile consultare la [guida Mega Roulette](/articoli/guida-mega-roulette-live-pragmatic-play/it) per informazioni dettagliate sui meccanismi del gioco.<br><br>

![Mega Roulette Live Stats Pragmatic Play](https://spike-images.s3.eu-central-1.amazonaws.com/live-stats-mega-roulette_8f450cbe54.jpeg)

<br>

Non dimenticare che il gioco può causare dipendenza patologica, è vietato ai minori di diciotto anni, e a lungo andare genera una perdita, come si può già notare dal valore RTP di Mega Roulette che corrisponde a circa 97.30%.<br>
Il gioco da casinò deve essere infatti soltanto puro e semplice divertimento.<br><br><br>


Ultimo aggiornamento: **6 Giugno 2022**`
                        )}

                        {SPAM_BONUSES && <BonusesBackdrop bonuses={_bonuses} />}
                    </MainColumnScroll>
                </BodyContainer>
            </NavbarProvider>
        </Fragment>
    )
}

export const firstLineIndeces = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]
export const secondLineIndeces = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35]
export const thirdLineIndeces = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]

// helper function to merge exsisting rows with the update from the Socket
export const mergeWithUpdate = (current: MegaRouletteSpin[], update: MegaRouletteSpin[]) => {
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
    const pageData = await axios.get('https://megaroulette.topadsservices.com/api/data-in-the-last-hours/24')

    // const pageData = await axios.get(`http://localhost:5000/api/data-in-the-last-hours/24`)

    // console.log(pageData.data)

    // const pageContent = await aquaClient.query({
    //     query: PAGE_ARTICLE_QUERY,
    //     variables: {
    //         countryCode: countryCode,
    //     },
    // })

    console.log(pageData)

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
        LeoVegas: 'https://ntrfr.leovegas.com/redirect.aspx?pid=3704489&lpid=1757&bid=19140',
        '888 Casino': 'https://ic.aff-handler.com/c/43431?sr=1868828',
        StarCasinò: 'https://record.starcasino.it/_SEA3QA6bJTNXl890vMAfUGNd7ZgqdRLk/131/',
        Unibet: 'https://b1.trickyrock.com/redirect.aspx?pid=70955130&bid=21251',
        'William Hill':
            'https://campaigns.williamhill.it/C.ashx?btag=a_200887b_834c_&affid=1742025&siteid=200887&adid=834&c=',
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
