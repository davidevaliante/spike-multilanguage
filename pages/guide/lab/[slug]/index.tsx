import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { AffiliateServiceCard, SpikeStocksContainer } from '..'
import CustomBreadcrumbs from '../../../../components/Breadcrumbs/CustomBreadcrumbs'
import { BodyContainer } from '../../../../components/Layout/Layout'
import ArticleToMarkdown from '../../../../components/Markdown/ArticleToMarkdown'
import NavbarProvider from '../../../../components/Navbar/NavbarProvider'
import { desktop, laptop } from '../../../../components/Responsive/Breakpoints'
import Metatags from '../../../../components/Seo/Metatags'
import { websiteRoot } from '../../../../constants/constants'
import AquaClient from '../../../../graphql/aquaClient'
import { serverSide404 } from '../../../../utils/Utils'

interface Iindex {
    article: any
}

const index: FunctionComponent<Iindex> = ({ article }) => {
    console.log(article)
    const handleSpikeStocksClick = () => window.open('https://spikestocks.com/')

    return (
        <NavbarProvider countryCode='it' currentPage='lab'>
            <Metatags
                title={`${article.seo.seoTitle} | SPIKE Lab`}
                url={`${websiteRoot}/guide/lab/${article.slug}`}
                description={article.seo.seoDescription}
                image={article.image.url}
                locale={'it'}
            />
            <BodyContainer>
                <CustomBreadcrumbs
                    style={{ padding: '1rem 1rem' }}
                    name={article.title}
                    from='lab-article'
                    labSlug={article.slug}
                />

                <MainColumn>
                    <ArticleToMarkdown content={article.article} />
                </MainColumn>

                <RightColumn>
                    <div className='affiliates-container'>
                        <SpikeStocksContainer onClick={handleSpikeStocksClick}>
                            <img
                                width={60}
                                height={80}
                                src='https://spike-images.s3.eu-central-1.amazonaws.com/spike-stocks-logo_a17a5550e1.png'
                            />

                            <div className='container'>
                                <div className='title'>SPIKEstocks.com</div>
                                <div className='desc'>
                                    Visita il <b>nuovo</b> sito dedicato agli investimenti !
                                </div>
                            </div>
                        </SpikeStocksContainer>

                        <AffiliateServiceCard
                            serviceName='Etoro'
                            tagline='La forza del social investing'
                            serviceImage='https://spike-crypto.s3.eu-central-1.amazonaws.com/etoro_6cbdaefe07.png?updated_at=2022-05-11T13:38:08.662Z'
                            desc='Etoro è una delle piattaforme di copy trading più famose e sicure al mondo e rappresenta la scelta migliore per chiunque si voglia affacciare sul mercato degli investimenti per la prima volta anche con piccole somme.'
                            snippets={[
                                'Miglior piattaforma per principianti',
                                'Copy Trading disponibile',
                                'Demo account disponibile per testare le proprie strategie',
                            ]}
                            affiliateLink='https://med.etoro.com/B19156_A91872_TClick_Sspikestockssito.aspx'
                        />

                        <AffiliateServiceCard
                            serviceName='Binance'
                            tagline='Exchange the world'
                            serviceImage='https://spike-crypto.s3.eu-central-1.amazonaws.com/binance_9af46db2ce.png?updated_at=2022-06-07T11:15:38.725Z'
                            desc={`Binance è la piattaforma per le crypto numero uno al mondo ed è senza dubbio l\' exchange da consigliare a chiunque si stia affacciando per la prima volta sul mondo delle cryptovalute.`}
                            snippets={[
                                '10% di sconto su tutte le fees per sempre iscrivendoti da questo link',
                                'Oltre 395 tokens da comprare',
                                'Prelievo e deposito veloci con carta di credito',
                            ]}
                            affiliateLink='https://accounts.binance.com/en/register?ref=CSVF9YVC'
                        />
                    </div>
                </RightColumn>
            </BodyContainer>
        </NavbarProvider>
    )
}

export async function getServerSideProps({ query, params, req, res }) {
    const aquaClient = new AquaClient()
    const slug = query.slug as string

    const queryToMake = /* GraphQL */ `
        query ($slug: String = "cosa-e-il-valore-temporale-della-moneta") {
            spikeStocksArticles(where: { slug: $slug }) {
                title
                article
                updated_at
                slug
                image {
                    url
                    alternativeText
                }

                seo {
                    seoTitle
                    seoDescription
                    shareImg
                }
            }
        }
    `

    const data = await aquaClient.query({
        query: queryToMake,
        variables: {
            slug,
        },
    })

    const response = data.data.data.spikeStocksArticles

    if (response.length > 0) {
        return {
            props: {
                article: response[0],
            },
        }
    } else {
        serverSide404(res)
    }
}

const MainColumn = styled.div`
    max-width: 900px;
    display: flex;
    flex-direction: column;
    min-height: 2400px;
    padding: 0rem 1rem;
    max-width: 800px;

    ${laptop} {
        padding: 0;
    }

    b {
        font-weight: bold;
    }
`

export const RightColumn = styled.div`
    width: 300px;
    /* background : blueviolet; */
    position: relative;

    ${desktop} {
        display: flex;
        flex-direction: column;
        min-width: 300px;
    }
`

export default index
