import React, { useContext } from 'react'
import styled from 'styled-components'
import { LocaleContext } from '../../context/LocaleContext'

interface Props {
    onClick: () => void
}

const NeonButton = (props: Props) => {
    const { t } = useContext(LocaleContext)

    return (
        <StyleProvider className='font-serif' onClick={() => props.onClick()}>
            <div>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                {t('Click Here to Play for Free')}
            </div>
        </StyleProvider>
    )
}

const StyleProvider = styled.div`
    cursor: pointer;
    display: inline-block;
    div {
        color: ${(props) => props.theme.colors.primary};
        display: inline-block;
        font-size: 24px;
        letter-spacing: 4px;
        margin: 20px 40px;
        padding: 24px 30px;
        position: relative;
        overflow: hidden;
        text-decoration: none;
        text-transform: uppercase;
        transition: 0.5s;
    }

    div:nth-child(1) {
        filter: hue-rotate(0deg);
    }

    div:nth-child(3) {
        filter: hue-rotate(110deg);
    }

    div:hover {
        background: ${(props) => props.theme.colors.primary};
        box-shadow: 0 0 5px ${(props) => props.theme.colors.primary}, 0 0 25px ${(props) => props.theme.colors.primary},
            0 0 50px ${(props) => props.theme.colors.primary}, 0 0 200px ${(props) => props.theme.colors.primary};
        color: #050801;
    }

    div span {
        display: block;
        position: absolute;
    }

    div span:nth-child(1) {
        animation: animate1 1s linear infinite;
        background: linear-gradient(90deg, transparent, ${(props) => props.theme.colors.primary});
        height: 2px;
        left: -100%;
        top: 0;
        width: 100%;
    }

    @keyframes animate1 {
        0% {
            left: -100%;
        }
        50%,
        100% {
            left: 100%;
        }
    }

    div span:nth-child(2) {
        animation: animate2 1s linear infinite;
        animation-delay: 0.25s;
        background: linear-gradient(180deg, transparent, ${(props) => props.theme.colors.primary});
        height: 100%;
        top: -100%;
        right: 0;
        width: 2px;
    }

    @keyframes animate2 {
        0% {
            top: -100%;
        }
        50%,
        100% {
            top: 100%;
        }
    }

    div span:nth-child(3) {
        animation: animate3 1s linear infinite;
        animation-delay: 0.5s;
        background: linear-gradient(270deg, transparent, ${(props) => props.theme.colors.primary});
        bottom: 0;
        height: 2px;
        right: -100%;
        width: 100%;
    }

    @keyframes animate3 {
        0% {
            right: -100%;
        }
        50%,
        100% {
            right: 100%;
        }
    }

    div span:nth-child(4) {
        animation: animate4 1s linear infinite;
        animation-delay: 0.75s;
        background: linear-gradient(360deg, transparent, ${(props) => props.theme.colors.primary});
        bottom: -100%;
        height: 100%;
        left: 0;
        width: 2px;
    }

    @keyframes animate4 {
        0% {
            bottom: -100%;
        }
        50%,
        100% {
            bottom: 100%;
        }
    }
`

export default NeonButton
