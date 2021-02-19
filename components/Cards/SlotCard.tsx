import React, { useContext } from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { SlotCard,ApolloSlotCard } from './../../data/models/Slot'
import { getImageLinkFromName } from '../../utils/Utils'
import FadeBorderButton from './../Buttons/FadeBorderButton'
import snakeCase from 'lodash/snakeCase'
import Router from 'next/router'
import { countryContext } from './../../context/CountryContext'

interface Props {
    slotCardData: ApolloSlotCard
}

const SlotCardComponent: FunctionComponent<Props> = ({ slotCardData }) => {

    const { currentCountry } = useContext(countryContext)
    
    const { name, rating,slug } = slotCardData
    
    const fullStars = parseInt(`${rating}`)

    const goToSlotPage = () => {
        Router.push(`/slot-gratis/${slotCardData}/${currentCountry}`)
    }

    return (
        <CardStyleProvider onClick={() => goToSlotPage()}>
            <CardContainer>
                <img
                    alt={`${snakeCase(slotCardData.name)}_image`}
                    className="swiper-lazy"
                    src={getImageLinkFromName('slot', name, 'medium')} />
                <div className='card-content'>
                    <h3>{name}</h3>
                    <div style={{ position: 'absolute', bottom: '0', width: '100%', }}>
                        <FadeBorderButton href={`/slot/[slug]/[countryCode]`} as={`/slot/${slug}/${currentCountry}`}></FadeBorderButton>
                        <StarContainer>
                            {[...Array(fullStars).keys()].map((s, i) => <img key={`${snakeCase(name)}_${i}_start_full`} alt='full_star_icon' className='star' src='/icons/star_full.svg' />)}
                            {[...Array(5 - fullStars).keys()].map((s, i) => <img key={`${snakeCase(name)}_${i}_start_empty`} alt='empty_star_icon' className='star' src='/icons/star_empty.svg' />)}
                        </StarContainer>
                    </div>
                </div>
            </CardContainer>
        </CardStyleProvider>
    )
}

const CardStyleProvider = styled.div`
    position : relative;

    .card-content{
        display : flex;
        flex-direction : column;
    }
`

const CardContainer = styled.div`
    cursor : pointer;
    width : 250px;
    height : 330px;
    background : white;
    position : relative;
    img {
        border-top-left-radius : 4px;
        border-top-right-radius : 4px;
        width : 100%;
    }

   

    h3{
        font-family : ${(props) => props.theme.text.secondaryFont};
        color : ${(props) => props.theme.text.color};
        padding : .7rem;
        vertical-align : center;
    }

    border-radius : 4px;
    border-bottom-left-radius : 36px;
`
const StarContainer = styled.div`
    display : flex;
    justify-content : center;
    padding-bottom : 2rem;
    width: 100%;
    .star {
        width : 16px;
        height :16px;
    }
`

export default SlotCardComponent
