import React, { useState, useEffect,useContext } from 'react'
import styled from 'styled-components'
import { desktop } from '../Responsive/Breakpoints'
import ArticleToMarkdown from '../Markdown/ArticleToMarkdown'
import AquaClient from './../../graphql/aquaClient'
import { VIDEO_FOOTER } from '../../graphql/queries/footer'
import {countryContext} from '../../context/CountryContext'
import { LocaleContext } from '../../context/LocaleContext'

const VideoFooter = () => {

    const [show, setShow] = useState(false)
    const [article, setArticle] = useState<string | undefined>(undefined)

    const aquaClient = new AquaClient()

    const { t, contextCountry } = useContext(LocaleContext)

    useEffect(() => {
        getFooterArticle()
    }, [])

    const getFooterArticle = async () => {
        const articleResponse = await aquaClient.query({
            query: VIDEO_FOOTER,
            variables: {}
        })

        setArticle(articleResponse.data.data.videoFooter.article)
    }

    return (
        <Container>
            <div style={{ margin: 'auto', width: '100%' }}>

                <Body show={true}>
                    <section>
                        <Header>
                            {t("Information and contacts")}
                        </Header>
                        <div>
                            <LinkContainer>
                                <a href='/spike/it'>{t("About")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href='/contatti'>{t("Contacts")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/cookie-privacy-policy/it`}>{t("Privacy and Cookie Policy")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href='https://shop.spreadshirt.it/spike4'>{t("Official Store")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/articoli/ludopatia-come-smettere-di-giocare/${contextCountry}`}>{t("Responsible gaming")}</a>
                                
                            </LinkContainer>
                        </div>
                    </section>

                    <section>
                        <Header>
                            {t("Popular Slot Machine Guides")}
                        </Header>
                        <div>
                            <LinkContainer>
                                <a href={`/slot/book-of-ra-deluxe/${contextCountry}`}>{t("Book of Ra Deluxe")}</a>
                            </LinkContainer>

                            <LinkContainer >
                                <a href={`/slot/reactoonz/${contextCountry}`}>{t("Reactoonz")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/slot/sweet-bonanza/${contextCountry}`}>{t("Sweet Bonanza")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/slot/dead-or-alive-2/${contextCountry}`}>{t("Dead or Alive 2")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/slot/starburst/${contextCountry}`}>{t("Starburst")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/slot/the-dog-house/${contextCountry}`}>{t("The dog house")}</a>
                            </LinkContainer>
                        </div>
                    </section>

                    <section>
                        <Header>
                            {t("Welcome Bonus Guides")}
                        </Header>
                        <div>
                            <LinkContainer>
                                <a href={`/guida/bonus-benvenuto-starcasino/${contextCountry}`}>{t("Starcasino")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/guida/bonus-benvenuto-casino-leovegas/${contextCountry}`}>{t("Leovegas")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/guida/bonus-benvenuto-casino-starvegas/${contextCountry}`}>{t("Starvegas")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/guida/bonus-benvenuto-casino-snai/${contextCountry}`}>{t("Snai")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/guida/bonus-benvenuto-casino-slotyes/${contextCountry}`}>{t("Slot-Yes")}</a>
                            </LinkContainer>

                        </div>
                    </section>


                </Body>
                <h1 onClick={() => setShow(!show)} className='show-more'>{!show ? t(`Show more`) : t(`Hide`)}</h1>

                <Body show={show}>
                    {article && show && <div>
                        <ArticleToMarkdown content={article} />
                    </div>}
                </Body>

                <Divider />
                <p style={{ textAlign: 'center', padding: '2rem' }}>Copyright ©2020 www.spikeslot.com</p>
            </div>


        </Container>
    )
}

const Divider = styled.div`
    height : 2px;
    background : #c9c9c9;
    width : 100%;
`

const LinkContainer = styled.div`
        margin : 1rem 0rem;
        cursor : pointer;
`

const Container = styled.div`
    background : #292929;
    display : flex;
    font-family :  Raleway, sans-serif;

    p{
        color : white;
    }

    a{
        display : block;
        color : #c9c9c9;
        transition : all .3s ease-in;

        :hover{
            color : ${(props) => props.theme.colors.fifth};
        }
    }

    ul{
        color : white;
    }

    .show-more{
        padding : 1rem;
        cursor : pointer;
        text-transform : uppercase;
        width : 100%;
        font-family : ${(props) => props.theme.text.primary};
        color : ${(props) => props.theme.colors.primary};
        text-align : center;
    }
`

interface IBody {
    show: boolean;
}

const Body = styled.div`
    display : ${(props: IBody) => props.show ? 'flex' : 'hidden'};
    justify-content : space-between;
    width : 100%;
    ${desktop}{
        margin : auto;
        max-width : 1200px;
    }
`

const Header = styled.h2`
    font-family : ${(props) => props.theme.text.secondaryFont};
    color : #ff6666;
    font-size : 1rem;
    padding : 2rem 0rem;
`

const HideAble = styled.div`
`

export default VideoFooter