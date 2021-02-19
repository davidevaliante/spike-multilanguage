import React, { FunctionComponent, useEffect, useContext } from 'react'
import AquaClient from './../../graphql/aquaClient'
import { BONUSES_BY_NAME } from './../../graphql/queries/bonus'
import { Bonus } from '../../graphql/schema'
import BonusStripe from '../../components/Cards/BonusStripe'
import styled from 'styled-components'
import { tablet } from '../../components/Responsive/Breakpoints'
import VideoDiscalimer from '../../components/Singles/VideoDiscalimer'
import { initializeAnalytics } from './../../analytics/base'
import { cookieContext } from '../../context/CookieContext'
import CookieDisclaimer from '../../components/CookieDisclaimer/CookieDisclaimer'
import {useTranslation} from 'react-i18next'

interface Props {
    mainBonus: Bonus,
    secondBonus: Bonus,
    thirdBonus: Bonus,
    videoId: string
}

const Compare: FunctionComponent<Props> = ({ videoId, mainBonus, secondBonus, thirdBonus }) => {

    const { cookiesAccepted, updateCookiesAccepted } = useContext(cookieContext)
    
    const {t} = useTranslation()

    const analiticsString = [mainBonus, secondBonus, thirdBonus].filter(n => n !== undefined && n !== null).map(b => b.name).join()

    useEffect(() => {
        if (cookiesAccepted === 'accepted') initializeAnalytics(`/compare/${analiticsString} vid = ${videoId}`)
    }, [cookiesAccepted])

    const handleCookieAccepted = () => {
        updateCookiesAccepted(true)
    }

    const handleCookieRefused = () => {
        updateCookiesAccepted(false)
    }


    return (
        <Wrapper>
            <Container>

                <div className='top-bar'>
                    <img className='spike' src='/icons/logo_spike_no_ombra.png' />
                </div>

                <h1>{t("In this video I played on")} :</h1>

                <BonusStripe bonus={mainBonus} />

                <h1>{t("Comparison with other offers")}</h1>

                {secondBonus && <BonusStripe key={`${secondBonus.name}`} bonus={secondBonus} />}
                {thirdBonus && <BonusStripe key={`${thirdBonus.name}`} bonus={thirdBonus} />}

                <div style={{ padding: '1rem' }}>
                    <VideoDiscalimer />
                </div>
            </Container>
            {!cookiesAccepted && <CookieDisclaimer onCookiesAccepted={() => handleCookieAccepted()} onCookiesRefused={() => handleCookieRefused()} />}
        </Wrapper>
    )

}

const Wrapper = styled.div`
        background : #e0e0e0;
        min-height : 100vh;
`

const Container = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    background : #f2f2f2;


    .top-bar{
        display : flex;
        flex-direction : column;
        justify-content : center;
        max-height : 100px;
        background: ${(props) => props.theme.colors.primaryDark};
    }

    .spike{
        height : 150px;
        margin : 0rem auto;
    }

    h1{
        font-family : ${(props) => props.theme.text.secondaryFont};
        color : ${(props) => props.theme.colors.primary};
        padding : 1rem;
        text-align : center;
        font-size : 1.5rem;
    }

    ${tablet}{
        max-width : 1200px;
        margin : 0rem auto;
    }
`

export async function getServerSideProps({ query }) {

    const pickedBonus = query.options
    const videoId = query.vid
    const aquaClient = new AquaClient()

    const remappedBonusNames = pickedBonus.split(',').map(name => {
        if (name === 'Eurobet') return 'Eurobet'
        if (name === 'Snai') return 'Snai'
        if (name === 'Merkur-Win') return 'Merkur-Win'
        if (name === 'Slot-Yes') return 'Slot Yes'
        if (name === 'StarCasino') return 'StarCasinò'
        if (name === 'Lottomatica') return 'Lottomatica'
        if (name === '888') return '888 Casino'
        if (name === 'Starvegas') return 'Starvegas'
        if (name === 'Betfair') return 'Betfair'
        if (name === 'NetBet') return 'NetBet'
        if (name === 'Casino.com') return 'Casino.com'
        if (name === 'GD') return 'Gioco Digitale'
        if (name === 'LeoVegas') return 'LeoVegas'
    })

    const mainBonusName = remappedBonusNames[0]
    const secondBonusName = remappedBonusNames[1]
    const thirdBonusName = remappedBonusNames[2]

    const mainBonus = await aquaClient.query({
        query: BONUSES_BY_NAME,
        variables: {
            names: [mainBonusName],
            country: 'it'
        }
    })

    const secondBonus = await aquaClient.query({
        query: BONUSES_BY_NAME,
        variables: {
            names: [secondBonusName],
            country: 'it'
        }
    })

    const thirdBonus = await aquaClient.query({
        query: BONUSES_BY_NAME,
        variables: {
            names: [thirdBonusName],
            country: 'it'
        }
    })

    return {
        props: {
            mainBonus: mainBonus.data.data.bonuses[0],
            secondBonus: secondBonusName ? secondBonus.data.data.bonuses[0] : null,
            thirdBonus: thirdBonusName ? thirdBonus.data.data.bonuses[0] : null,
            videoId
        }
    }
}

export default Compare
