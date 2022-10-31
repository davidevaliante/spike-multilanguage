import React, { useEffect, useState, useContext, FunctionComponent } from 'react'
import AquaClient from '../../../graphql/aquaClient'
import { PAGINATED_SLOTS } from '../../../graphql/queries/slots'
import { AlgoliaSearchResult, Producer, VltSlotListPage } from '../../../graphql/schema'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn, RightColumn } from '../../../components/Layout/Layout'
import CustomBreadcrumbs from '../../../components/Breadcrumbs/CustomBreadcrumbs'
import styled from 'styled-components'
import { SLOT_LIST_ARTICLE_BY_COUNTRY } from '../../../graphql/queries/slotList'
import {
    getCanonicalPath,
    getUserCountryCode,
    injectCDN,
    isShallow,
    serverSideRedirect,
    somethingIsUndefined,
} from '../../../utils/Utils'
import { SearchIndex } from 'algoliasearch'
import delay from 'lodash/delay'
import { PRODUCERS_BY_COUNTRY_DROPDOWN } from '../../../graphql/queries/producers'
import ApolloBonusCardRevealComponent from '../../../components/Cards/BonusCardReveal'
import { HOME_BONUS_LIST } from '../../../graphql/queries/bonus'
import { ApolloBonusCardReveal } from '../../../data/models/Bonus'
import SlotListOrdering from '../../../components/Singles/SlotListOrdering'
import { laptop } from '../../../components/Responsive/Breakpoints'
import { ApolloSlotCard } from '../../../data/models/Slot'
import { useRouter } from 'next/router'
import SlotList from '../../../components/Lists/SlotList'
import ArticleToMarkdown from '../../../components/Markdown/ArticleToMarkdown'
import Head from 'next/head'
import { VLT_SLOT_LIST_BY_COUNTRY } from '../../../graphql/queries/vltslotlist'
import LazyLoad from 'react-lazyload'
import { appTheme } from './../../../theme/theme'
import SlideShow from '../../../components/SlideShow/SlideShow'
import orderBy from 'lodash/orderBy'
import { LocaleContext } from '../../../context/LocaleContext'
import FullPageLoader from '../../../components/Layout/FullPageLoader'
import CountryEquivalentPageSnackbar from '../../../components/Snackbars/CountryEquivalentPageSnackbar'
import ProducersList, {
    MainFiltersContainer,
    OptionalFiltersContainer,
    MoreFiltersWrapper,
    MoreFiltersList,
    MoreFiltersButton,
} from '../../../components/Lists/ProducersList'
import CategoriesList from '../../../components/Lists/CategoriesList'

interface Props {
    _shallow: boolean
    _initialSlots: AlgoliaSearchResult[]
    _requestedCountryCode: string
    _slotListArticles: SlotListArticles
    _bonusList: { bonus: ApolloBonusCardReveal }[]
    _highlightSlot: ApolloSlotCard
    _vltSlotListPage: VltSlotListPage
    _producersQuery: any
}

interface SlotListArticles {
    topArticle: string | undefined
    bottomArticle: string | undefined
}

const automaticRedirect = false

const Slots: FunctionComponent<Props> = ({
    _shallow,
    _initialSlots,
    _bonusList,
    _requestedCountryCode,
    _slotListArticles,
    _highlightSlot,
    _producersQuery,
    _vltSlotListPage,
}) => {
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const {
        t,
        appCountry: contextCountry,
        setAppCountry: setContextCountry,
        userCountry,
        setUserCountry,
    } = useContext(LocaleContext)

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [initialSlots, setInitialSlots] = useState<AlgoliaSearchResult[]>(_initialSlots)
    const [bonusList, setBonusList] = useState<{ bonus: ApolloBonusCardReveal }[]>(_bonusList)
    const [slotListArticles, setSlotListArticles] = useState<SlotListArticles>(_slotListArticles)
    const [highlightSlot, setHighlightSlot] = useState<ApolloSlotCard>(_highlightSlot)
    const [producersQuery, setProducersQuery] = useState(_producersQuery)
    const [vltSlotListPage, setVltSlotListPage] = useState<VltSlotListPage>(_vltSlotListPage)

    console.log(vltSlotListPage)

    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)

    useEffect(() => {
        if (_shallow) {
            setContextCountry(_requestedCountryCode)
            setLoading(false)
        } else getCountryData()
    }, [])

    const getCountryData = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        setUserCountry(geoLocatedCountryCode)

        if (geoLocatedCountryCode !== _requestedCountryCode) {
            const userCountrySlotListResponse = await aquaClient.query({
                query: PAGINATED_SLOTS,
                variables: {
                    countryCode: geoLocatedCountryCode,
                    sortingField: 'created_at:DESC',
                    start: 0,
                    limit: 50,
                    type: 'vlt',
                },
            })

            if (userCountrySlotListResponse.data.data.slots !== undefined) {
                if (automaticRedirect) {
                    router.push(`/slot-vlt/${geoLocatedCountryCode}`)
                    return
                } else setUserCountryEquivalentExists(true)
            }
            setContextCountry(_requestedCountryCode)
        }
        setLoading(false)
    }

    const [slotLength, setSlotLength] = useState(_initialSlots.length)
    const [slotList, setSlotList] = useState<AlgoliaSearchResult[] | undefined>(_initialSlots)

    // search
    const [algoliaIndex, setAlgoliaIndex] = useState<SearchIndex | undefined>(undefined)
    const [searchTimerId, setSearchTimerId] = useState<number | undefined>(undefined)
    const [showSearchHasNoResults, setShowSearchHasNoResults] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        if (searchValue.length !== 0) {
            if (algoliaIndex) algoliaSearch(searchValue)
        } else {
            clearTimeout(searchTimerId)
            setSearchResults(undefined)
            setSlotList(initialSlots)
        }
    }, [searchValue])

    const [searchResults, setSearchResults] = useState<AlgoliaSearchResult[] | undefined>(undefined)

    useEffect(() => {
        if (searchResults && searchResults.length > 0) {
            setSlotList(searchResults)
        } else {
            setShowSearchHasNoResults(true)
        }
    }, [searchResults])

    useEffect(() => {
        if (searchValue.length > 0 && searchResults?.length === 0) setShowSearchHasNoResults(true)
        else setShowSearchHasNoResults(false)
    }, [searchValue, searchResults])

    // ordinamento
    const [ordering, setOrdering] = useState<'date' | 'alphabetical' | 'rating'>('date')

    useEffect(() => {
        if (ordering === 'alphabetical') setSlotList(orderBy(initialSlots, ['name'], ['asc']))
        if (ordering === 'rating') setSlotList(orderBy(initialSlots, ['rating'], ['desc']))
        if (ordering === 'date') setSlotList(orderBy(initialSlots, ['created_at'], ['desc']))
    }, [ordering])

    // filtri
    const [showMoreFilter, setShowMoreFilter] = useState(false)
    const [categories, setCategories] = useState<any>(undefined)
    const [producers, setProducers] = useState<Producer[] | undefined>(undefined)

    useEffect(() => {
        if (categories === undefined || producers === undefined) getCategoriesAndProducers()
    }, [showMoreFilter])

    const [showProducers, setShowProducers] = useState(false)
    const [showCategories, setShowCategories] = useState(false)

    const loadNextOrderedBatch = async (ordering: 'date' | 'alphabetical' | 'rating') => {
        let orderingString: string = 'created_at:DESC'
        if (ordering === 'alphabetical') orderingString = 'name:ASC'
        if (ordering === 'rating') orderingString = 'rating:DESC'

        const response = await aquaClient.query({
            query: PAGINATED_SLOTS,
            variables: {
                countryCode: contextCountry,
                sortingField: orderingString,
                start: slotLength,
                limit: 12,
            },
        })

        setSlotList([...slotList!, ...(response.data.data.slots as AlgoliaSearchResult[])])
    }

    const getCategoriesAndProducers = () => {
        setProducers(producersQuery)

        // mock query
        const categories = ['#Egypt', '#Fantasy', '#Horror', t('#Film'), '#Animals', '#Classic', t('#Diamonds')]
        setCategories(categories)
    }

    const algoliaSearch = async (s: string) => {
        clearTimeout(searchTimerId)
        const newTimer = delay(async () => {
            const results = await algoliaIndex!.search(s, {
                filters: `(country:'${contextCountry}') AND type:slot`,
            })

            setSearchResults(
                results.hits.map((obj: any) => {
                    return {
                        name: obj.name,
                        type: obj.type,
                        slug: obj.slug,
                        country: obj.country,
                        image: {
                            url: obj.image,
                        },
                        bonuses: [{ link: obj.link }],
                        rating: obj.rating,
                        mainBonus: {
                            link: obj.link,
                        },
                    }
                })
            )
        }, 300)
        setSearchTimerId(newTimer)
    }

    const handleOrderChange = (newValue: 'date' | 'alphabetical' | 'rating') => {
        setOrdering(newValue)
    }

    const showProducersOrCategories = (value: 'categories' | 'producers') => {
        if (value === 'categories') {
            setShowCategories(true)
            setShowProducers(false)
        }

        if (value === 'producers') {
            setShowCategories(false)
            setShowProducers(true)
        }
    }

    return (
        <StyleProvider>
            <Head>
                <title>{vltSlotListPage?.seo?.seoTitle}</title>
                <meta name='description' content={vltSlotListPage?.seo?.seoDescription}></meta>
                <meta httpEquiv='content-language' content='it-IT'></meta>
                <link rel='canonical' href={getCanonicalPath()} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp='name' content={vltSlotListPage?.seo?.seoTitle} />
                <meta itemProp='description' content={vltSlotListPage?.seo?.seoDescription} />
                <meta itemProp='image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={vltSlotListPage?.seo?.seoTitle} />
                <meta name='twitter:description' content={vltSlotListPage?.seo?.seoDescription} />
                <meta name='twitter:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property='og:locale' content={'it'} />
                <meta property='og:type' content='article' />
                <meta property='og:description' content={vltSlotListPage?.seo?.seoDescription} />
                <meta property='og:site_name' content={vltSlotListPage?.seo?.seoTitle} />
            </Head>

            <NavbarProvider currentPage={`/slot-vlt-list`} countryCode={contextCountry}>
                <BodyContainer>
                    <MainColumn>
                        {/* {userCountryEquivalentExists && <CountryEquivalentPageSnackbar path={`/slot-vlt/${userCountry}`} />} */}

                        <CustomBreadcrumbs style={{ padding: '1rem .5rem' }} from='vlt-slot-list' />

                        <ArticleToMarkdown
                            style={{ padding: '0rem 1rem' }}
                            content={injectCDN(vltSlotListPage?.topArticle!)}
                        />

                        {vltSlotListPage?.sliderSlots && (
                            <LazyLoad height={450} once offset={100}>
                                <SlideShow
                                    apolloSlotCards={vltSlotListPage?.sliderSlots}
                                    title='The funniest VLT Slots'
                                    icon='/icons/slot_vlt_icon.svg'
                                    buttonText='    '
                                    buttonRoute={`/slots/[countryCode]`}
                                    buttonRouteAs={`/slots/${contextCountry}`}
                                    style={{ marginTop: '2rem' }}
                                    mainColor={appTheme.colors.terziary}
                                    secondaryColor={appTheme.colors.terziary}
                                />
                            </LazyLoad>
                        )}

                        <FiltersContainer>
                            <MainFiltersContainer>
                                <SlotListOrdering
                                    style={{ margin: '2rem auto' }}
                                    onOrderChange={handleOrderChange}
                                    ordering={ordering}
                                />
                            </MainFiltersContainer>

                            {/* <OptionalFiltersContainer>
                                <MoreFiltersWrapper isOpen={showMoreFilter}>
                                    <MoreFiltersList>
                                        {showMoreFilter &&
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
                                                <h4
                                                    className={showProducers ? 'selected' : ''}
                                                    onClick={() => showProducersOrCategories('producers')}>
                                                    {t("Manufacturing house")}
                                                </h4>
                                                <h4
                                                    className={showCategories ? 'selected' : ''}
                                                    onClick={() => showProducersOrCategories('categories')}>
                                                    {t("Categories")}
                                                </h4>
                                            </div>}
                                            
                                        {showMoreFilter && <div>
                                            <ProducersList 
                                                showMoreFilter={showMoreFilter}
                                                showProducers={showProducers}
                                                producers={producers}/>

                                            <CategoriesList 
                                                categories={categories}
                                                showCategories={showCategories}
                                            />
                                        </div>}
                                    </MoreFiltersList>
                                </MoreFiltersWrapper>

                                <MoreFiltersButton onClick={() => setShowMoreFilter(!showMoreFilter)}>
                                    <h3>
                                        {!showMoreFilter ? t("Show more filters") : t("Show fewer filters")}
                                    </h3>
                                    <img src={!showMoreFilter ? '/icons/chevron_down_red.svg' : '/icons/chevron_up_red.svg'} />
                                </MoreFiltersButton>
                            </OptionalFiltersContainer> */}
                        </FiltersContainer>

                        <SlotList slotList={slotList} showSearchHasNoResults={showSearchHasNoResults} />
                        {/* <LoadMoreButton onLoadMore={() => loadNextOrderedBatch(ordering)} /> */}
                        {vltSlotListPage?.bottomArticle && (
                            <ArticleToMarkdown
                                style={{ padding: '0rem 1rem' }}
                                content={injectCDN(vltSlotListPage?.bottomArticle!)}
                            />
                        )}
                    </MainColumn>
                    <RightColumn>
                        <h1 className='bonus-header'>{t('The best welcome bonuses')}</h1>
                        <div style={{ top: '2rem' }} className='bonus-column-container'>
                            {bonusList &&
                                bonusList.map((bo) => (
                                    <ApolloBonusCardRevealComponent key={bo.bonus.name} bonus={bo.bonus} />
                                ))}
                        </div>
                    </RightColumn>
                </BodyContainer>
            </NavbarProvider>
        </StyleProvider>
    )
}

export async function getServerSideProps({ query, req, res }) {
    const shallow = req.query.shallow as boolean

    const country = query.countryCode as string
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const slotListResponse = await aquaClient.query({
        query: PAGINATED_SLOTS,
        variables: {
            countryCode: country,
            sortingField: 'created_at:DESC',
            start: 0,
            limit: 50,
            type: 'vlt',
        },
    })

    const vltSlotListResponse = await aquaClient.query({
        query: VLT_SLOT_LIST_BY_COUNTRY,
        variables: {
            countryCode: country,
        },
    })

    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: country,
        },
    })

    const slotListArticlesResponse = await aquaClient.query({
        query: SLOT_LIST_ARTICLE_BY_COUNTRY,
        variables: {
            countryCode: country,
        },
    })

    const producersQuery = await aquaClient.query({
        query: PRODUCERS_BY_COUNTRY_DROPDOWN,
        variables: {
            countryCode: country,
        },
    })

    const slotList = slotListResponse.data.data.slots
    const bonusList = bonusListResponse.data.data.homes[0]?.bonuses.bonus
    const slotListArticles = slotListArticlesResponse.data.data.slotListArticles[0]
    const vltSlotListPage = vltSlotListResponse.data.data.vltSlotLists[0]

    if (somethingIsUndefined([slotList, bonusList, slotListArticles, vltSlotListPage])) serverSideRedirect(res, '/')
    return {
        props: {
            _shallow: isShallow(country, shallow),
            _initialSlots: slotList,
            _slotListArticles: slotListArticles,
            _bonusList: bonusList,
            _requestedCountryCode: country,
            _vltSlotListPage: vltSlotListPage,
            _producersQuery: producersQuery.data.data.producers,
        },
    }
}

const StyleProvider = styled.div``

const FiltersContainer = styled.div``

export default Slots
