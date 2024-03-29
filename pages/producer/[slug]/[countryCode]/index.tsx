import React, { FunctionComponent, Fragment, useContext, useState, useEffect } from 'react'
import AquaClient from '../../../../graphql/aquaClient'
import { GET_PRODUCER } from '../../../../graphql/queries/producers'
import { Producer, AlgoliaSearchResult } from '../../../../graphql/schema'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import CustomBreadcrumbs from '../../../../components/Breadcrumbs/CustomBreadcrumbs'
import styled from 'styled-components'
import { getCanonicalPath, getUserCountryCode, injectCDN } from '../../../../utils/Utils'
import { GET_SLOTS_BY_PRODUCER_SLUG } from './../../../../graphql/queries/slots'
import SlotList from '../../../../components/Lists/SlotList'
import { Translations } from './../../../../constants/translation'
import LoadMoreButton from '../../../../components/Buttons/LoadMoreButton'
import SlotListOrdering from '../../../../components/Singles/SlotListOrdering'
import usePrevious from './../../../../hooks/usePrevious'
import ArticleToMarkdown from '../../../../components/Markdown/ArticleToMarkdown'
import { MainColumn, RightColumn, BodyContainer } from '../../../../components/Layout/Layout'
import ApolloBonusCardRevealComponent from './../../../../components/Cards/BonusCardReveal'
import { ApolloBonusCardReveal } from '../../../../data/models/Bonus'
import { HOME_BONUS_LIST } from '../../../../graphql/queries/bonus'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { LocaleContext } from '../../../../context/LocaleContext'
import BlockingOverlay from '../../../../components/Ui/BlockingOverlay'

interface Props {
    producer: Producer
    initialSlots: AlgoliaSearchResult[]
    bonusList: { bonus: ApolloBonusCardReveal }[]
    countryCode: string
}

const extractPathWithoutCountryCode = (path: string) => {
    const pathArray = path.split('/')
    pathArray.splice(3, 1)
    return pathArray.join('/')
}

const ProducerPage: FunctionComponent<Props> = ({ producer, initialSlots, bonusList, countryCode }) => {
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const [slotList, setSlotList] = useState(initialSlots)

    const { t, contextCountry } = useContext(LocaleContext)

    const [slotLength, setSlotLength] = useState(initialSlots.length)

    const [ordering, setOrdering] = useState<'date' | 'alphabetical' | 'rating'>('rating')

    const prevOrdering = usePrevious(ordering)

    const router = useRouter()

    useEffect(() => {
        geoLocate()
    }, [])

    useEffect(() => {
        if (prevOrdering !== undefined && ordering !== prevOrdering) getInitalOrderedBatch(ordering)
    }, [ordering])

    // funzioni
    const getInitalOrderedBatch = async (ordering: 'date' | 'alphabetical' | 'rating') => {
        let orderingString: string = 'rating:DESC'

        if (ordering === 'alphabetical') orderingString = 'name:ASC'
        if (ordering === 'rating') orderingString = 'rating:DESC'
        if (ordering === 'date') orderingString = 'created_at:DESC'

        const initialSlotsResponse = await aquaClient.query({
            query: GET_SLOTS_BY_PRODUCER_SLUG,
            variables: {
                slug: producer.slug,
                countryCode: contextCountry,
                start: 0,
                sorting: orderingString,
                limit: 16,
            },
        })

        setSlotList(initialSlotsResponse.data.data.slots)
    }

    const loadMore = async (pickedOrdering: 'date' | 'alphabetical' | 'rating') => {
        let orderingString: string = 'rating:DESC'

        if (pickedOrdering === 'alphabetical') orderingString = 'name:ASC'
        if (pickedOrdering === 'rating') orderingString = 'rating:DESC'
        if (pickedOrdering === 'date') orderingString = 'created_at:DESC'

        const nextBatch = await aquaClient.query({
            query: GET_SLOTS_BY_PRODUCER_SLUG,
            variables: {
                slug: producer.slug,
                countryCode: contextCountry,
                start: slotList.length,
                sorting: orderingString,
                limit: 12,
            },
        })
        setSlotList([...slotList, ...(nextBatch.data.data.slots as AlgoliaSearchResult[])])
    }

    const handleOrderChange = (newValue: 'date' | 'alphabetical' | 'rating') => {
        setOrdering(newValue)
    }

    const { userCountry, setUserCountry } = useContext(LocaleContext)

    const geoLocate = async () => {
        const uc = await getUserCountryCode()
        setUserCountry(uc)
    }

    return (
        <Fragment>
            <Head>
                <title>{producer.name} | SPIKE </title>
                <meta
                    name='description'
                    content={`Guarda tutte le Slot Machine prodotte dalla software house ${producer.name}, cerca quella che ti incuriosisce di più e prova la demo GRATUITA`}
                />
                <link rel='canonical' href={getCanonicalPath()} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp='name' content={`${producer.name} | SPIKE `} />
                <meta
                    itemProp='description'
                    content={`Guarda tutte le Slot Machine prodotte dalla software house ${producer.name}, cerca quella che ti incuriosisce di più e prova la demo GRATUITA`}
                />
                <meta itemProp='image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={`${producer.name} | SPIKE `} />
                <meta
                    name='twitter:description'
                    content={`Guarda tutte le Slot Machine prodotte dalla software house ${producer.name}, cerca quella che ti incuriosisce di più e prova la demo GRATUITA`}
                />
                <meta name='twitter:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property='og:locale' content={'it'} />
                <meta property='og:type' content='article' />
                <meta
                    property='og:description'
                    content={`Guarda tutte le Slot Machine prodotte dalla software house ${producer.name}, cerca quella che ti incuriosisce di più e prova la demo GRATUITA`}
                />
                <meta property='og:site_name' content={`${producer.name} | SPIKE `} />
            </Head>

            <NavbarProvider currentPage={`/producer/${producer.name}`} countryCode={countryCode}>
                <BlockingOverlay
                    redirectLink={`${extractPathWithoutCountryCode(router.asPath)}/it`}
                    userCountry={userCountry}
                />

                <BodyContainer>
                    <MainColumn>
                        <div style={{ width: '100%' }}>
                            <CustomBreadcrumbs
                                style={{
                                    margin: '1rem .5rem',
                                }}
                                name={producer.name}
                                producerName={producer.name}
                                producerSlug={producer.slug}
                                currentPageLink={`/producer/${producer.slug}/${contextCountry}`}
                                from={'producer'}
                            />
                        </div>

                        <StyleProdvider>
                            <div style={{ paddingLeft: '.5rem', paddingRight: '1rem' }}>
                                <h1 className='prod-header'>{producer.name}</h1>
                                <ArticleToMarkdown content={injectCDN(producer.description)} />
                                <h2 className='header-2'>{`${Translations.slotsByPrefix[contextCountry]}${producer.name}`}</h2>

                                <SlotListOrdering onOrderChange={handleOrderChange} ordering={ordering} />

                                <SlotList
                                    slotList={slotList}
                                    showSearchHasNoResults={slotList && slotList.length === 0}
                                />

                                <LoadMoreButton onLoadMore={() => loadMore(ordering)} />

                                {producer.bottomArticle && (
                                    <div style={{ marginTop: '4rem' }}>
                                        <ArticleToMarkdown content={injectCDN(producer.bottomArticle)} />
                                    </div>
                                )}
                            </div>
                        </StyleProdvider>
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
        </Fragment>
    )
}

const StyleProdvider = styled.div`
    width: 100%;
    /* border : 1px solid red; */
    padding: 1rem 0.5rem;

    .prod-header {
        font-family: ${(props) => props.theme.text.secondaryFont};
        color: ${(props) => props.theme.colors.primary};
        font-size: 2rem;
    }

    .header-2 {
        font-family: ${(props) => props.theme.text.secondaryFont};
        color: ${(props) => props.theme.colors.primary};
        font-size: 2rem;
        margin: 2rem 0rem;
    }
`

export const getServerSideProps = async ({ query }) => {
    const country = query.countryCode as string

    const slug = query.slug as string

    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const producerResponse = await aquaClient.query({
        query: GET_PRODUCER,
        variables: {
            countryCode: country,
            slug: slug,
        },
    })

    const initialSlotsResponse = await aquaClient.query({
        query: GET_SLOTS_BY_PRODUCER_SLUG,
        variables: {
            slug: slug,
            countryCode: country,
            start: 0,
            sorting: 'rating:DESC',
            limit: 12,
        },
    })

    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: country,
        },
    })

    const producer = producerResponse.data.data.producers[0]
    const initialSlots = initialSlotsResponse.data.data.slots
    const bonusList = bonusListResponse.data.data.homes[0].bonuses.bonus

    return {
        props: {
            producer,
            initialSlots,
            bonusList: bonusList,
            countryCode: country,
        },
    }
}

export default ProducerPage
