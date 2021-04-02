import React, { useEffect, useState, useContext, FunctionComponent } from 'react'
import AquaClient from '../../../graphql/aquaClient'
import { PAGINATED_SLOTS, HIGHLIGHT_SLOT } from '../../../graphql/queries/slots'
import { AlgoliaSearchResult, Producer } from '../../../graphql/schema'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn, RightColumn } from '../../../components/Layout/Layout'
import CustomBreadcrumbs from '../../../components/Breadcrumbs/CustomBreadcrumbs'
import styled from 'styled-components'
import { SLOT_LIST_ARTICLE_BY_COUNTRY } from '../../../graphql/queries/slotList'
import { buildContentLanguageString, getCanonicalPath, getUserCountryCode, injectCDN, isShallow, serverSideRedirect, somethingIsUndefined } from '../../../utils/Utils'
import { SearchIndex } from 'algoliasearch'
import SlotListSearchInput from '../../../components/Search/SlotListSearch'
import delay from 'lodash/delay'
import { PRODUCERS_BY_COUNTRY_DROPDOWN } from '../../../graphql/queries/producers'
import ApolloBonusCardRevealComponent from '../../../components/Cards/BonusCardReveal'
import { HOME_BONUS_LIST } from '../../../graphql/queries/bonus'
import { ApolloBonusCardReveal } from '../../../data/models/Bonus'
import SlotListOrdering from '../../../components/Singles/SlotListOrdering'
import { ApolloSlotCard } from '../../../data/models/Slot'
import SlotListHighlightSlot from '../../../components/Cards/SlotListHighlightSlot'
import {useRouter} from 'next/router'
import SlotList from '../../../components/Lists/SlotList'
import LoadMoreButton from '../../../components/Buttons/LoadMoreButton'
import ArticleToMarkdown from '../../../components/Markdown/ArticleToMarkdown'
import Head from 'next/head'
import usePrevious from '../../../hooks/usePrevious'
import FullPageLoader from '../../../components/Layout/FullPageLoader'
import { translateHeadString } from '../../../translations/TranslationsUtils'
import { LocaleContext } from '../../../context/LocaleContext'
import ProducersList, { OptionalFiltersContainer, MainFiltersContainer, MoreFiltersWrapper, MoreFiltersList, MoreFiltersButton } from '../../../components/Lists/ProducersList'
import CategoriesList from '../../../components/Lists/CategoriesList'
import CountryEquivalentPageSnackbar from '../../../components/Snackbars/CountryEquivalentPageSnackbar'

interface Props {
    _shallow : boolean
    _initialSlots: AlgoliaSearchResult[]
    _slotListArticles: SlotListArticles
    _bonusList: { bonus: ApolloBonusCardReveal }[]
    _highlightSlot: ApolloSlotCard
    _producersQuery:any
    _requestedCountryCode:string

}

interface SlotListArticles {
    topArticle: string | undefined,
    bottomArticle: string | undefined
}

const automaticRedirect = false

const Slots: FunctionComponent<Props> = ({ _shallow, _initialSlots, _bonusList, _slotListArticles, _highlightSlot, _producersQuery, _requestedCountryCode }) => {

    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    

    const {t, contextCountry, setContextCountry, userCountry, setUserCountry} = useContext(LocaleContext)

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [initialSlots, setInitialSlots] = useState<AlgoliaSearchResult[]>(_initialSlots)
    const [slotList, setSlotList] = useState<AlgoliaSearchResult[]>(_initialSlots)
    const [slotLength, setSlotLength] = useState(_initialSlots.length)
    const [bonusList, setBonusList] = useState<{ bonus: ApolloBonusCardReveal }[]>(_bonusList)
    const [slotListArticles, setSlotListArticles] = useState<SlotListArticles>(_slotListArticles)
    const [highlightSlot, setHighlightSlot] = useState<ApolloSlotCard>(_highlightSlot)
    const [producersQuery, setProducersQuery] = useState(_producersQuery)

    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)

    useEffect(() => {
        if(_shallow){
            setContextCountry(_requestedCountryCode)
            setLoading(false)
        }
        else getCountryData()
    }, [])

    const getCountryData = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        setUserCountry(geoLocatedCountryCode)

        if(geoLocatedCountryCode !== _requestedCountryCode){
            const userCountrySlotListRequest = await aquaClient.query({
                query: PAGINATED_SLOTS,
                variables: {
                    countryCode: geoLocatedCountryCode,
                    sortingField: "created_at:DESC",
                    start: 0,
                    limit: 12
                }
            })

            if(userCountrySlotListRequest.data.data.slots !== undefined){
                if(automaticRedirect){
                    router.push(`/slots/${geoLocatedCountryCode}`)
                    return
                }
                else setUserCountryEquivalentExists(true)
            }
            setContextCountry(_requestedCountryCode)           
        }
        setLoading(false)
    }

    useEffect(() => {
        setInitialSlots(_initialSlots)
        setSlotList(_initialSlots)
        setSlotLength(_initialSlots.length)
        setBonusList(_bonusList)
        setSlotListArticles(_slotListArticles)
        setHighlightSlot(_highlightSlot)
        setProducersQuery(_producersQuery)
        setContextCountry(_requestedCountryCode)
    }, [_requestedCountryCode])


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

    // slot ordering
    const [ordering, setOrdering] = useState<'date' | 'alphabetical' | 'rating'>('date')
    const prevOrdering = usePrevious(ordering)

    useEffect(() => {
        if (prevOrdering !== undefined && ordering !== prevOrdering) getInitalOrderedBatch(ordering)
    }, [ordering])

    // filters
    const [showMoreFilter, setShowMoreFilter] = useState(false)
    const [categories, setCategories] = useState<any>(undefined)
    const [producers, setProducers] = useState<Producer[] | undefined>(undefined)

    useEffect(() => {
        if (categories === undefined || producers === undefined) getCategoriesAndProducers()
    }, [showMoreFilter])

    const [showProducers, setShowProducers] = useState(false)
    const [showCategories, setShowCategories] = useState(false)

    const getInitalOrderedBatch = async (ordering: 'date' | 'alphabetical' | 'rating') => {
        let orderingString: string = "created_at:DESC"
        if (ordering === 'alphabetical') orderingString = "name:ASC"
        if (ordering === 'rating') orderingString = "rating:DESC"

        const slotListResponse = await aquaClient.query({
            query: PAGINATED_SLOTS,
            variables: {
                countryCode: contextCountry,
                sortingField: orderingString,
                start: 0,
                limit: 12
            }
        })
        setSearchResults(slotListResponse.data.data.slots)
    }

    const loadNextOrderedBatch = async (ordering: 'date' | 'alphabetical' | 'rating') => {

        let orderingString: string = "created_at:DESC"

        if (ordering === 'alphabetical') orderingString = "name:ASC"
        if (ordering === 'rating') orderingString = "rating:DESC"

        const response = await aquaClient.query({
            query: PAGINATED_SLOTS,
            variables: {
                countryCode: contextCountry,
                sortingField: orderingString,
                start: slotLength,
                limit: 12
            }
        })
        
        setSlotList([...slotList!, ...(response.data.data.slots as AlgoliaSearchResult[])])
    }

    const getCategoriesAndProducers =  () => {

        setProducers(producersQuery)
        // mock query
        const categories = [
            '#Egypt',
            '#Fantasy',
            '#Horror',
            t('#Film'),
            '#Animals',
            '#Classic',
            t('#Diamonds'),
        ]

        setCategories(categories)
    }


    const handleSearchChange = async (t: string) => {setContextCountry

        if (algoliaIndex === undefined) {
            import('algoliasearch').then(algoliasearch => {
            const client = algoliasearch.default('92GGCDET16', 'fcbd92dd892fe6dc9b67fce3bf44fa04');
                const index = client.initIndex('entities');
                setAlgoliaIndex(index)
            })
        }

        setSearchValue(t)
    }

    const algoliaSearch = async (s: string) => {

        clearTimeout(searchTimerId)

        const newTimer = delay(async () => {
            const results = await algoliaIndex!.search(s, {
                filters: `(country:'${contextCountry}') AND type:slot`
            })

            setSearchResults(results.hits.map((obj: any) => {
                return {
                    name: obj.name,
                    type: obj.type,
                    slug: obj.slug,
                    country: obj.country,
                    image: {
                        url: obj.image
                    },
                    bonuses: [{ link: obj.link }],
                    rating: obj.rating
                }
            }))
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

    if(loading) return <FullPageLoader />
    return (
        <StyleProvider>
            <Head>
                <title>{translateHeadString(contextCountry, 'Free Slot Machine - Play now without downloading |  SPIKE Slot')}</title>
                <meta
                    name="description"
                    content={translateHeadString(contextCountry,'On SPIKE Slot you will find free slots machines playable without money and without regitration. Play the free demos')}>
                </meta>
                <meta httpEquiv="content-language" content={buildContentLanguageString(contextCountry)}></meta>
                <link rel="canonical" href={getCanonicalPath()} />
                <meta property="og:image" content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property="og:locale" content={contextCountry} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content={translateHeadString(contextCountry,'On SPIKE Slot you will find free slots machines playable without money and without regitration. Play the free demos')} />
                <meta property="og:site_name" content={translateHeadString(contextCountry,'SPIKE Slot | The number 1 blog on Slot Machines and gambling" :"SPIKE Slot | The number 1 blog on Slot Machines and gambling')} />
            </Head>

            <NavbarProvider currentPage='/slot-list' countryCode={contextCountry}>
                <BodyContainer>
                    {userCountryEquivalentExists && <CountryEquivalentPageSnackbar path={`/slots/${userCountry}`} />}
                    <MainColumn>
                        <CustomBreadcrumbs
                            style={{ 
                                padding: '1rem .5rem' 
                            }}
                            from='slot-list' />

                        <ArticleToMarkdown 
                            style={{ 
                                padding: '0rem 1rem' 
                            }} 
                            content={injectCDN(slotListArticles?.topArticle!)} />

                        <SlotListHighlightSlot 
                            style={{ 
                                marginTop: '2rem', 
                                marginBottom: '2rem' 
                            }} 
                            slotData={highlightSlot} 
                            countryCode={contextCountry} />

                        <FiltersContainer>
                            <MainFiltersContainer>
                                <SlotListSearchInput
                                    countryCode={contextCountry}
                                    value={searchValue}
                                    searchResults={searchResults}
                                    onSearchChange={handleSearchChange} />

                                <SlotListOrdering
                                    onOrderChange={handleOrderChange}
                                    ordering={ordering} />
                            </MainFiltersContainer>

                            <OptionalFiltersContainer>
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
                            </OptionalFiltersContainer>
                        </FiltersContainer>

                        <SlotList slotList={slotList} showSearchHasNoResults={showSearchHasNoResults} />

                        <LoadMoreButton onLoadMore={() => loadNextOrderedBatch(ordering)} />

                        <ArticleToMarkdown style={{ padding: '0rem 1rem' }} content={injectCDN(slotListArticles?.bottomArticle!)} />

                    </MainColumn>


                    <RightColumn>
                        <h1 className='bonus-header'>{t("The best welcome bonuses")}</h1>
                        <div style={{ top: '2rem' }} className='bonus-column-container'>
                            {bonusList && bonusList.map(bo => <ApolloBonusCardRevealComponent key={bo.bonus.name} bonus={bo.bonus} />)}
                        </div>
                    </RightColumn>

                </BodyContainer>

            </NavbarProvider>
        </StyleProvider>
    )
}

export async function getServerSideProps({ query, req, res }) {

    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const country = query.countryCode as string

    const slotListResponse = await aquaClient.query({
        query: PAGINATED_SLOTS,
        variables: {
            countryCode: country,
            sortingField: "created_at:DESC",
            start: 0,
            limit: 12
        }
    })

     
    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: country
        }
    })

    const slotListArticlesResponse = await aquaClient.query({
        query: SLOT_LIST_ARTICLE_BY_COUNTRY,
        variables: {
            countryCode: country
        }
    })

    const highlightSlotResponse = await aquaClient.query({
        query: HIGHLIGHT_SLOT,
        variables: {}
    })

    const producersQuery = await aquaClient.query({
        query: PRODUCERS_BY_COUNTRY_DROPDOWN,
        variables: {
            countryCode: country
        }
    })

    const slotList = slotListResponse.data.data.slots
    const bonusList = bonusListResponse.data.data.homes[0]?.bonuses.bonus
    const slotListArticles = slotListArticlesResponse.data.data.slotListArticles[0]
    const highlightSlot =  highlightSlotResponse.data.data.slot

    if(somethingIsUndefined([slotList, bonusList, slotListArticles, highlightSlot])) serverSideRedirect(res, '/slots/row')
    return {
        props: {
            _shallow : false,
            _initialSlots: slotList,
            _slotListArticles: slotListArticles,
            _bonusList: bonusList,
            _highlightSlot : highlightSlot,
            _producersQuery:producersQuery.data.data.producers,
            _requestedCountryCode : country
        }
    }
}

const StyleProvider = styled.div`

`

const FiltersContainer = styled.div`
`

export default Slots
