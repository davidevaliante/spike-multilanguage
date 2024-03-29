import React, { Fragment, useEffect, useContext, useState } from 'react'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'
import AquaClient from './../../../graphql/aquaClient'
import { BLOG_ARTICLES_BY_COUNTRY } from './../../../graphql/queries/blogarticle'
import { FunctionComponent } from 'react'
import { getCanonicalPath, getUserCountryCode, injectCDN } from '../../../utils/Utils'
import styled from 'styled-components'
import { BodyContainer, MainColumn, RightColumn } from '../../../components/Layout/Layout'
import LatestVideoCard from '../../../components/Cards/LatestVideoCard'
import Icon from '../../../components/Icons/Icon'
import { Article, Seo } from '../../../graphql/schema'
import BonusCardRevealComponent from '../../../components/Cards/BonusCardReveal'
import CustomBreadcrumbs from '../../../components/Breadcrumbs/CustomBreadcrumbs'
import Head from 'next/head'
import {
    DynamicArticle,
    DynamicBonusList,
    DynamicSlotList,
    DynamicVideo,
} from '../../../components/DynamicContent/DynamicContent'
import DynamicContent from './../../../components/DynamicContent/DynamicContent'
import { BLOG_LIST_BY_COUNTRY } from './../../../graphql/queries/blogList'
import BlogArticleCard from '../../../components/Cards/BlogArticleCard'
import { ApolloBonusCardReveal } from '../../../data/models/Bonus'
import { tablet } from '../../../components/Responsive/Breakpoints'
import { HOME_BONUS_LIST } from '../../../graphql/queries/bonus'
import { useRouter } from 'next/router'
import { LocaleContext } from '../../../context/LocaleContext'
import CountryEquivalentPageSnackbar from '../../../components/Snackbars/CountryEquivalentPageSnackbar'
import BlockingOverlay from '../../../components/Ui/BlockingOverlay'

interface Props {
    blogList: {
        seo: Seo
        content: (DynamicArticle | DynamicBonusList | DynamicSlotList | DynamicVideo)[]
    }
    articles: Article[]
    bonusList: { bonus: ApolloBonusCardReveal }[]
    _requestedCountryCode: string
}

const automaticRedirect = false

const BlogArticleList: FunctionComponent<Props> = ({ blogList, bonusList, articles, _requestedCountryCode }) => {
    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)
    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)

    const [loading, setLoading] = useState(true)

    const router = useRouter()

    console.log(blogList)

    useEffect(() => {
        getCountryData()
    }, [])

    const getCountryData = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        setUserCountry(geoLocatedCountryCode)

        if (_requestedCountryCode !== geoLocatedCountryCode) {
            const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)
            const homeData = await aquaClient.query({
                query: BLOG_ARTICLES_BY_COUNTRY,
                variables: { countryCode: geoLocatedCountryCode },
            })

            if (homeData.data.data.blogArticles[0]) {
                if (automaticRedirect) {
                    router.push(`/blog/${geoLocatedCountryCode}`)
                } else {
                    setUserCountryEquivalentExists(true)
                    setContextCountry(_requestedCountryCode)
                }
            }
        } else setContextCountry(_requestedCountryCode)

        setLoading(false)
    }

    useEffect(() => {
        setContextCountry(_requestedCountryCode)
    }, [_requestedCountryCode])

    const remapArticles = () => {
        // return articles

        //       id: '331',
        // title: 'Microgaming Strategia per Prevenire il Fenomeno della Dipendenza Patologica',

        const indexToRemap = '437'

        let a = articles.find((article) => article.id === indexToRemap)

        if (a) {
            const indexToRemap = articles.indexOf(a)

            if (indexToRemap !== -1) {
                console.log(indexToRemap)
                const copy = [...articles]
                copy.splice(indexToRemap, 1)

                console.log(a)

                a['created_at'] = '2022-01-07T14:20:03.894Z'

                copy.push(a)

                copy.sort((a, b) => {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                })

                return copy
            } else return articles
        }

        return articles
    }

    return (
        <Fragment>
            <Head>
                <title>{blogList.seo.seoTitle}</title>
                <meta name='description' content={blogList.seo.seoDescription}></meta>
                <meta httpEquiv='content-language' content='it-IT'></meta>
                <link rel='canonical' href={getCanonicalPath()} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp='name' content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
                <meta itemProp='description' content={blogList.seo.seoDescription} />
                <meta itemProp='image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta
                    name='twitter:title'
                    content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                />
                <meta name='twitter:description' content={blogList.seo.seoDescription} />
                <meta name='twitter:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                <meta
                    property='og:title'
                    content={`SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo`}
                />
                <meta property='og:image' content={`https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg`} />
                <meta property='og:url' content={`https://spikeslot.com/blog/${_requestedCountryCode}`} />
                <meta property='og:locale' content={_requestedCountryCode} />
                <meta property='og:type' content='article' />
                <meta property='og:description' content={blogList.seo.seoDescription} />
                <meta
                    property='og:site_name'
                    content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                />
                <link
                    rel='alternate'
                    type='application/rss+xml'
                    title='RSS feed for blog posts'
                    href='https://spikeslot.com/rss.xml'
                />
            </Head>

            <NavbarProvider currentPage='/blog' countryCode={contextCountry}>
                <BlockingOverlay redirectLink='/blog/it' userCountry={userCountry} />
                <CustomBreadcrumbs style={{ padding: '1rem 1rem' }} from='blog' />
                <BodyContainer>
                    {userCountryEquivalentExists && userCountry !== 'it' && (
                        <CountryEquivalentPageSnackbar path={`/blog/${userCountry}`} />
                    )}

                    <MainColumn>
                        <Wrapper>
                            <DynamicContent content={blogList.content} />
                            <ArticlesContainer>
                                {[...remapArticles()].map((article) => (
                                    <BlogArticleCard article={article} />
                                ))}
                            </ArticlesContainer>
                        </Wrapper>
                    </MainColumn>

                    <RightColumn>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon width={56} height={56} source='/icons/flame_icon.svg' />
                            <h3 className='video-header'>{t("Watch SPIKE's latest video")}</h3>
                        </div>
                        <LatestVideoCard />

                        <div style={{ top: '16rem' }} className='bonus-column-container'>
                            {bonusList &&
                                bonusList.map((bo) => (
                                    <BonusCardRevealComponent key={bo.bonus.name} bonus={bo.bonus} />
                                ))}
                        </div>
                    </RightColumn>
                </BodyContainer>
            </NavbarProvider>
        </Fragment>
    )
}

const ArticlesContainer = styled.div`
    justify-content: center;

    display: flex;
    flex-wrap: wrap;
    align-items: center;

    ${tablet} {
        justify-content: space-between;
    }
`

const Wrapper = styled.div`
    padding: 1rem 1rem;
`

export async function getServerSideProps({ query, res }) {
    const slug = query.slug as string

    const aquaClient = new AquaClient()

    const blogListResponse = await aquaClient.query({
        query: BLOG_LIST_BY_COUNTRY,
        variables: { countryCode: slug },
    })

    console.log(slug)

    console.log(blogListResponse.data.data.blogLists[0].content)

    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: slug,
        },
    })

    const bonusList = bonusListResponse.data.data.homes[0]?.bonuses.bonus || null

    const initialArticlesResponse = await aquaClient.query({
        query: BLOG_ARTICLES_BY_COUNTRY,
        variables: {
            countryCode: slug,
        },
    })

    console.log(initialArticlesResponse.data.data.blogArticles)

    return {
        props: {
            query,
            blogList: blogListResponse.data.data.blogLists[0],
            bonusList: bonusList,
            articles: initialArticlesResponse.data.data.blogArticles,
            _requestedCountryCode: slug,
        },
    }
}

export default BlogArticleList
