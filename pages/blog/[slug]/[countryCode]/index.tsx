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
import {useRouter} from 'next/router'
import FullPageLoader from '../../../../components/Layout/FullPageLoader'
import { LocaleContext } from './../../../../context/LocaleContext';
import CountryEquivalentPageSnackbar from '../../../../components/Snackbars/CountryEquivalentPageSnackbar'

interface Props {
    article: BG,
    bonusList: { bonus: ApolloBonusCardReveal }[],
    _requestedCountryCode:string
}

const automaticRedirect = false

const BlogArticle: FunctionComponent<Props> = ({ article, bonusList,_requestedCountryCode }) => {

    console.log(_requestedCountryCode)

    const {t, contextCountry, setContextCountry, userCountry, setUserCountry} = useContext(LocaleContext)
    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)

    const [loading, setLoading] = useState(true)
    
    const router = useRouter()

    useEffect(() => {
        getCountryData()
    },[])

    const getCountryData = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        setUserCountry(geoLocatedCountryCode)

        if(_requestedCountryCode !== geoLocatedCountryCode){
            const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)
            const homeData = await aquaClient.query({
                query: BLOG_ARTICLE_BY_SLUG,
                variables: { countryCode: geoLocatedCountryCode}
            })

            if(homeData.data.data.blogArticles[0]){
                if(automaticRedirect) {
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

    if(loading) return <FullPageLoader />
    return (
        <Fragment>
            <Head>
                <title>{article.seo?.seoTitle}</title>
                <meta
                    name="description"
                    content={article.seo?.seoDescription}>
                </meta>
                <link rel="canonical" href={getCanonicalPath()} />
                <meta httpEquiv="content-language" content="it-IT"></meta>
                <meta property="og:image" content={article.image?.url} />
                <meta property="og:locale" content={'it'} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content={article.seo?.seoDescription} />
                <meta property="og:site_name" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
                <meta property="article:tag" content={article.seo?.seoTitle} />
                <meta property="article:published_time" content={article.created_at} />
            </Head>

            <NavbarProvider currentPage={`/blog-article/${article.seo?.seoTitle}`} countryCode={contextCountry}>
                <CustomBreadcrumbs
                    style={{ padding: '1rem 1rem' }}
                    name={article.title}
                    from='blog-article' />

                <BodyContainer>
                    <MainColumn>
                        <Wrapper>
                            <ArticleToMarkdown content={article.article} />
                        </Wrapper>
                    </MainColumn>

                    <RightColumn>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon
                                width={56}
                                height={56}
                                source='/icons/flame_icon.svg' />
                            <h1 className='video-header'>{t("Watch SPIKE's latest video")}</h1>
                        </div>
                        <LatestVideoCard />
                        <h1 className='bonus-header'>{t("The best welcome bonuses")}</h1>

                        <div style={{ marginTop: '0rem' }} className='bonus-column-container'>
                            {bonusList && bonusList.map(bo => <BonusCardRevealComponent key={bo.bonus.name} bonus={bo.bonus} />)}
                        </div>
                    </RightColumn>

                </BodyContainer>

            </NavbarProvider>
        </Fragment>
    )
}

const Wrapper = styled.div`
    padding : 1rem 1rem;
`

export async function getServerSideProps({ query }) {

    const slug = query.slug as string
    const country = query.countryCode as string

    const aquaClient = new AquaClient()

    const articleResponse = await aquaClient.query({
        query: BLOG_ARTICLE_BY_SLUG,
        variables: {
            slug: slug,
            countryCode: country
        }
    })

    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: country
        }
    })    

    const bonusList = bonusListResponse.data.data.homes[0]?.bonuses.bonus


    return {
        props: {
            query,
            article: articleResponse.data.data.blogArticles[0],
            bonusList: bonusList || null,
            _requestedCountryCode:country
        }
    }
}

export default BlogArticle
