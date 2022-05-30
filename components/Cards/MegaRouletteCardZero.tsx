import React, { FunctionComponent, useContext } from 'react'
import { MegaRouletteStat } from '../../data/models/CrazyTimeSymbolStat'
import styled from 'styled-components'
import { LocaleContext } from '../../context/LocaleContext'

interface IMegaRouletteCardZero {
    stat: MegaRouletteStat
    totalSpinsConsidered: number
    timeFrame: string
}

const MegaRouletteCardZero: FunctionComponent<IMegaRouletteCardZero> = ({ stat, totalSpinsConsidered, timeFrame }) => {
    const { t } = useContext(LocaleContext)

    return (
        <CardContainer bgColor={megaRouletteSymbolToColor(stat.symbol)}>
            <div className='percentage'>{`${stat.percentage.toFixed(2)} %`}</div>
            <div className='lands'>{`${stat.lands}/${totalSpinsConsidered}`}</div>
            {stat.symbol}
            <div className='since'>
                <p style={{ marginRight: '.5rem', fontSize: '.6rem', marginBottom: '.5rem' }}>{t('Missing Since')}</p>
                {stat.spinSince}
            </div>
        </CardContainer>
    )
}

export const megaRouletteSymbolToColor = (s: number) => {
    if (s == 0) return 'green'
    if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(s)) return 'red'
    return 'black'
}

export const CardContainer = styled.div<{ bgColor: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;

    width: 86px;
    box-sizing: border-box;
    border-radius: 6px;
    font-weight: bold;
    font-size: 3rem;
    height: auto;
    min-height: auto;

    color: white;
    background-color: ${(props) => props.bgColor};

    .percentage {
        font-size: 1rem;
        margin-bottom: 1rem;
    }

    .lands {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        font-weight: normal;
    }

    .since {
        font-size: 0.9rem;
        text-align: center;
        margin-top: 1rem;
    }
`

export default MegaRouletteCardZero
