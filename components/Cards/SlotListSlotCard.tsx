import React, { useContext } from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { injectCDN } from '../../utils/Utils'
import FadeBorderButton from './../Buttons/FadeBorderButton'
import snakeCase from 'lodash/snakeCase'
import LazyLoad from 'react-lazyload'
import { AlgoliaSearchResult } from '../../graphql/schema'
import { tablet } from '../Responsive/Breakpoints'
import { LocaleContext } from './../../context/LocaleContext';

interface Props {
    slotCardData: AlgoliaSearchResult
}

const SlotListSlotCard: FunctionComponent<Props> = ({ slotCardData }) => {

    const { name, rating, slug } = slotCardData

    const fullStars = rating

    const {t, contextCountry} = useContext(LocaleContext)

    const injectCdnOrFallback = (): string => {
        if (slotCardData.image === null || slotCardData.image.url === 'https://spikeapi.eu/icons/app_icon.svg') return 'https://spikeapi.eu/icons/app_icon.svg'
        return injectCDN(slotCardData.image.url, 'thumbnail_')
    }

    return (
        <CardStyleProvider>
            <CardContainer>
                <LazyLoad style={{ position: 'relative' }}>
                    <ButtonsContainer>
                        <FadeBorderButton
                            noFade={true}
                            href={slotCardData.link!}
                            external={slotCardData.mainBonus.link ? slotCardData.mainBonus.link : slotCardData.bonuses[0].link}
                            text={t("Real money")}
                            color='#07ba13' />
                        <FadeBorderButton
                            noFade={true}
                            href={`/slot/[slug]/[countryCode]`}
                            as={`/slot/${slug}/${contextCountry}`} />
                    </ButtonsContainer>

                    <img
                        alt={`${snakeCase(slotCardData.name)}_image`}
                        className="swiper-lazy"
                        src={injectCdnOrFallback()} />
                </LazyLoad>
                <div className='card-content'>
                    <h3>{name.toUpperCase()}</h3>
                    <div style={{ position: 'absolute', bottom: '0', width: '100%', }}>
                        <LazyLoad>
                            <StarContainer>
                                {[...Array(fullStars).keys()].map((s, i) => <img key={`${snakeCase(name)}_${i}_start_full`} alt='full_star_icon' className='star' src='/icons/star_full.svg' />)}
                                {[...Array(5 - fullStars).keys()].map((s, i) => <img key={`${snakeCase(name)}_${i}_start_empty`} alt='empty_star_icon' className='star' src='/icons/star_empty.svg' />)}
                            </StarContainer>
                        </LazyLoad>
                    </div>
                </div>
            </CardContainer>
        </CardStyleProvider>
    )
}

const ButtonsContainer = styled.div`
    position : absolute;
    width : 100%;
    height : 140px;
    display : flex;
    flex-direction : column;
    background : rgba(0,0,0,.5);
    justify-content : center;

`

const CardStyleProvider = styled.div`
    user-select: none;
    position : relative;
    display:flex;
    justify-content:center;     

    .card-content{
        display : flex;
        flex-direction : column;
    }

    ${tablet}{
        margin-right :1rem;
        margin-bottom : 1   rem;
    }
`

const CardContainer = styled.div`
    width : 250px;
    height : 220px;
    background : white;
    position : relative;
    border : 1px solid grey;
    box-shadow: 10px 10px 7px -9px rgba(0,0,0,0.77);

    margin-bottom : 1rem;

    img {
        border-top-left-radius : 4px;
        border-top-right-radius : 4px;
        width : 250px;
        height:140px;
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
    padding-bottom : 1rem;
    width: 100%;

    .star {
        width : 16px;
        height :16px;
    }
`

export default SlotListSlotCard
