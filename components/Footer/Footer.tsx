import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { desktop } from '../Responsive/Breakpoints'
import ArticleToMarkdown from '../Markdown/ArticleToMarkdown'
import AquaClient from './../../graphql/aquaClient'
import { FOOTER } from '../../graphql/queries/footer'
import CoFreeImage from '../Singles/CoFreeImage'
import { LocaleContext } from '../../context/LocaleContext'
import { laptop } from './../Responsive/Breakpoints'
import NavbarAams from '../Banners/NavbarAams'
import MarkdownProvider from '../Markdown/MarkdownProvider'

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
            case 'it':
                return (
                    <div>
                        <LinkContainer>
                            <a href={`/guida/bonus-benvenuto-starcasino/${contextCountry}`}>{t('Starcasino')}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/bonus-benvenuto-casino-leovegas/${contextCountry}`}>{t('Leovegas')}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/bonus-benvenuto-casino-starvegas/${contextCountry}`}>{t('Starvegas')}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/bonus-benvenuto-casino-snai/${contextCountry}`}>{t('Snai')}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/bonus-benvenuto-casino-slotyes/${contextCountry}`}>{t('Slot-Yes')}</a>
                        </LinkContainer>
                    </div>
                )
            case 'row':
                return (
                    <div>
                        <LinkContainer>
                            <a href={`/guida/cobra-casino-review/${contextCountry}`}>{'Cobra Casino'}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/buran-casino-review/${contextCountry}`}>{'Buran Casino'}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/yoyocasino-review/${contextCountry}`}>{'Yoyo Casino'}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/mr-play-casino-review/${contextCountry}`}>{'MrPlay'}</a>
                        </LinkContainer>

                        <LinkContainer>
                            <a href={`/guida/888-casino-bonus-guide/${contextCountry}`}>{'888 Casino'}</a>
                        </LinkContainer>
                    </div>
                )

            default:
                return <div></div>
        }
    }

    const getResponsibleGamingArticle = () => {
        switch (contextCountry) {
            case 'it':
                return (
                    <LinkContainer>
                        <a href={`/articoli/ludopatia-come-smettere-di-giocare/${contextCountry}`}>
                            {t('Responsible gaming')}
                        </a>
                    </LinkContainer>
                )

            case 'row':
                return (
                    <LinkContainer>
                        <a href={`/articoli/ludopatia-come-smettere-di-giocare/${contextCountry}`}>
                            {t('Responsible gaming')}
                        </a>
                    </LinkContainer>
                )
            default:
                ;<LinkContainer>
                    <a href={`/articoli/ludopatia-come-smettere-di-giocare/${contextCountry}`}>
                        {t('Responsible gaming')}
                    </a>
                </LinkContainer>
        }
    }

    return (
        <Container>
            <div style={{ margin: 'auto', width: '100%' }}>
                <Body show={true}>
                    <section>
                        <Header>{t('Information and contacts')}</Header>
                        <div>
                            <LinkContainer>
                                <a href={`/spike/${contextCountry}`}>{t('About')}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href='/contatti'>{t('Contacts')}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/cookie-privacy-policy/${contextCountry}`}>
                                    {t('Privacy and Cookie Policy')}
                                </a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href='https://shop.spreadshirt.it/spike4'>{t('Official Store')}</a>
                            </LinkContainer>

                            {getResponsibleGamingArticle()}
                        </div>
                    </section>

                    <section>
                        <Header>{t('Popular Slot Machine Guides')}</Header>
                        <div>
                            <LinkContainer>
                                <a href={`/slot/book-of-ra-deluxe/${contextCountry}`}>{t('Book of Ra Deluxe')}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/slot/reactoonz/${contextCountry}`}>{t('Reactoonz')}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/slot/sweet-bonanza/${contextCountry}`}>{t('Sweet Bonanza')}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/slot/dead-or-alive-2/${contextCountry}`}>{t('Dead or Alive 2')}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/slot/starburst/${contextCountry}`}>{t('Starburst')}</a>
                            </LinkContainer>

                            <LinkContainer>
                                <a href={`/slot/the-dog-house/${contextCountry}`}>{t('The dog house')}</a>
                            </LinkContainer>
                        </div>
                    </section>

                    <section>
                        <Header>{t('Welcome Bonus Guides')}</Header>
                        {getBonusGuideLinkForCountry(contextCountry)}
                    </section>
                </Body>
                <h4 onClick={() => setShow(!show)} className='show-more'>
                    {!show ? t(`Show more`) : t(`Hide`)}
                </h4>

                <Body show={show}>
                    {article && show && (
                        <div>
                            {contextCountry === 'it' ? (
                                <ArticleToMarkdown content={article} />
                            ) : (
                                // <ArticleToMarkdown content={article} />
                                getArticleForCountry(contextCountry)
                            )}
                        </div>
                    )}
                </Body>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0rem' }}>
                    {contextCountry === 'it' && <NavbarAams />}
                </div>

                <Divider />
                <LowerFooterContainer>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                        <p style={{ textAlign: 'center', marginRight: '1rem' }}>
                            {contextCountry === 'it' ? 'Slot Online in Italia' : t('footer-bottom')}{' '}
                        </p>
                        <p style={{ marginLeft: '.5rem', textAlign: 'center' }}>Copyright ©2021 www.spikeslot.com</p>
                    </div>
                    <CoFreeImage />
                    <a
                        href='//www.dmca.com/Protection/Status.aspx?ID=232dd2f5-6e9d-47e7-8826-660e6eade29e'
                        title='DMCA.com Protection Status'
                        className='dmca-badge'
                    >
                        <img
                            src='https://images.dmca.com/Badges/dmca_protected_9_120.png?ID=232dd2f5-6e9d-47e7-8826-660e6eade29e'
                            alt='DMCA.com Protection Status'
                        />
                    </a>
                    <script src='https://images.dmca.com/Badges/DMCABadgeHelper.min.js'> </script>
                    {contextCountry === 'it' && <p style={{ marginLeft: '1rem' }}>Giochi di slot machine gratuiti</p>}
                    <a href='https://spikeslotgratis.com/spike_sitemap.xml' style={{ marginLeft: '1rem' }}>
                        Sitemap
                    </a>
                </LowerFooterContainer>
            </div>
        </Container>
    )
}

const getArticleForCountry = (country: string) => {
    if (country === 'ca')
        return (
            <MarkdownProvider>
                <h2>
                    Welcome to SPIKE Slot, the best website about slot machines, information and tips available for free
                </h2>
                <p style={{ marginBottom: '1rem' }}>
                    SPIKE Slot Canada is the best site on Slot Machines and Online Casinos, you will find slot guides
                    and tips and casino games. You will find all free slots to play without registration and without
                    downloading apps or software, totally free. You could find slot machine game videos played by SPIKE
                    and Moreno, as well as videos explaining online casino welcome bonuses, how to wager them and
                    withdraw money.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    All the information you need to convert bonuses into real money. You will find various welcome
                    offers, including no deposit bonuses from the best International online casinos. You will also find
                    many exclusive offers, i.e. obtainable only through this site links, and not by registering directly
                    at the online casino in question.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    All this and much more on spikeslot.com! Bookmark the page among your favorites to get direct access
                    to the n.1 international slot machine portal!
                </p>

                <h2>Are online slot machines safe?</h2>
                <p style={{ marginBottom: '1rem' }}>
                    On this site you will only find slots offered by Certified operators well-known globally for their
                    reliability.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    For this reason, if you want to play as a simple pastime but at the same time you want to be sure
                    and guaranteed that you are playing safely, choose only licensed casinos listed here.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    If you want to play online, choose only legal casinos and slots produced by the most renowned
                    software houses, you can try them in demo mode before evaluating the welcome bonus that suits you
                    best. Welcome bonuses are often updated, if you want to stay up to date on best certified Casino
                    welcome offers we suggest you to subscribe to our newsletter.
                </p>

                <h2>Join the largest International community dedicated to Slots</h2>
                <p style={{ marginBottom: '1rem' }}>
                    Over the years, SPIKE has earned the respect and affection of over 70000 followers who enjoy his
                    irreverent irony but also the professional analysis of each slot machine he tries. Become part of
                    the largest community dedicated to slot machines and stay up to date on latest videos published and
                    the best offers available.
                </p>

                <h2>Why choose Online Casinos?</h2>
                <p style={{ marginBottom: '1rem' }}>
                    You're a gambler, you like the thrill of the spinning ball in Roulette, or coin cascades in slot
                    machines, and you've never considered playing in an online casino. It's not strange, there are many
                    nostalgic players who prefer the atmosphere in casinos, or even in club rooms, even though they are
                    much less refined and luxurious environments.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    I will briefly explain why the Online Casino has become the future of gaming and replaced the
                    traditional environment. First of all, we are living in such a technological age, where you can do
                    anything with your smartphone, from daily shopping to train tickets and entertainment.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    I challenge any gambler, even the most loyal to land bookies, to deny that online betting has
                    completely revolutionised the betting world. You don't have to wait at the cashier to fill in your
                    bets, you can consult all odds at your leisure directly from your mobile phone, avoiding typing
                    errors that everyone may have experienced.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    How many of you have not been the victim of poorly filled out betting tickets by the betting agency
                    terminal?
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    On the other hand, on your online gambling account all bets and movements are tracked without any
                    possibility of error. In addition, you do not have to go to the betting agency, but you can place
                    your bet directly in the place where you are.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    As far as Casino and Slots are concerned, there is no problem of privacy as there is in club rooms,
                    with slots next to each other and people passing behind players to look around.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    Finally, online casino slots have a payout that is close to 95%, compared to much lower amounts of
                    cabinet slots. This means that they pay much more than cabinet slots; a feature that makes it easy
                    to forget the sound of coins, replaced by a more convenient deposit into a bank account or pre-paid
                    card.
                </p>
            </MarkdownProvider>
        )
    return (
        <MarkdownProvider>
            <h2>
                Welcome to SPIKE Slot, the best website about slot machines, information and tips available for free
            </h2>
            <p>
                SPIKE Slots since years is the best site in Italy about Slot Machine and Online Casino, you will find
                guides, slots tips and casino games. You will discover many slot machines playable for free without
                downloading apps or software, totally free. You will find videos about slot machine games played by
                SPIKE and Moreno, and videos explaining the Welcome Bonuses of online casinos, how to unlock them and
                withdraw money. Also, you will discover all the information you need to convert bonuses into real money.
                You will find various welcome offers, including No Deposit Bonuses from the best Italian online casinos.
                Plus, you will discover many exclusive offers. That means you can only get through the links on this
                site, and not directly by registering at the online casino in question. All this and much more on
                spikeslot.com! Save the page among the favorites of your Home, to have direct access to the n.1 portal
                in Italy about slot machines, both bar and online and vlt!
            </p>
            <h2>Are online slot machines safe?</h2>
            <p>
                On this site you will only find slots offered by online casinos with an AAMS license, the
                Amministrazione Autonoma dei Monopoli di Stato. For this reason, if you want to play as a simple
                pastime, but at the same time be sure and have the guarantee that you're playing safely, only choose
                casinos that have a regular license in Italy. You can't go wrong if you choose the online slot machines
                we review for you. We only choose legal casinos and slots produced by the most renowned software houses,
                so you can try them out in demo mode, before evaluating the welcome bonus that suits you best. The
                welcome bonuses are updated often, if you want to stay up to date on the best welcome offers of legal
                casinos in Italy, we suggest you to subscribe to the Newsletter.
            </p>
            <h2>Become part of the largest community dedicated to Slots in Italy</h2>
            <p>
                Over the years, SPIKE has earned the respect and affection of over 70000 followers who follow his
                irreverent irony, but also the professional analysis of each slot machine he tries. Become part of the
                largest community dedicated to slot machines and stay up to date on the latest videos published and the
                best offers available.
            </p>
            <h2>Why choose Online Casinos?</h2>
            <p>
                You're a gambler, you like the thrill of the spinning ball in Roulette, or the cascade of coins in the
                slot machine, and you've never considered playing in an online casino. It's not strange, there are many
                nostalgic players who prefer the atmosphere in casinos, or even in VLT rooms and bars, although they are
                much less well maintained and luxurious environments. I will briefly explain why the Online Casino will
                soon be the future of gaming and replace the traditional environment. First of all, we are living in
                such a technological age, where you can do anything with your smartphone, from daily shopping to train
                tickets and entertainment. I challenge any gambler, even the most loyal to the bookies, the totalizer
                and the betting slips, to admit that Betting Online has completely revolutionized the world of betting.
                You don't have to keep the till busy for minutes to fill in your slip, you can consult all the odds at
                your leisure directly from your mobile phone, avoiding typing errors that will have happened to
                everyone. How many of you have not been the victim of poorly compiled betting slips from the betting
                agency terminal? In addition, there is the risk of losing the slip. On the other hand, on your online
                gambling account, all bets and movements are tracked without any possibility of error. In addition, you
                do not have to go to the betting agency, but you are allowed to place a bet directly from the place
                where you are. As far as the Casino and Slots are concerned, there is no problem of privacy as there is
                in the Vlt rooms, with the slots all close together and various peeping toms (condors) passing behind
                the players to look around. Finally, Online Casino Slots have a payout that is close to 95%, compared to
                65% for bar slots. In other words, they pay much more than Italian slots; a feature that makes it easy
                to forget the sound of coins, replaced by a more convenient deposit into a bank account or rechargeable
                card.
            </p>
        </MarkdownProvider>
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
    display: ${(props: IBody) => (props.show ? 'flex' : 'hidden')};
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
