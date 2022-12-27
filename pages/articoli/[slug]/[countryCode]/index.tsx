import React, { Fragment, useContext, useEffect, useState } from 'react'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import AquaClient from '../../../../graphql/aquaClient'
import { FunctionComponent } from 'react'
import { getCanonicalPath, getUserCountryCode, injectCDN } from '../../../../utils/Utils'
import styled from 'styled-components'
import { BodyContainer, MainColumn, RightColumn } from '../../../../components/Layout/Layout'
import LatestVideoCard from '../../../../components/Cards/LatestVideoCard'
import Icon from '../../../../components/Icons/Icon'
import { Article } from '../../../../graphql/schema'
import BonusCardRevealComponent from '../../../../components/Cards/BonusCardReveal'
import CustomBreadcrumbs from '../../../../components/Breadcrumbs/CustomBreadcrumbs'
import Head from 'next/head'
import DynamicContent from '../../../../components/DynamicContent/DynamicContent'
import { ARTICLE_BY_SLUG } from './../../../../graphql/queries/article'
import { ApolloBonusCardReveal } from '../../../../data/models/Bonus'
import { HOME_BONUS_LIST } from '../../../../graphql/queries/bonus'
import { LocaleContext } from '../../../../context/LocaleContext'
import ShareButtons, { TopRowContainer } from '../../../../components/Seo/ShareButtons'
import { useRouter } from 'next/router'

interface Props {
    article: Article
    bonusList: { bonus: ApolloBonusCardReveal }[]
    countryCode: string
}

const slugsToExclude = ['/articoli/casino-online-italiani-residenti-estero/it']

const ArticlePage: FunctionComponent<Props> = ({ article, bonusList, countryCode }) => {
    const { t, setContextCountry } = useContext(LocaleContext)
    const [isFromItaly, setIsFromItaly] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (slugsToExclude.includes(router.asPath)) geoLocateUser()
    }, [router])

    const geoLocateUser = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        if (geoLocatedCountryCode === 'it') setIsFromItaly(true)
        else console.log('User is not from Italy')
    }

    useEffect(() => {
        setContextCountry(countryCode)
    }, [])

    return (
        <Fragment>
            <Head>
                <title>{article.seo?.seoTitle}</title>
                <meta name='description' content={article.seo?.seoDescription}></meta>
                <meta httpEquiv='content-language' content='it-IT'></meta>
                <meta charSet='utf-8' />
                <link rel='canonical' href={getCanonicalPath()} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp='name' content={article.seo?.seoTitle} />
                <meta itemProp='description' content={article.seo?.seoDescription} />
                <meta itemProp='image' content={article.image[0].url} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={article.seo?.seoTitle} />
                <meta name='twitter:description' content={article.seo?.seoDescription} />
                <meta name='twitter:image' content={article.image[0].url} />

                <meta property='og:title' content={article.seo?.seoTitle} />
                <meta property='og:type' content='article' />
                <meta property='og:image' content={injectCDN(article.image[0].url)} />
                <meta property='og:url' content={`https://spikeslot.com/articoli/${article.slug}/${countryCode}`} />
                <meta property='og:locale' content={'it'} />
                <meta property='og:description' content={article.seo?.seoDescription} />
                <meta
                    property='og:site_name'
                    content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                />
                <meta property='article:tag' content={article.seo?.seoTitle} />
                <meta property='article:published_time' content={article.created_at} />
            </Head>

            <NavbarProvider currentPage={`/articoli/${article.title}`} countryCode={countryCode}>
                {isFromItaly && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100vh',
                            zIndex: 30,
                            backdropFilter: 'blur(16px)',
                            userSelect: 'none',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: 'Montserrat',
                                display: 'flex',
                                backgroundColor: 'white',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                margin: 'auto auto',
                                width: '300px',
                                textAlign: 'center',
                                height: '200px',
                                padding: '2rem',
                                borderRadius: '6px',
                            }}
                        >
                            <div style={{ marginBottom: '1rem' }}>Questa pagina non è disponibile dall'Italia</div>
                            <div
                                onClick={() => router.push('/')}
                                style={{
                                    background: 'red',
                                    borderRadius: '6px',
                                    color: 'white',
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    marginTop: '3rem',
                                }}
                            >
                                Torna alla Home
                            </div>
                        </div>
                    </div>
                )}

                <TopRowContainer>
                    <CustomBreadcrumbs style={{ padding: '1rem 1rem' }} name={article.title} from='article' />

                    <ShareButtons
                        title={article.seo?.seoTitle}
                        description={article.seo?.seoDescription}
                        url={`https://spikeslot.com/articoli/${article.slug}/${countryCode}`}
                        image={article.seo?.shareImg ? article.seo.shareImg : injectCDN(article.image[0].url)}
                    />
                </TopRowContainer>

                <BodyContainer>
                    <MainColumn>
                        <Wrapper>
                            <DynamicContent content={article.content} />
                        </Wrapper>
                    </MainColumn>

                    <RightColumn>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon width={56} height={56} source='/icons/flame_icon.svg' />
                            <h1 className='video-header'>{t("Watch SPIKE's latest video")}</h1>
                        </div>
                        <LatestVideoCard />
                        <h1 className='bonus-header'>{t('The best welcome bonuses')}</h1>

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

const Wrapper = styled.div`
    padding: 1rem 1rem;
`

export async function getServerSideProps({ query }) {
    const slug = query.slug as string
    const country = query.countryCode as string

    const aquaClient = new AquaClient()

    const articleResponse = await aquaClient.query({
        query: ARTICLE_BY_SLUG,
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

    return {
        props: {
            query,
            article: articleResponse.data.data.articles[0],
            bonusList: bonusListResponse.data.data.homes[0]?.bonuses.bonus,
            countryCode: country,
        },
    }
}

export default ArticlePage
