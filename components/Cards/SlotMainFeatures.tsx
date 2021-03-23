import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import capitalize from 'lodash/capitalize'
import {useTranslation} from 'react-i18next'
import { LocaleContext } from './../../context/LocaleContext';

interface Props {
    rtp: number
    gameMode: string
    theme: string
    volatility: string
    winningSpinFrequency: number
    rating: number
    bonusName: string
    bonusLink: string
    paymentMethods: { methodName: string }[]
    style?: CSSProperties
}

const SlotMainFeatures: FunctionComponent<Props> = ({
    rtp,
    gameMode,
    theme,
    volatility,
    winningSpinFrequency,
    rating,
    bonusName,
    bonusLink,
    paymentMethods,
    style
}) => {

    const gameModeToString = () => {
        if (gameMode === 'fromLeft') return 'Da sinistra'
        if (gameMode === 'fromLeftAndRight') return 'Da sinistra e destra'
        if (gameMode === 'doublespin') return 'Double Spin'
        if (gameMode === 'fivelines') return '5 Linee'
        if (gameMode === 'tenlines') return '10 Linee'
        if (gameMode === 'twentylines') return '20 Linee'
        if (gameMode === 'megaways') return 'Megaways'
        if (gameMode === 'superplay') return 'Super Play'
        if (gameMode === 'clusterpays') return 'Clusterpays'

        return capitalize(gameMode)
    }

    const volatilityToNumberOfStars = (): number => {
        if (volatility === 'low') return 1
        if (volatility === 'mediumLow') return 2
        if (volatility === 'medium') return 3
        if (volatility === 'mediumHigh') return 4
        if (volatility === 'high') return 5
        return 5
    }

    const goToBonus = () => window.open(bonusLink)

    const mapPaymentsMethodsToIcons = () => {
        return paymentMethods?.map(({ methodName }) => {
            if (methodName === 'mastercard') return <Icon src='/icons/mastercard.svg' />
            if (methodName === 'paypal') return <Icon src='/icons/paypal.svg' />
            if (methodName === 'postepay') return <Icon src='/icons/postepay_circular.svg' />
            if (methodName === 'bank') return <Icon src='/icons/bank.svg' />
            if (methodName === 'landbasedbettingshop') return <Icon src='/icons/pin_money.svg' />
            if (methodName === 'neteller') return <Icon src='/icons/neteller.svg' />
            if (methodName === 'skrill') return <Icon src='/icons/skrill.svg' />
        })
    }

    const {t} = useContext(LocaleContext)

    return (
        <Container style={style}>
            <h1>{t("Main features")}</h1>
            <div style={{ padding: '1rem' }}>
                <p className='desc'>{t("Return to the player - RTP")}</p>
                <p className='value'>{rtp}%</p>
                <Divider />

                <p className='desc'>{t("Game mode")}</p>
                <p className='value'>{gameModeToString()}</p>
                <Divider />

                <p className='desc'>{t("Theme")}</p>
                <p className='value'>{capitalize(theme)}</p>
                <Divider />

                <StarsContainer>
                    <p style={{ marginRight: '.5rem', fontSize: '1rem' }} className='desc'>{t("Volatility")}</p>
                    <div style={{ display: 'flex' }}>
                        {[...Array(volatilityToNumberOfStars()).keys()].map((s, i) => <img key={`volatility_${i}_start_full`} alt='full_star_icon' className='star' src='/icons/star_full.svg' />)}
                        {[...Array(5 - volatilityToNumberOfStars()).keys()].map((s, i) => <img key={`volatility_${i}_start_empty`} alt='empty_star_icon' className='star' src='/icons/star_empty.svg' />)}
                    </div>
                </StarsContainer>
                <Divider />

                <StarsContainer>
                    <p style={{ marginRight: '.5rem', fontSize: '1rem' }} className='desc'>{t("Winning Spin Frequency")}</p>
                    <div style={{ display: 'flex' }}>
                        {winningSpinFrequency?
                        <>
                        {[...Array(winningSpinFrequency).keys()].map((s, i) => <img key={`volatility_${i}_start_full`} alt='full_star_icon' className='star' src='/icons/star_full.svg' />)}
                        {[...Array(5 - winningSpinFrequency).keys()].map((s, i) => <img key={`volatility_${i}_start_empty`} alt='empty_star_icon' className='star' src='/icons/star_empty.svg' />)}
                        </>
                        :""}
                        </div>
                </StarsContainer>
                <Divider />

                <StarsContainer>
                    <p style={{ marginRight: '.5rem', fontSize: '1rem' }} className='desc'>{t("Vote")}</p>
                    <div style={{ display: 'flex' }}>
                        {rating ?
                        <>
                        {[...Array(rating).keys()].map((s, i) => <img key={`volatility_${i}_start_full`} alt='full_star_icon' className='star' src='/icons/star_full.svg' />)}
                        {[...Array(5 - rating).keys()].map((s, i) => <img key={`volatility_${i}_start_empty`} alt='empty_star_icon' className='star' src='/icons/star_empty.svg' />)}
                        </>
                        :""}
                    </div>

                </StarsContainer>
                <SuggestedCasino onClick={() => goToBonus()}>
                    <h3>{t("VISIT THE SITE")}</h3>
                    <h4>{bonusName}</h4>
                </SuggestedCasino>

                <PaymentAccepetedIcons>
                    {mapPaymentsMethodsToIcons()}
                </PaymentAccepetedIcons>
            </div>

        </Container>
    )
}

const Icon = styled.img`
    width : 40px;
    height : 40px;
`

const PaymentAccepetedIcons = styled.div`
    display : flex;
    justify-content : space-around;
    width : 100%;
    padding : 1rem 0rem;
`

const SuggestedCasino = styled.div`
    background : ${(props) => props.theme.colors.primary};
    color : white;
    text-align : center;
    padding : .5rem;
    cursor : pointer;
    border-radius : 6px;
    font-weight : bold;

    h4{
        margin-top : .3rem;
        font-size : .9rem;
    }
`

const StarsContainer = styled.div`
    display : flex;
    align-items : center;
    padding : .5rem 0rem;
    justify-content : space-between;
    
    p{
        text-transform:uppercase;
        padding : 0;
    }

    img{
        width : 16px;
        height : 16px;
        margin-right : .2rem;
    }
`

const Divider = styled.div`
    height : 1px;
    margin : .5rem auto;
    background : grey;
`

const Container = styled.div`
    border : 1px solid grey;
    border-radius : 7px;
    margin-top : 4rem;

    h1{
        color : white;
        background : ${(props) => props.theme.colors.primary};
        font-weight :bold;
        padding : 1rem;
        border-top-left-radius : 6px;
        border-top-right-radius : 6px;
    }

    .desc{
        padding : .3rem 0rem;
        font-weight : bold;
        color : grey;
        font-size : .8rem;
    }

    .value{
        padding : 0rem 0rem;
        font-family : ${(props) => props.theme.text.secondaryFont};
        font-weight : bold;
        color : black;
        font-size : 1.5rem;
        text-align : end;
    }
`

export default SlotMainFeatures
