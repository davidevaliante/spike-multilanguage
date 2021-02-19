import React, { Fragment,useEffect,useContext } from 'react'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'
import AquaClient from './../../../graphql/aquaClient'
import { BLOG_ARTICLES_BY_COUNTRY } from './../../../graphql/queries/blogarticle'
import { FunctionComponent } from 'react'
import MarkdownProvider from '../../../components/Markdown/MarkdownProvider'
import { getCanonicalPath, injectCDN } from '../../../utils/Utils'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import { BodyContainer, MainColumn, RightColumn } from '../../../components/Layout/Layout'
import LatestVideoCard from '../../../components/Cards/LatestVideoCard'
import Icon from '../../../components/Icons/Icon'
import { Article, Seo } from '../../../graphql/schema'
import BonusCardRevealComponent from '../../../components/Cards/BonusCardReveal'
import CustomBreadcrumbs from '../../../components/Breadcrumbs/CustomBreadcrumbs'
import Head from 'next/head'
import { DynamicArticle, DynamicBonusList, DynamicSlotList, DynamicVideo } from '../../../components/DynamicContent/DynamicContent'
import DynamicContent from './../../../components/DynamicContent/DynamicContent'
import { BLOG_LIST_BY_COUNTRY } from './../../../graphql/queries/blogList'
import BlogArticleCard from '../../../components/Cards/BlogArticleCard'
import { ApolloBonusCardReveal } from '../../../data/models/Bonus'
import { tablet } from '../../../components/Responsive/Breakpoints'
import { HOME_BONUS_LIST } from '../../../graphql/queries/bonus'
import {useTranslation} from 'react-i18next'
import {useRouter} from 'next/router'
import {countryContext} from '../../../context/CountryContext'

interface Props {
    blogList: {
        seo: Seo
        content: (DynamicArticle | DynamicBonusList | DynamicSlotList | DynamicVideo)[]
    }
    articles: Article[]
    bonusList: { bonus: ApolloBonusCardReveal }[],
    countryCode:string
}

const BlogArticleList: FunctionComponent<Props> = ({ blogList, bonusList, articles,countryCode }) => {

    const router = useRouter()

    const {t} = useTranslation()

    const {currentCountry} = useContext(countryContext)

    useEffect(() => {
        if(!currentCountry){}else{
            if(currentCountry !== router.query.slug){
                router.push('/', `${currentCountry}`)
            }
        }
    },[currentCountry])

    return (
        <Fragment>
            
            <Head>
                <title>{blogList.seo.seoTitle}</title>
                <meta
                    name="description"
                    content={blogList.seo.seoDescription}>
                </meta>
                <meta httpEquiv="content-language" content="it-IT"></meta>
                <link rel="canonical" href={getCanonicalPath()} />
                <meta property="og:image" content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property="og:locale" content={'it'} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content={blogList.seo.seoDescription} />
                <meta property="og:site_name" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
            </Head>

            <NavbarProvider currentPage='/blog' countryCode={countryCode}>
                <CustomBreadcrumbs
                    style={{ padding: '1rem 1rem' }}
                    from='blog' />
                <BodyContainer>

                    <MainColumn>
                        <Wrapper>
                            <DynamicContent content={blogList.content} />
                            <ArticlesContainer>
                                {articles.map(article => <BlogArticleCard article={article} />)}
                            </ArticlesContainer>
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
                 
                    
                    <div style={{ top: '16rem' }} className='bonus-column-container'>
                            {bonusList && bonusList.map(bo => <BonusCardRevealComponent key={bo.bonus.name} bonus={bo.bonus} />)}
                    </div>
                    </RightColumn>
                </BodyContainer>
            </NavbarProvider>
        </Fragment>
    )
}

const ArticlesContainer = styled.div`

    justify-content : center;

    display : flex;
    flex-wrap : wrap;
    align-items : center;   

    ${tablet}{
        justify-content : space-between;
    }
`

const Wrapper = styled.div`
    padding : 1rem 1rem;
`

export async function getServerSideProps({ query }) {

    const slug = query.slug as string
    
    const aquaClient = new AquaClient()

    const blogListResponse = await aquaClient.query({
        query: BLOG_LIST_BY_COUNTRY,
        variables: { slug: slug }
    })

    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: slug
        }
    })

    const bonusList = bonusListResponse.data.data.homes[0]?.bonuses.bonus || null

    const initialArticlesResponse = await aquaClient.query({
        query: BLOG_ARTICLES_BY_COUNTRY,
        variables: {
            countryCode: slug
        }
    })

    let initialArticlesResponse_data1: any

    if(initialArticlesResponse.data.data.blogArticles[0] === undefined){
        initialArticlesResponse_data1 = await aquaClient.query({
            query: BLOG_ARTICLES_BY_COUNTRY,
            variables: {
                countryCode: "row"
            }
        })
    }

    return {
        props: {
            query,
            blogList: blogListResponse.data.data.blogLists[0],
            bonusList: bonusList,
            articles: initialArticlesResponse.data.data.blogArticles.length > 0 ? initialArticlesResponse.data.data.blogArticles : initialArticlesResponse_data1.data.data.blogArticles,
            countryCode:slug
        }
    }
}

export default BlogArticleList
