import React, { useRef, useContext } from 'react'
import styled from 'styled-components'
import { Bonus } from '../../graphql/schema'
import { FunctionComponent } from 'react'
import PrimaryBonusCard from '../Cards/PrimaryBonusCard'
import useOnClickOutside from './../../hooks/useOnClickOutside'
import { LocaleContext } from '../../context/LocaleContext'

interface Props {
    bonuses: Bonus[]
    onClickOutside: () => void
}

const ExitBonuses: FunctionComponent<Props> = ({ bonuses, onClickOutside }) => {

    const { t } = useContext(LocaleContext)

    const ref = useRef(null)

    useOnClickOutside(ref, () => {
        onClickOutside()
    })

    return (
        <Wrapper>
            <div className='wrapper'>
                <div className='exit-bonus-header'>
                    <h3>{t("Before leaving, consult these offers")}</h3>
                </div>
                <div className='cards-container' ref={ref}>
                    {bonuses.map(bonus => <PrimaryBonusCard style={{ margin: '0', marginRight: '1rem' }} key={`bonus_${bonus.name}`} withSuggestion={false} bonus={bonus} />)}
                </div>
            </div>
        </Wrapper>
    )
}

interface IWrapper {
    show: boolean
}

const Wrapper = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    z-index : 999;
    background : white;
    position : fixed;
    background : rgba(0,0,0, .3);
    height : 100vh;
    width : 100vw;
    top : 0;
    left: 0;
    animation : fade-in 0.3s ease-in-out;

    @keyframes fade-in {
        0%{
            opacity : 0;
        }

        100%{
            opacity : 1;
        }
    }

    .wrapper{
        background : white;
        border-radius : 6px;
    }

    .cards-container {
        
        padding : 2rem; 
        display : flex;
        justify-content : space-around;
        align-items : center;
        max-height : 500px;
      
    }

    .exit-bonus-header{
        background : ${(props) => props.theme.colors.primary};
        border-top-left-radius : 6px;
        border-top-right-radius : 6px;
        color : white;
        padding : 1rem;
    }
`
export default ExitBonuses
