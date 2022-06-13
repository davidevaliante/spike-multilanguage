import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import LabCard from '../../../components/Cards/LabCard'
import { BodyContainer, RightColumn } from '../../../components/Layout/Layout'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'
import { laptop, tablet } from '../../../components/Responsive/Breakpoints'
import AquaClient from '../../../graphql/aquaClient'
import { serverSide404 } from '../../../utils/Utils'

interface Iindex {
    articles: any
}

const index: FunctionComponent<Iindex> = ({ articles }) => {
    console.log(articles)

    const handleSpikeStocksClick = () => window.open('https://spikestocks.com/')

    return (
        <NavbarProvider countryCode='it' currentPage='lab-list'>
            <StyleProvider>
                <BodyContainer>
                    <MainColumn>
                        <Header>SPIKE Lab</Header>

                        <HeaderTwo>Guide al mondo crypto ed investimenti</HeaderTwo>
                        <p>
                            Come conoscere le migliori possibilità di investimento per il proprio capitale in modo da
                            ottimizzare i guadagni? In questa sezione, <b>SPIKE lab</b> vi porterà a comprendere che
                            investire risorse finanziarie, non deve essere necessariamente solo un progetto di tipo
                            pensionistico. Esistono possibilità di investimenti intelligenti, davvero vantaggiose nella
                            prospettiva di benessere finanziario sul lungo periodo, con dividendi più convenienti,
                            rispetto alle classiche forme di risparmio. Per trovare informazioni dedicate al mondo del
                            trading puoi visitare il nuovo sito dedicato{' '}
                            <a href='https://spikestocks.com/'>SPIKEstocks</a>
                        </p>

                        <p>
                            In questa sezione, <b>SPIKE</b> condivide con voi alcune strategie di investimento,
                            suddividendo il mercato in cinque settori basilari, ovvero:
                        </p>

                        <ul>
                            <li>contanti ed equivalenti</li>
                            <li>azioni</li>
                            <li>obbligazioni</li>
                            <li>fondi</li>
                            <li>prodotti assicurativi</li>
                        </ul>

                        <ArticlesContainer>
                            {articles.map((article, index) => (
                                <LabCard key={`lab_article_${index}`} article={article} />
                            ))}
                        </ArticlesContainer>

                        <p>
                            Una particolare attenzione è riservata alle diverse forme di investimento dei cinque ambiti
                            fondamentali. Inoltre, la rubrica discute argomenti imprescindibili come l'importanza di
                            avere un portafoglio equilibrato per una buona esperienza di investimento; ma anche la
                            comprensione e la gestione del rischio. In più, si parla di come identificare i valori nel
                            mercato e come costruire un robusto portafoglio di investimenti nel tempo.
                        </p>

                        <p>
                            Tecnicamente, troverai informazioni su come imparare a calcolare il tasso di rendimento di
                            un portafoglio rispetto all'andamento generale del mercato. Infine, sono spiegate opzioni
                            per investimenti fai-da-te; come evitare elevate commissioni di investimento e i casi in cui
                            è importante avvalersi di un consulente.
                        </p>

                        <p>Scopo di questa rubrica:</p>

                        <ul>
                            <li>Analizzare la nozione di valore temporale del denaro.</li>
                            <li>
                                Individuare il mezzo più appropriato per gli investitori in diverse posizioni
                                finanziarie.
                            </li>
                            <li>Spiegare le forme di investimento in criptovalute</li>
                            <li>Illustrare cosa si intende per premio di rischio con le obbligazioni.</li>
                            <li>
                                Differenziare le diverse forme di rischio e le strategie che un investitore può attuare
                                per tutelare gli investimenti dalle differenti tipologie di rischio.
                            </li>
                            <li>
                                Applicare la misura appropriata per individuare il valore di mercato di un investimento.
                            </li>
                            <li>
                                Prevedere il risultato delle scelte di investimento in cui sono comprese le plusvalenze.
                            </li>
                        </ul>
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
            </StyleProvider>
        </NavbarProvider>
    )
}

export const SpikeStocksContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(90deg, rgba(55, 135, 238, 1) 0%, rgba(21, 183, 168, 1) 100%);
    margin: 2rem 0rem;
    padding: 0.7rem;
    color: white;
    box-shadow: 7px 5px 26px -4px rgba(0, 0, 0, 0.2);
    cursor: pointer;

    border-radius: 8px;

    img {
        object-fit: cover;
    }

    .title {
        font-size: 1.5rem;
        margin-bottom: 0.7rem;
        font-weight: bold;
        color: black;
    }

    .desc {
        font-size: 0.85rem;
    }

    .container {
        padding: 0.5rem;
    }

    b {
        font-weight: bold;
    }
`

const ArticlesContainer = styled.div`
    justify-content: center;

    display: flex;
    flex-wrap: wrap;
    align-items: center;

    margin: 1rem 0rem;

    ${tablet} {
        justify-content: space-between;
    }
`

export async function getServerSideProps({ query, params, req, res }) {
    const aquaClient = new AquaClient()

    const queryToMake = /* GraphQL */ `
        query {
            spikeStocksArticles(sort: "updated_at:desc") {
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
                    seoTitle
                    shareImg
                }
            }
        }
    `

    const data = await aquaClient.query({
        query: queryToMake,
        variables: {},
    })

    const response = data.data.data.spikeStocksArticles

    return {
        props: {
            articles: response,
        },
    }
}

export const AffiliateServiceCard: FunctionComponent<{
    serviceName: string
    serviceImage: string
    snippets: string[]
    desc: string
    affiliateLink: string
}> = ({ serviceImage, serviceName, snippets, desc, affiliateLink }) => {
    const handleClick = () => window.open(affiliateLink)

    return (
        <AffiliateCardContainer onClick={handleClick}>
            <div className='content'>
                <img width={70} height={70} src={serviceImage} />

                <div className='service-name'>{serviceName}</div>
            </div>

            <div className='desc'>{desc}</div>

            <div className='text-container'>
                <ul>
                    {snippets.map((snip, index) => (
                        <li key={`${serviceName}-snip-${index}`}>{snip}</li>
                    ))}
                </ul>
            </div>
            <div className='cta'>VISITA IL SITO</div>
        </AffiliateCardContainer>
    )
}

const Header = styled.h1`
    color: ${(props) => props.theme.colors.primary};
    font-family: 'Kanit';
    font-size: 3rem;
    margin: 1rem 0rem;

    ${laptop} {
        margin: 2rem 0rem;
    }
`

const HeaderTwo = styled.h1`
    color: ${(props) => props.theme.colors.primary};
    font-family: 'Kanit';
    font-size: 2rem;
    margin: 1rem 0rem;

    ${laptop} {
        margin: 2rem 0rem;
    }
`

const AffiliateCardContainer = styled.div`
    border: 1px solid #e3e3e3;
    padding: 1rem;
    box-shadow: 7px 5px 26px -4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    cursor: pointer;

    .content {
        display: flex;
        align-items: center;
    }

    .service-name {
        font-weight: bold;
        color: black;
        font-family: 'Kanit';
        font-size: 1.7rem;
        margin-left: 0.8rem;
    }

    img {
        border-radius: 50%;
        object-fit: cover;
    }

    .text-container {
    }

    ul {
        margin-top: 0.8rem;
    }

    li {
        font-size: 0.8rem;
        color: #07b533;
    }

    .cta {
        background-color: ${(props) => props.theme.colors.primary};
        border-radius: 50px;
        padding: 1rem 0.5rem;
        text-align: center;
        color: white;
        font-weight: bold;
        margin: 0.5rem 0rem;
    }

    .desc {
        font-size: 0.9rem;
        margin: 1rem 0rem;
    }

    margin-bottom: 2rem;
`

export const StyleProvider = styled.div`
    .affiliates-container {
        margin-top: 8rem;
    }

    p {
        margin-bottom: 1rem;
        line-height: 1.4rem;
    }

    ul {
        list-style: disc;
        list-style-position: inside;
        margin-bottom: 1rem;
    }

    li {
        margin-bottom: 0.3rem;
    }
`

const MainColumn = styled.div`
    max-width: 900px;
    display: flex;
    flex-direction: column;
    min-height: 2400px;
    padding: 0rem 0.5rem;
    max-width: 800px;

    ${laptop} {
        padding: 0;
    }

    b {
        font-weight: bold;
    }
`

export default index
