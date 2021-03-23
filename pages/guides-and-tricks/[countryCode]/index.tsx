import React, { Fragment, FunctionComponent,useContext,useEffect } from 'react'
import { BonusGuide, Bonus, Article } from '../../../graphql/schema'
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
import { useTranslation } from "react-i18next";
import {useRouter} from 'next/router'
import {countryContext} from '../../../context/CountryContext'
import { getCanonicalPath } from '../../../utils/Utils'
import { LocaleContext } from './../../../context/LocaleContext';

interface Props {
    initialGuides: BonusGuide[]
    articles: Article[]
    bonusList: Bonus[],
    countryCode:string
}

const GuidesList: FunctionComponent<Props> = ({ initialGuides, bonusList, articles,countryCode }) => {

    const { t, contextCountry, setContextCountry } = useContext(LocaleContext)
    
    const router = useRouter()
  
    return (
        <Fragment>

            <Head>
                <title>{t(`Bonus Guides and Slot Tricks |  SPIKE`)}</title>
                <link rel="canonical" href={getCanonicalPath()} />
                <meta
                    name="description"
                    content={`Non sai come sbloccare i bonus ? Stai cercando una guida che ti spieghi come ottenere le migliore offerte disponibili ? Sei nel posto giusto ! Qui troverai tutte le guide dei migliori Casinò Italiani con informazioni dettagliate su come sbloccarli ed usufruirne al meglio. Guarda la video spiegazione di SPIKE che ti guiderà passo per passo`}>
                </meta>
                <meta httpEquiv="content-language" content="it-IT"></meta>

                <meta property="og:image" content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property="og:locale" content={'it'} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content={`Non sai come sbloccare i bonus ? Stai cercando una guida che ti spieghi come ottenere le migliore offerte disponibili ? Sei nel posto giusto ! Qui troverai tutte le guide dei migliori Casinò Italiani con informazioni dettagliate su come sbloccarli ed usufruirne al meglio. Guarda la video spiegazione di SPIKE che ti guiderà passo per passo`} />
                <meta property="og:site_name" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
            </Head>

            <NavbarProvider currentPage='/guide-e-trucchi' countryCode={countryCode}>

                <StyleProvider>
                    <CustomBreadcrumbs style={{ margin: '1rem 0rem' }} from='guide-list' name='Guides and Tricks' />

                    <h1>{t('Guides to the best bonuses of Italian casinos')} </h1>
                    <p>{t("GuidesTextContent1")}</p>
                    <BonusGuideContainer>
                        {initialGuides.map((guide, index) => <BonusGuideCard key={`guide_${index}`} guide={guide} />)}
                    </BonusGuideContainer>

                    <h1 style={{ margin: '2rem 0rem' }}>{t('Online Slot, Slot Bar and VLT Cheats')} </h1>
                    <p>{t("GuidesTextContent2")}</p>
                    <ArticlesContainer>
                        {articles.map((article, index) => <ArticleCard key={`article_${index}`} article={article} />)}
                    </ArticlesContainer>
                </StyleProvider>

            </NavbarProvider>
        </Fragment>
    )
}

const ArticlesContainer = styled.div`
    display : flex;
    flex-wrap : wrap;
    justify-content : center;
    align-items : center;   

    ${tablet}{
        justify-content : space-between;
    }
`

const StyleProvider = styled.div`
    padding : 1rem 1rem;

    h1{
        font-family : ${(props) => props.theme.text.secondaryFont};
        font-size : 2rem;
        color : ${(props) => props.theme.colors.primary};
    }

    p{
        margin : 1rem 0rem;
    }

    strong{
        font-weight : bold;
    }
`

const BonusGuideContainer = styled.div`
    display : flex;
    flex-wrap : wrap;
     justify-content : center;

    ${tablet}{
        justify-content : space-between;
    }
`

export async function getServerSideProps({ query }) {

    const aquaClient = new AquaClient()

    const countryCode = query.countryCode as string

    const initialGuidesResponse = await aquaClient.query({
        query: BONUS_GUIDES_BY_COUNTRY,
        variables: {
            countryCode: countryCode
        }
    })
    
    let initialGuidesResponse_data1:any
    if(initialGuidesResponse.data.data.bonusGuides[0] === undefined){
        initialGuidesResponse_data1 = await aquaClient.query({
            query: BONUS_GUIDES_BY_COUNTRY,
            variables: {
                countryCode: "row"
            }
        })
    }
    
    const initialArticlesResponse = await aquaClient.query({
        query: ARTICLES_BY_COUNTRY,
        variables: {
            countryCode: countryCode
        }
    })
    
    let initialArticlesResponse_data1:any
    if(initialArticlesResponse.data.data.articles[0] === undefined){
        initialArticlesResponse_data1 = await aquaClient.query({
            query: ARTICLES_BY_COUNTRY,
            variables: {
                countryCode: "row"
            }
        })
    }

    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: countryCode
        }
    })    

    return {
        props: {
            initialGuides:initialGuidesResponse.data.data.bonusGuides.length > 0 ? initialGuidesResponse.data.data.bonusGuides :  initialGuidesResponse_data1.data.data.bonusGuides,
            articles: initialArticlesResponse.data.data.articles.length > 0 ? initialArticlesResponse.data.data.articles : initialArticlesResponse_data1.data.data.articles,
            bonusList: bonusListResponse.data.data.homes[0]?.bonuses || null,
            countryCode:countryCode
        }
    }
}

export default GuidesList
