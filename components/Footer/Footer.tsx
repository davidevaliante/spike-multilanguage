import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import { desktop } from "../Responsive/Breakpoints"
import ArticleToMarkdown from "../Markdown/ArticleToMarkdown"
import AquaClient from "./../../graphql/aquaClient"
import { FOOTER } from "../../graphql/queries/footer"
import CoFreeImage from "../Singles/CoFreeImage"
import { LocaleContext } from "../../context/LocaleContext"
import { laptop } from "./../Responsive/Breakpoints"
import NavbarAams from "../Banners/NavbarAams"

const Footer = () => {
    const [show, setShow] = useState(false)
    const [article, setArticle] = useState<string | undefined>(undefined)

    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const aquaClient = new AquaClient()

    useEffect(() => {
        getFooterArticle()
    }, [])

    const getFooterArticle = async () => {
        const articleResponse = await aquaClient.query({
            query: FOOTER,
            variables: {},
        })
        setArticle(articleResponse.data.data.footer.article)
    }

    const getBonusGuideLinkForCountry = (countryCode: string) => {
        switch (countryCode) {
            case "it":
                return (
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
                )
            case "row":
                return (
                    <div>
                        <LinkContainer>
                            <a href={`/guida/cobra-casino-review/${contextCountry}`}>{"Cobra Casino"}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/buran-casino-review/${contextCountry}`}>{"Buran Casino"}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/yoyocasino-review/${contextCountry}`}>{"Yoyo Casino"}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/mr-play-casino-review/${contextCountry}`}>{"MrPlay"}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/888-casino-bonus-guide/${contextCountry}`}>{"888 Casino"}</a>
                        </LinkContainer>
                    </div>
                )

            default:
                return <div></div>
        }
    }

    const getResponsibleGamingArticle = () => {
        switch (contextCountry) {
            case "it":
                return (
                    <LinkContainer>
                        <a href={`/articoli/ludopatia-come-smettere-di-giocare/${contextCountry}`}>
                            {t("Responsible gaming")}
                        </a>
                    </LinkContainer>
                )

            case "row":
                return (
                    <LinkContainer>
                        <a href={`/articoli/ludopatia-come-smettere-di-giocare/${contextCountry}`}>
                            {t("Responsible gaming")}
                        </a>
                    </LinkContainer>
                )
            default:
                ;<LinkContainer>
                    <a href={`/articoli/ludopatia-come-smettere-di-giocare/${contextCountry}`}>
                        {t("Responsible gaming")}
                    </a>
                </LinkContainer>
        }
    }

    return (
        <Container>
            <div style={{ margin: "auto", width: "100%" }}>
                <Body show={true}>
                    <section>
                        <Header>{t("Information and contacts")}</Header>
                        <div>
                            <LinkContainer>
                                <a href={`/spike/${contextCountry}`}>{t("About")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href="/contatti">{t("Contacts")}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/cookie-privacy-policy/${contextCountry}`}>
                                    {t("Privacy and Cookie Policy")}
                                </a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href="https://shop.spreadshirt.it/spike4">{t("Official Store")}</a>
                            </LinkContainer>

                            {getResponsibleGamingArticle()}
                        </div>
                    </section>

                    <section>
                        <Header>{t("Popular Slot Machine Guides")}</Header>
                        <div>
                            <LinkContainer>
                                <a href={`/slot/book-of-ra-deluxe/${contextCountry}`}>{t("Book of Ra Deluxe")}</a>
                            </LinkContainer>

                            <LinkContainer>
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
                        <Header>{t("Welcome Bonus Guides")}</Header>
                        {getBonusGuideLinkForCountry(contextCountry)}
                    </section>
                </Body>
                <h4 onClick={() => setShow(!show)} className="show-more">
                    {!show ? t(`Show more`) : t(`Hide`)}
                </h4>

                <Body show={show}>
                    {article && show && (
                        <div>
                            <ArticleToMarkdown content={article} />
                        </div>
                    )}
                </Body>

                <div style={{ display: "flex", justifyContent: "center", margin: "1.5rem 0rem" }}>
                    {contextCountry === "it" && <NavbarAams />}
                </div>

                <Divider />
                <LowerFooterContainer>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
                        <p style={{ textAlign: "center", marginRight: "1rem" }}>Slot Online in Italia </p>
                        <p style={{ marginLeft: ".5rem", textAlign: "center" }}>Copyright ©2021 www.spikeslot.com</p>
                    </div>
                    <CoFreeImage />
                    <a
                        href="//www.dmca.com/Protection/Status.aspx?ID=232dd2f5-6e9d-47e7-8826-660e6eade29e"
                        title="DMCA.com Protection Status"
                        className="dmca-badge"
                    >
                        <img
                            src="https://images.dmca.com/Badges/dmca_protected_9_120.png?ID=232dd2f5-6e9d-47e7-8826-660e6eade29e"
                            alt="DMCA.com Protection Status"
                        />
                    </a>
                    <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"> </script>
                    <p style={{ marginLeft: "1rem" }}>Giochi di slot machine gratuiti</p>
                </LowerFooterContainer>
            </div>
        </Container>
    )
}

const LowerFooterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    ${laptop} {
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
`

const Divider = styled.div`
    height: 2px;
    background: #c9c9c9;
    width: 100%;
`

const LinkContainer = styled.div`
    margin: 1rem 0rem;
    cursor: pointer;
`

const Container = styled.div`
    background: #292929;
    display: flex;

    p {
        color: white;
    }

    a {
        display: block;
        color: #c9c9c9;
        transition: all 0.3s ease-in;

        :hover {
            color: ${(props) => props.theme.colors.fifth};
        }
    }

    .show-more {
        padding: 1rem;
        cursor: pointer;
        text-transform: uppercase;
        width: 100%;
        font-family: ${(props) => props.theme.text.primary};
        color: ${(props) => props.theme.colors.primary};
        text-align: center;
    }
`

interface IBody {
    show: boolean
}

const Body = styled.div`
    display: ${(props: IBody) => (props.show ? "flex" : "hidden")};
    justify-content: space-between;
    width: 100%;
    ${desktop} {
        margin: auto;
        max-width: 1200px;
    }
`

const Header = styled.h2`
    font-family: ${(props) => props.theme.text.secondaryFont};
    color: #ff6666;
    font-size: 1rem;
    padding: 2rem 0rem;
`

const HideAble = styled.div``

export default Footer
