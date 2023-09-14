import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from 'react'
import { Article, Bonus, BonusGuide } from '../../../graphql/schema'
import AquaClient from '../../../graphql/aquaClient'
import { BONUS_GUIDES_BY_COUNTRY } from '../../../graphql/queries/bonusguide'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'
import { HOME_BONUS_LIST } from '../../../graphql/queries/bonus'
import CustomBreadcrumbs from '../../../components/Breadcrumbs/CustomBreadcrumbs'
import styled from 'styled-components'
import BonusGuideCard from '../../../components/Cards/BonusGuideCard'
import Head from 'next/head'
import { ARTICLES_BY_COUNTRY } from '../../../graphql/queries/article'
import ArticleCard from './../../../components/Cards/ArticleCard'
import { tablet } from '../../../components/Responsive/Breakpoints'
import { useRouter } from 'next/router'
import {
    getBGuidePageRedirectUrlForCountry,
    getCanonicalPath,
    getUserCountryCode,
    injectCDN,
    serverSide404,
} from '../../../utils/Utils'
import { LocaleContext } from './../../../context/LocaleContext'
import CountryEquivalentPageSnackbar from '../../../components/Snackbars/CountryEquivalentPageSnackbar'
import ReactMarkdown from 'react-markdown'
import MarkdownProvider from '../../../components/Markdown/MarkdownProvider'

interface Props {
    _initialGuides: BonusGuide[]
    _articles: Article[]
    _bonusList: Bonus[]
    _requestedCountryCode: string
}

const GuidesList: FunctionComponent<Props> = ({ _initialGuides, _bonusList, _articles, _requestedCountryCode }) => {
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const { t, userCountry, setUserCountry, contextCountry, setContextCountry } = useContext(LocaleContext)
    useEffect(() => {
        console.log(contextCountry)
    }, [contextCountry])

    const [loading, setLoading] = useState(true)

    const [initialGuides, setInitialGuides] = useState<BonusGuide[]>(_initialGuides)
    const [articles, setArticles] = useState<Article[]>(_articles)
    const [bonusList, setBonusList] = useState<Bonus[]>(_bonusList)
    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)

    console.log(initialGuides)

    useEffect(() => {
        getCountryData()
    }, [])

    const getCountryData = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

        if (geoLocatedCountryCode !== _requestedCountryCode) {
            const initialGuidesResponse = await aquaClient.query({
                query: BONUS_GUIDES_BY_COUNTRY,
                variables: {
                    countryCode: geoLocatedCountryCode,
                },
            })

            if (initialGuidesResponse.data.data.bonusGuides.length > 0) {
                setUserCountryEquivalentExists(true)
            }
            setUserCountry(geoLocatedCountryCode)
        }
        setContextCountry(_requestedCountryCode)
        setLoading(false)
    }

    return (
        <Fragment>
            <Head>
                <title>{t(`Bonus Guides and Slot Tricks |  SPIKE`)}</title>
                <link rel='canonical' href={getCanonicalPath()} />
                <meta
                    name='description'
                    content={`Non sai come sbloccare i bonus ? Stai cercando una guida che ti spieghi come ottenere le migliore offerte disponibili ? Sei nel posto giusto ! Qui troverai tutte le guide dei migliori Casinò Italiani con informazioni dettagliate su come sbloccarli ed usufruirne al meglio. Guarda la video spiegazione di SPIKE che ti guiderà passo per passo`}
                ></meta>
                <meta httpEquiv='content-language' content='it-IT'></meta>

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp='name' content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
                <meta
                    itemProp='description'
                    content={`Non sai come sbloccare i bonus ? Stai cercando una guida che ti spieghi come ottenere le migliore offerte disponibili ? Sei nel posto giusto ! Qui troverai tutte le guide dei migliori Casinò Italiani con informazioni dettagliate su come sbloccarli ed usufruirne al meglio. Guarda la video spiegazione di SPIKE che ti guiderà passo per passo`}
                />
                <meta itemProp='image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={t(`Bonus Guides and Slot Tricks |  SPIKE`)} />
                <meta
                    name='twitter:description'
                    content={`Non sai come sbloccare i bonus ? Stai cercando una guida che ti spieghi come ottenere le migliore offerte disponibili ? Sei nel posto giusto ! Qui troverai tutte le guide dei migliori Casinò Italiani con informazioni dettagliate su come sbloccarli ed usufruirne al meglio. Guarda la video spiegazione di SPIKE che ti guiderà passo per passo`}
                />
                <meta name='twitter:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property='og:locale' content={'it'} />
                <meta property='og:type' content='article' />
                <meta
                    property='og:description'
                    content={`Non sai come sbloccare i bonus ? Stai cercando una guida che ti spieghi come ottenere le migliore offerte disponibili ? Sei nel posto giusto ! Qui troverai tutte le guide dei migliori Casinò Italiani con informazioni dettagliate su come sbloccarli ed usufruirne al meglio. Guarda la video spiegazione di SPIKE che ti guiderà passo per passo`}
                />
                <meta property='og:site_name' content={t(`Bonus Guides and Slot Tricks |  SPIKE`)} />

                <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property='og:locale' content={'it'} />
                <meta property='og:type' content='article' />
                <meta
                    property='og:description'
                    content={`Non sai come sbloccare i bonus ? Stai cercando una guida che ti spieghi come ottenere le migliore offerte disponibili ? Sei nel posto giusto ! Qui troverai tutte le guide dei migliori Casinò Italiani con informazioni dettagliate su come sbloccarli ed usufruirne al meglio. Guarda la video spiegazione di SPIKE che ti guiderà passo per passo`}
                />
                <meta property='og:site_name' content={t(`Bonus Guides and Slot Tricks |  SPIKE`)} />
            </Head>

            <NavbarProvider currentPage='/guide-e-trucchi' countryCode={contextCountry}>
                {userCountryEquivalentExists && (
                    <CountryEquivalentPageSnackbar path={getBGuidePageRedirectUrlForCountry(userCountry)} />
                )}

                <StyleProvider>
                    <CustomBreadcrumbs style={{ margin: '1rem 0rem' }} from='guide-list' name='Guides and Tricks' />

                    <h1 style={{ marginTop: '3rem' }}>{t('Guides to the best bonuses of Italian casinos')}</h1>
                    <MarkdownProvider style={{ marginBottom: '2rem' }}>
                        <ReactMarkdown>
                            {`È possibile che tu non sappia cosa significhi sbloccare i bonus. Oppure stai cercando una guida che ti spieghi come valutare le migliore offerte disponibili negli operatori legali che offrono servizi certificati e sicuri. Sei nel posto giusto.

Qui troverai tutte le guide dei migliori Casinò italiani con informazioni dettagliate su come sbloccarli ed usufruirne al meglio. È possibile anche consultare le guide create per accompagnare le statistiche live, come le [Mega Wheel stats](/live-stats/mega-wheel/it) o le [Mega Roulette stats](/live-stats/mega-roulette/it).

Ricorda, comunque, che illustriamo solo strategie che esplorano diverse possibilità di sblocco dei bonus, ma potrebbero non funzionare in quanto è sempre la fortuna a farla da padrone.

**Gioca sempre responsabilmente** e leggi le opinioni di SPIKE nelle sue spiegazioni passo per passo.`}
                        </ReactMarkdown>
                    </MarkdownProvider>
                    <BonusGuideContainer>
                        {initialGuides
                            .filter(
                                (it) =>
                                    it.slug !== 'casino-betflag-bonus-benvenuto' &&
                                    it.slug !== 'bonus-benvenuto-casino-betway' &&
                                    it.slug !== 'recensione-william-hill-bonus' &&
                                    it.slug !== 'bonus-benvenuto-betfair-casino' &&
                                    it.slug !== 'guida-al-bonus-di-benvenuto-pokerstars',
                            )
                            .map((guide, index) => (
                                <BonusGuideCard key={`guide_${index}`} guide={guide} />
                            ))}
                    </BonusGuideContainer>

                    <h1 style={{ marginTop: '3rem' }}>{t('Online Slot, Slot Bar and VLT Cheats')}</h1>
                    <MarkdownProvider style={{ marginBottom: '2rem' }}>
                        <ReactMarkdown>
                            {`Tutta l'esperienza di SPIKE raccolta in articoli dettagliati che risponderanno a tutti i tuoi dubbi sull'esistenza o meno di trucchi nascosti alle slot più famose.
Scoprirai che attualmente non ci sono trucchi, sequenze o altre metodologie in grado di condizionare il risultato di una partita a una slot.`}
                        </ReactMarkdown>
                    </MarkdownProvider>
                    <ArticlesContainer>
                        {articles.map((article, index) => (
                            <ArticleCard key={`article_${index}`} article={article} />
                        ))}
                    </ArticlesContainer>
                </StyleProvider>
            </NavbarProvider>
        </Fragment>
    )
}

const ArticlesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    ${tablet} {
        justify-content: space-between;
    }
`

const StyleProvider = styled.div`
    padding: 1rem 1rem;

    h1 {
        font-family: ${(props) => props.theme.text.secondaryFont};
        font-size: 2rem;
        color: ${(props) => props.theme.colors.primary};
    }

    p {
        margin: 1rem 0rem;
    }

    strong {
        font-weight: bold;
    }
`

const BonusGuideContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    ${tablet} {
        justify-content: space-between;
    }
`

export async function getServerSideProps({ query, res }) {
    try {
        const aquaClient = new AquaClient()

        const countryCode = query.countryCode as string

        const initialGuidesResponse = await aquaClient.query({
            query: BONUS_GUIDES_BY_COUNTRY,
            variables: {
                countryCode: countryCode,
            },
        })

        const initialArticlesResponse = await aquaClient.query({
            query: ARTICLES_BY_COUNTRY,
            variables: {
                countryCode: countryCode,
            },
        })

        const bonusListResponse = await aquaClient.query({
            query: HOME_BONUS_LIST,
            variables: {
                countryCode: countryCode,
            },
        })

        return {
            props: {
                _initialGuides: initialGuidesResponse.data.data.bonusGuides,
                _articles: initialArticlesResponse.data.data.articles,
                _bonusList: bonusListResponse.data.data.homes[0]?.bonuses || null,
                _requestedCountryCode: 'it',
            },
        }
    } catch (error) {
        // console.log(error, "ERROR")
        serverSide404(res)
    }
}

export default GuidesList
