import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { ApolloSlotCard } from '../../data/models/Slot'
import { laptop, desktop, tablet } from '../Responsive/Breakpoints'
import SlotCardComponent from '../Cards/SlotCardComponent'
import Carousel from 'react-multi-carousel'
import LazyLoad from 'react-lazyload'
import { LocaleContext } from '../../context/LocaleContext'

interface Props {
    producerSlots: ApolloSlotCard[]
}

const NoLimitHighlightProducerSlideShow: FunctionComponent<Props> = ({ producerSlots }) => {
    console.log(producerSlots)

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 3,
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
        <Container className='shadow-md shadow-zinc-700'>
            <LazyLoad>
                <ProducerLogo
                    src='https://media-exp1.licdn.com/dms/image/C4D0BAQE-Je4F7zSLFw/company-logo_200_200/0/1602670033611?e=1674086400&v=beta&t=p8ujkFpMlFPWAghIZl_InFVNhs357GpzoaUEy7T7Q4g'
                    alt='no limit logo'
                />
            </LazyLoad>
            <h1 className='font-serif'>{'Le migliori NoLimit City selezionate per te'}</h1>
            <Carousel
                swipeable={true}
                ssr={true}
                infinite={true}
                arrows={false}
                autoPlay={true}
                autoPlaySpeed={4000}
                responsive={responsive}
            >
                {producerSlots.map((slotCard, index) => (
                    <SlotCardComponent mKey={`no-limits-${slotCard.name}-${index}`} slotCardData={slotCard} />
                ))}
            </Carousel>
        </Container>
    )
}

const ProducerLogo = styled.img`
    display: none;
    width: 76px;
    height: 76px;
    border-radius: 50%;
    border: 2px solid #f5bc42;
    position: absolute;
    top: -30px;
    left: -40px;
    animation: wiggle 2s infinite linear;

    @keyframes wiggle {
        from {
            transform: rotate(0deg);
        }

        25% {
            transform: rotate(15deg);
        }

        50% {
            transform: rotate(0deg);
        }

        75% {
            transform: rotate(-15deg);
        }

        to {
            transform: rotate(0deg);
        }
    }

    ${desktop} {
        display: block;
    }
`

const Container = styled.div`
    padding: 1rem;
    /* background : ${(props) => props.theme.colors.primary}; */
    background: #292929;
    border-radius: 4px;
    border: 5px solid #f5bc42;
    position: relative;
    width: 300px;

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
        margin-left: 0;
    }

    h1 {
        /* color : white; */
        color: #f5bc42;
        font-size: 2rem;
        padding-bottom: 2rem;
    }
`

export default NoLimitHighlightProducerSlideShow
