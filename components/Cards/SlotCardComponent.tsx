import React, { useContext } from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { ApolloSlotCard } from '../../data/models/Slot'
import { injectCDN } from '../../utils/Utils'
import FadeBorderButton from '../Buttons/FadeBorderButton'
import snakeCase from 'lodash/snakeCase'
import Router from 'next/router'
import { countryContext } from '../../context/CountryContext'
import LazyLoad from 'react-lazyload'
import LazyImage from '../Lazy/LazyImage'
import { LocaleContext } from './../../context/LocaleContext'

interface Props {
    mKey: string
    slotCardData: ApolloSlotCard
}

const SlotCardComponent: FunctionComponent<Props> = ({ slotCardData, mKey }) => {
    const { appCountry: contextCountry } = useContext(LocaleContext)

    const { name, rating, slug } = slotCardData

    const fullStars = rating

    const goToSlotPage = () => {
        Router.push(`/slot/${slug}/${contextCountry}`)
    }

    const injectCdnOrFallback = (): string => {
        if (slotCardData.image === null) return 'https://spikeapi.eu/icons/app_icon.svg'
        return injectCDN(slotCardData.image.url, 'thumbnail_')
    }
    console.log(mKey)

    return (
        <div className='select-none relative flex flex-row justify-center' key={mKey}>
            <CardContainer onClick={() => goToSlotPage()}>
                <LazyImage
                    className='image-border swiper-lazy'
                    fromTop={100}
                    width={250}
                    height={140}
                    alt={
                        slotCardData.image.alternativeText
                            ? slotCardData.image.alternativeText
                            : `${snakeCase(slotCardData.name)}_image`
                    }
                    src={injectCdnOrFallback()}
                />

                <div className='card-content'>
                    <h3 className='font-serif text-lg leading-5 my-2 mx-2 text-zinc-800'>{name.toUpperCase()}</h3>
                    <div style={{ position: 'absolute', bottom: '0', width: '100%' }}>
                        <FadeBorderButton href={`/slot/${slug}/${contextCountry}`} />
                        <LazyLoad offset={100}>
                            <StarContainer>
                                {[...Array(fullStars).keys()].map((s, i) => (
                                    <img
                                        key={`${snakeCase(name)}_${i}_start_full`}
                                        alt='full_star_icon'
                                        className='star'
                                        src='/icons/star_full.svg'
                                    />
                                ))}
                                {[...Array(5 - fullStars).keys()].map((s, i) => (
                                    <img
                                        key={`${snakeCase(name)}_${i}_start_empty`}
                                        alt='empty_star_icon'
                                        className='star'
                                        src='/icons/star_empty.svg'
                                    />
                                ))}
                            </StarContainer>
                        </LazyLoad>
                    </div>
                </div>
            </CardContainer>
        </div>
    )
}

const CardStyleProvider = styled.div`
    user-select: none;
    position: relative;
    display: flex;
    justify-content: center;
`

const CardContainer = styled.div`
    cursor: pointer;
    width: 250px;
    height: 310px;
    background: white;
    position: relative;

    .image-border {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    img {
        width: 250px;
        height: 140px;
    }

    border-radius: 4px;
    border-bottom-left-radius: 36px;
`
const StarContainer = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 2rem;
    width: 100%;
    .star {
        width: 16px;
        height: 16px;
    }
`

export default SlotCardComponent
