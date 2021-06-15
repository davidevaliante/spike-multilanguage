import React, { Fragment, useContext, useEffect } from 'react'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import AquaClient from '../../../../graphql/aquaClient'
import { FunctionComponent } from 'react'
import MarkdownProvider from '../../../../components/Markdown/MarkdownProvider'
import { getCanonicalPath, injectCDN } from '../../../../utils/Utils'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import ArticleToMarkdown from '../../../../components/Markdown/ArticleToMarkdown'
import { BodyContainer, MainColumn, RightColumn } from '../../../../components/Layout/Layout'
import { BonusGuide } from '../../../../graphql/schema'
import BonusCardRevealComponent from '../../../../components/Cards/BonusCardReveal'
import CustomBreadcrumbs from '../../../../components/Breadcrumbs/CustomBreadcrumbs'
import { BONUS_GUIDE_BY_SLUG_AND_COUNTRY } from '../../../../graphql/queries/bonusguide'
import PrimaryBonusCard from './../../../../components/Cards/PrimaryBonusCard'
import Head from 'next/head'
import { ApolloBonusCardReveal } from '../../../../data/models/Bonus'
import { HOME_BONUS_LIST } from '../../../../graphql/queries/bonus'
import {useRouter} from 'next/router'
import {countryContext} from '../../../../context/CountryContext'
import { LocaleContext } from '../../../../context/LocaleContext'

interface Props {
    bonusGuide: BonusGuide,
    bonusList: { bonus: ApolloBonusCardReveal }[],
    countryCode:string
}

const BonusGuidePage: FunctionComponent<Props> = ({ bonusGuide, bonusList,countryCode }) => {

    const router = useRouter()
    const {t, contextCountry, setContextCountry, userCountry, setUserCountry} = useContext(LocaleContext)

    useEffect(() => {
        setContextCountry(countryCode)
    }, [countryCode])


    return (
        <Fragment>
            <Head>
                <title>{bonusGuide.seo ? `${bonusGuide.seo.seoTitle}` : `${bonusGuide.bonus?.name} | SPIKE`}</title>
                <link rel="canonical" href={getCanonicalPath()} />
                <meta
                    name="description"
                    content={bonusGuide?.seo ? `${bonusGuide.seo.seoDescription}` : `${bonusGuide?.bonus?.name} Le migliori slot online selezionate per te con trucchi consigli e demo gratuite. Prova le slot online in modalità gratuita, scegli quella che ti incuriosisce di più e leggi la guida approfondita prima di passare alla versione a soldi veri`}>
                </meta>

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp="name" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
                <meta itemProp="description" content={bonusGuide?.seo?.seoDescription} />
                <meta itemProp="image" content={bonusGuide?.image?.url}  />
                
                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
                <meta name="twitter:description" content={bonusGuide?.seo?.seoDescription} />
                <meta name="twitter:image" content={bonusGuide?.image?.url} />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:image" content={bonusGuide?.image?.url} />
                <meta property="og:locale" content={'it'} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content={bonusGuide?.seo?.seoDescription} />
                <meta property="og:site_name" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />

                <meta httpEquiv="content-language" content="it-IT"></meta>
                <meta property="og:image" content={bonusGuide?.image?.url} />
                <meta property="og:locale" content={'it'} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content={bonusGuide?.seo?.seoDescription} />
                <meta property="og:site_name" content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
                <meta property="article:tag" content={bonusGuide?.seo?.seoTitle} />
            </Head>

            <NavbarProvider currentPage={`Guida - ${bonusGuide?.bonus?.name} - ${bonusGuide?.bonus?.country.code}`} countryCode={contextCountry}>
                <CustomBreadcrumbs
                    style={{ padding: '1rem 1rem' }}
                    guideSlug={bonusGuide?.slug}
                    name={bonusGuide?.bonus?.name}
                    from='guide' />

                <BodyContainer>

                    <MainColumn>
                        <Wrapper>
                            <ArticleToMarkdown content={bonusGuide?.article!} />
                        </Wrapper>
                    </MainColumn>

                    <RightColumn>
                        <PrimaryBonusCard withSuggestion={false} bonus={bonusGuide?.bonus!} />
                        <div style={{ marginTop: '8rem' }} className='bonus-column-container'>
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

    const bonusGuideResponse = await aquaClient.query({
        query: BONUS_GUIDE_BY_SLUG_AND_COUNTRY,
        variables: {
            slug: slug,
            countryCode: country
        }
    })

    let bonusGuideResponseData1 : any
    if(bonusGuideResponse.data.data.bonusGuides[0] === undefined){
        bonusGuideResponseData1 = await aquaClient.query({
            query: BONUS_GUIDE_BY_SLUG_AND_COUNTRY,
            variables: {
                slug: slug,
                countryCode: "row"
            }
        })
    }

    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: country
        }
    })

    let data1:any
    if(bonusListResponse.data.data.homes[0] === undefined){
        data1 = await aquaClient.query({
            query: HOME_BONUS_LIST,
            variables: {
                countryCode: "row"
            }
        })
    } 

    const bonusList = bonusListResponse.data.data.homes[0]?.bonuses.bonus?bonusListResponse.data.data.homes[0]?.bonuses.bonus : data1.data.data.homes[0]?.bonuses.bonus

    return {
        props: {
            query,
            bonusGuide: bonusGuideResponse.data.data.bonusGuides[0] ? bonusGuideResponse.data.data.bonusGuides[0] : bonusGuideResponseData1.data.data.bonusGuides[0] || null,
            bonusList: bonusList,
            countryCode:country
        }
    }
}

export default BonusGuidePage
