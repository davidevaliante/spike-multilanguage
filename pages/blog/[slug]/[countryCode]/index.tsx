import React, { Fragment, useContext, useEffect, useState } from 'react'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import AquaClient from '../../../../graphql/aquaClient'
import { BLOG_ARTICLE_BY_SLUG } from '../../../../graphql/queries/blogarticle'
import { FunctionComponent } from 'react'
import { getCanonicalPath, injectCDN, getUserCountryCode } from '../../../../utils/Utils'
import styled from 'styled-components'
import ArticleToMarkdown from '../../../../components/Markdown/ArticleToMarkdown'
import { BodyContainer, MainColumn, RightColumn } from '../../../../components/Layout/Layout'
import LatestVideoCard from '../../../../components/Cards/LatestVideoCard'
import Icon from '../../../../components/Icons/Icon'
import { BlogArticle as BG } from '../../../../graphql/schema'
import BonusCardRevealComponent from '../../../../components/Cards/BonusCardReveal'
import CustomBreadcrumbs from '../../../../components/Breadcrumbs/CustomBreadcrumbs'
import Head from 'next/head'
import { ApolloBonusCardReveal } from '../../../../data/models/Bonus'
import { HOME_BONUS_LIST } from '../../../../graphql/queries/bonus'
import { useRouter } from 'next/router'
import FullPageLoader from '../../../../components/Layout/FullPageLoader'
import { LocaleContext } from './../../../../context/LocaleContext'
import CountryEquivalentPageSnackbar from '../../../../components/Snackbars/CountryEquivalentPageSnackbar'
import ShareButtons, { TopRowContainer } from '../../../../components/Seo/ShareButtons'
import Author from '../../../../components/StructuredData.tsx/Author'

interface Props {
    article: BG
    bonusList: { bonus: ApolloBonusCardReveal }[]
    _requestedCountryCode: string
}

const automaticRedirect = false

const BlogArticle: FunctionComponent<Props> = ({ article, bonusList, _requestedCountryCode }) => {
    console.log(_requestedCountryCode)

    const {
        t,
        appCountry: contextCountry,
        setAppCountry: setContextCountry,
        userCountry,
        setUserCountry,
    } = useContext(LocaleContext)
    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)

    const [loading, setLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {
        getCountryData()
    }, [])

    const getCountryData = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        setUserCountry(geoLocatedCountryCode)

        if (_requestedCountryCode !== geoLocatedCountryCode) {
            const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)
            const homeData = await aquaClient.query({
                query: BLOG_ARTICLE_BY_SLUG,
                variables: { countryCode: geoLocatedCountryCode },
            })

            if (homeData.data.data.blogArticles[0]) {
                if (automaticRedirect) {
                    router.push(`/blog/${geoLocatedCountryCode}`)
                    return
                } else {
                    setUserCountryEquivalentExists(true)
                    setContextCountry(_requestedCountryCode)
                }
            }
        } else setContextCountry(_requestedCountryCode)

        setLoading(false)
    }

    return (
        <Fragment>
            <Head>
                <title>{article.seo?.seoTitle}</title>
                <meta name='description' content={article.seo?.seoDescription}></meta>
                <link
                    rel='canonical'
                    href={`https://spikeslotgratis.com/blog/${article.slug}/${_requestedCountryCode}`}
                />
                <meta httpEquiv='content-language' content='it-IT'></meta>

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp='name' content={article.seo?.seoTitle} />
                <meta itemProp='description' content={article.seo?.seoDescription} />
                <meta itemProp='image' content={injectCDN(article.image?.url)} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={article.seo?.seoTitle} />
                <meta name='twitter:description' content={article.seo?.seoDescription} />
                <meta name='twitter:image' content={injectCDN(article.image?.url)} />

                <meta property='og:title' content={article.seo?.seoTitle} />
                <meta property='og:image' content={injectCDN(article.image?.url)} />
                <meta
                    property='og:url'
                    content={`https://spikeslot.com/blog/${article.slug}/${_requestedCountryCode}`}
                />
                <meta property='og:locale' content={_requestedCountryCode} />
                <meta property='og:type' content='article' />
                <meta property='og:description' content={article.seo?.seoDescription} />
                <meta
                    property='og:site_name'
                    content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                />
                <meta property='article:tag' content={article.seo?.seoTitle} />
                <meta property='article:published_time' content={article.created_at} />
            </Head>

            <NavbarProvider currentPage={`/blog-article/${article.seo?.seoTitle}`} countryCode={contextCountry}>
                <TopRowContainer>
                    <CustomBreadcrumbs style={{ padding: '1rem 1rem' }} name={article.title} from='blog-article' />
                    <Author
                        articleType='NewsArticle'
                        headLine={article.seo?.seoTitle}
                        images={[article.image?.url]}
                        datePublished={article.created_at}
                        dateModified={article.updated_at}
                    />
                    <ShareButtons
                        title={article.seo?.seoTitle}
                        description={article.seo?.seoDescription}
                        url={`https://spikeslot.com/blog/${article.slug}/${_requestedCountryCode}`}
                        image={article.seo?.shareImg ? article.seo.shareImg : injectCDN(article.image?.url)}
                    />
                </TopRowContainer>

                <BodyContainer>
                    <MainColumn>
                        <div style={{ padding: '0rem 1rem' }}>
                            <ArticleToMarkdown content={article.article} allowBonuses={false} />
                        </div>
                    </MainColumn>

                    <RightColumn>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon width={56} height={56} source='/icons/flame_icon.svg' />
                            <h1 className='video-header'>{t("Watch SPIKE's latest video")}</h1>
                        </div>
                        <LatestVideoCard />
                        <h1 className='bonus-header'>{t('Bonus comparation')}</h1>

                        <div style={{ marginTop: '0rem' }} className='bonus-column-container'>
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

export async function getServerSideProps({ query }) {
    const slug = query.slug as string
    const country = query.countryCode as string

    const aquaClient = new AquaClient()

    const articleResponse = await aquaClient.query({
        query: BLOG_ARTICLE_BY_SLUG,
        variables: {
            slug: slug,
            countryCode: country,
        },
    })

    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: country,
        },
    })

    const bonusList = bonusListResponse.data.data.homes[0]?.bonuses.bonus

    return {
        props: {
            query,
            article: articleResponse.data.data.blogArticles[0],
            bonusList: bonusList || null,
            _requestedCountryCode: country,
        },
    }
}

export default BlogArticle
