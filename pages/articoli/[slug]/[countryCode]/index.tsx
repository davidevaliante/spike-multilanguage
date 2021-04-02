import React, { Fragment, useContext } from 'react'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import AquaClient from '../../../../graphql/aquaClient'
import { FunctionComponent } from 'react'
import { getCanonicalPath } from '../../../../utils/Utils'
import styled from 'styled-components'
import { BodyContainer, MainColumn, RightColumn } from '../../../../components/Layout/Layout'
import LatestVideoCard from '../../../../components/Cards/LatestVideoCard'
import Icon from '../../../../components/Icons/Icon'
import {  Article } from '../../../../graphql/schema'
import BonusCardRevealComponent from '../../../../components/Cards/BonusCardReveal'
import CustomBreadcrumbs from '../../../../components/Breadcrumbs/CustomBreadcrumbs'
import Head from 'next/head'
import DynamicContent from '../../../../components/DynamicContent/DynamicContent'
import { ARTICLE_BY_SLUG } from './../../../../graphql/queries/article'
import { ApolloBonusCardReveal } from '../../../../data/models/Bonus'
import { HOME_BONUS_LIST } from '../../../../graphql/queries/bonus'
import { LocaleContext } from '../../../../context/LocaleContext'

interface Props {
    article: Article,
    bonusList: { bonus: ApolloBonusCardReveal }[],
    countryCode:string
}

const ArticlePage: FunctionComponent<Props> = ({ article, bonusList,countryCode }) => {

    const { t } = useContext(LocaleContext)

    return (
        <Fragment>
            <Head>
                <title>{article.seo?.seoTitle}</title>
                <meta
                    name="description"
                    content={article.seo?.seoDescription}>
                </meta>
                <meta httpEquiv="content-language" content="it-IT"></meta>
                <meta charSet="utf-8" />
                <meta property="og:image" content={article.image[0].url} />
                <meta property="og:locale" content={'it'} />
                <meta property="og:type" content="article" />
                <link rel="canonical" href={getCanonicalPath()} />
                <meta property="og:description" content={article.seo?.seoDescription} />
                <meta property="og:site_name" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
                <meta property="article:tag" content={article.seo?.seoTitle} />
                <meta property="article:published_time" content={article.created_at} />
            </Head>

            <NavbarProvider currentPage={`/articoli/${article.title}`} countryCode={countryCode}>
                <CustomBreadcrumbs
                    style={{ padding: '1rem 1rem' }}
                    name={article.title}
                    from='article' />
                <BodyContainer>

                    <MainColumn>
                        <Wrapper>
                            <DynamicContent content={article.content} />
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
        query: ARTICLE_BY_SLUG,
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

    let bonusListResponseData1 : any
    
    if(bonusListResponse.data.data.homes[0] === undefined){
        bonusListResponseData1 =  await aquaClient.query({
            query: HOME_BONUS_LIST,
            variables: {
                countryCode: "row"
            }
        })
    }

    return {
        props: {
            query,
            article: articleResponse.data.data.articles[0],
            bonusList: bonusListResponse.data.data.homes.length > 0 ? bonusListResponse.data.data.homes[0]?.bonuses.bonus : bonusListResponseData1.data.data.homes[0]?.bonuses.bonus,
            countryCode:country
        }
    }
}

export default ArticlePage
