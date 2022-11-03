import React, { Fragment, CSSProperties, useContext } from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { ApolloSlotCard } from '../../data/models/Slot'
import { laptop, tablet } from '../Responsive/Breakpoints'
import { AppTheme, appTheme } from '../../theme/theme'
import snakeCase from 'lodash/snakeCase'
import Link from 'next/link'
import SlotCardComponent from '../Cards/SlotCardComponent'
import Carousel from 'react-multi-carousel'
import { LocaleContext } from '../../context/LocaleContext'
import Image from 'next/image'

interface Props {
    title: string
    icon?: string
    buttonText: string
    buttonRoute: string
    buttonRouteAs?: string
    mainColor?: string
    secondaryColor?: string
    apolloSlotCards: ApolloSlotCard[]
    style?: CSSProperties
}

const ApolloSlideShow: FunctionComponent<Props> = ({
    title,
    buttonText,
    buttonRoute,
    buttonRouteAs,
    icon,
    apolloSlotCards,
    ...restProps
}) => {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    }

    const { t } = useContext(LocaleContext)

    return (
        <Fragment>
            <Container className='shadow-md shadow-zinc-700' {...restProps}>
                {/* <ProducerLogo src='/icons/pragmatic_logo.png' /> */}
                <TitleAndIconContainer>
                    <h1 className='font-serif'>{t(title)}</h1>
                    {icon && <img alt={snakeCase(icon)} src={icon} />}
                </TitleAndIconContainer>
                {apolloSlotCards ? (
                    <Carousel
                        swipeable={true}
                        ssr={true}
                        autoPlay={true}
                        infinite={true}
                        removeArrowOnDeviceType={['tablet', 'mobile']}
                        arrows={false}
                        autoPlaySpeed={4000}
                        responsive={responsive}
                    >
                        {apolloSlotCards.map((slotCard, index) => (
                            <SlotCardComponent mKey={`${title}-${slotCard.name}-${index}`} slotCardData={slotCard} />
                        ))}
                    </Carousel>
                ) : (
                    <div>loading</div>
                )}

                <Link href={buttonRoute} as={buttonRouteAs} passHref legacyBehavior>
                    <div className='flex flex-row justify-end text-white pt-8 pb-4 items-center'>
                        <a className='font-sans font-bold cursor-pointer'>{t(buttonText)}</a>

                        <Image
                            className='ml-2'
                            width={20}
                            height={20}
                            alt='cheveron_right'
                            src='/icons/cheveron_right_white.svg'
                        />
                    </div>
                </Link>
            </Container>
        </Fragment>
    )
}

interface ContainerProps {
    mainColor?: string
    secondaryColor?: string
    theme: AppTheme
}

const TitleAndIconContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1.5rem;

    img {
        width: 46px;
        height: 46px;
    }

    h1 {
        /* color : white; */
        color: #fff;
        font-size: 2rem;
    }
`

const Container = styled.div`
    width: 300px;
    padding: 1rem;
    /* background : ${(props) => props.theme.colors.primary}; */
    background: ${(props: ContainerProps) => props.mainColor};
    border: ${(props: ContainerProps) =>
        props.secondaryColor ? `5px solid ${props.secondaryColor}` : `5px solid ${props.theme.colors.primary}`};
    border-radius: 4px;
    position: relative;

    /* classe del contenitore più esterno da modificare per l'offset dello swiper */
    .swiper-container {
        padding-left: 1.5rem;

        ${laptop} {
            padding-left: 0rem;
        }
    }

    ${tablet} {
        width: 600px;
        margin-left: 4rem;
    }

    ${laptop} {
        width: 874px;
        padding: 2rem;
        padding-bottom: 0rem;
        margin-left: 0;
    }
`

ApolloSlideShow.defaultProps = {
    mainColor: appTheme.colors.primary,
}

export default ApolloSlideShow
