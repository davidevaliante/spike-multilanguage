import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { mobile } from '../Responsive/Breakpoints'

interface IStatsCta {
    exclude:
        | 'crazy-time'
        | 'sweet-bonanza'
        | 'megawheel'
        | 'megaroulette'
        | 'monopoly'
        | 'dreamcatcher'
        | 'lightningdice'
        | 'none'
}

const StatsCta: FunctionComponent<IStatsCta> = ({ exclude: not }) => {
    return (
        <QuickStatsContainer>
            {not !== 'crazy-time' && (
                <a href='/live-stats/crazy-time/it' className='card'>
                    Crazy Time Stats
                </a>
            )}
            {not !== 'sweet-bonanza' && (
                <a href='/live-stats/sweet-bonanza-candyland/it' className='card'>
                    Sweet Bonanza Candyland Stats
                </a>
            )}
            {not !== 'megawheel' && (
                <a href='/live-stats/mega-wheel/it' className='card'>
                    Mega Wheel Stats
                </a>
            )}
            {not !== 'megaroulette' && (
                <a href='/live-stats/mega-roulette/it' className='card'>
                    Mega Roulette Stats
                </a>
            )}
            {not !== 'monopoly' && (
                <a href='/live-stats/monopoly-live/it' className='card'>
                    Monopoly Stats
                </a>
            )}
            {not !== 'dreamcatcher' && (
                <a href='/live-stats/dream-catcher/it' className='card'>
                    Dream Catcher Stats
                </a>
            )}
            {not !== 'lightningdice' && (
                <a href='/live-stats/lightning-dice/it' className='card'>
                    Lightning Dice Stats
                </a>
            )}
        </QuickStatsContainer>
    )
}

export const QuickStatsContainer = styled.div`
    margin: 3rem 0rem;
    display: flex;
    justify-content: center;
    ${mobile} {
        justify-content: space-between;
    }
    flex-wrap: wrap;
    /* flex-direction: column; */

    .card {
        all: unset;
        display: inline-block;
        background-color: ${(props) => props.theme.colors.primary};
        padding: 1rem;
        border-radius: 6px;
        color: white;
        font-weight: bold;
        width: 300px;
        text-align: center;
        margin-bottom: 1rem;
        cursor: pointer;
    }
`

export default StatsCta
