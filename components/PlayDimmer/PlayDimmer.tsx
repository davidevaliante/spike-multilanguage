import React, { FunctionComponent, useState, useEffect, Fragment, useContext } from 'react'
import { Slot, Bonus } from '../../graphql/schema'
import styled from 'styled-components'
import delay from 'lodash/delay'
import useOrientationChange from './../../hooks/useOrientationChange'
import BonusPlayCard from './../Cards/BonusPlayCard'
import random from 'lodash/random'
import FadeInOut from '../Ui/FadeInOut'
import { LocaleContext } from '../../context/LocaleContext'

interface Props {
    slotData: Slot
    onClose: () => void
}

const PlayDimmer: FunctionComponent<Props> = ({ slotData, onClose }) => {

    const [backSuggestion, setBackSuggestion] = useState(true)
    const [rotationAdvice, setRotationAdvice] = useState(true)
    const [currentBonus, setCurrentBonus] = useState(slotData.mainBonus)
    const [currentTimer, setCurrentTimer] = useState(undefined)

    const orientation = typeof window !== 'undefined' && useOrientationChange()

    const { t } = useContext(LocaleContext)

    useEffect(() => {
        if (orientation === 'landscape') {
            if (rotationAdvice) setRotationAdvice(false)
            if (backSuggestion) setBackSuggestion(false)
        }

        if (orientation === 'portrait') {
            if (!backSuggestion) setBackSuggestion(true)
        }
    }, [orientation])

    useEffect(() => {
        delay(() => {
            if (rotationAdvice) setRotationAdvice(false)
        }, 4000)

        const interval = setInterval(() => {
            setCurrentBonus(pickRandom([slotData.mainBonus, ...slotData.bonuses]))
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    const pickRandom = (filteredBonusList: Bonus[]): Bonus => {
        const lastItemIndex = filteredBonusList.length - 1
        return filteredBonusList[random(lastItemIndex)]
    }

    return (
        <Wrapper>
            {backSuggestion &&

                <BackSuggestionButton onClick={() => onClose()}>
                    <img
                        alt='close icon'
                        src='/icons/close_red.svg' />
                </BackSuggestionButton>}

            <RotatingBonusContainer>
                <BonusPlayCard
                    bonus={currentBonus} />
            </RotatingBonusContainer>

            <DemoContainer>
                <iframe
                    sandbox="allow-top-navigation allow-scripts allow-forms allow-same-origin"
                    src={slotData.playLink} />
            </DemoContainer>

            <FadeInOut visible={rotationAdvice} duration={2}>
                <RotateScreen>
                    <p>{t("Rotate the screen for a better gaming experience")}</p>
                    <img src='/icons/rotate_screen.svg' />
                </RotateScreen>
            </FadeInOut>
        </Wrapper >
    )
}

const Wrapper = styled.div`
    font-family : Raleway, sans-serif;
`

const BackSuggestionButton = styled.div`
    width : 46px;
    height : 46px;
    position: absolute;
    top : 0;
    right : 0;
    z-index: 10;
    margin : .5rem;
`

const RotatingBonusContainer = styled.div`
    position : absolute;
    top : 0;
    left : 0;
`

const RotateScreen = styled.div`
    height : 76px;
    width : 100%;
    display:flex;
    position : absolute;
    bottom : 0;
    left : 0;
    justify-content : space-around;
    align-items : center;
    z-index : 10;
    background: ${(props) => props.theme.colors.primary};
    color : white;
    
    p{
        padding : 1rem;
    }

    img{
        margin : 1rem;
        width : 36px;
        height : 36px;
        animation : rotate 2s infinite;
    }

    @keyframes rotate {
        0%{
            transform:rotate(0deg);
        }

        50%{
            transform:rotate(180deg);
        }

        100%{
            transform:rotate(0deg);
        }
    }
`

const DemoContainer = styled.div`
    width : 100%;
    height : 100vh;
    position : relative;

    iframe{
        width : 100%;
        height : 100%;
    }
`

const Overlay = styled.div`
    width : 100%;
    height : 100vh;
    position : absolute;
`

export default PlayDimmer
