import React, { Fragment, useContext } from 'react'
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

const ApolloHighlightProducerSlideShow: FunctionComponent<Props> = ({ producerSlots }) => {

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    const { t } = useContext(LocaleContext)

    return (
        <Fragment>
            <Container>
                <LazyLoad>
                    <ProducerLogo src='/icons/logo_novomatic.png' />
                </LazyLoad>
                <h1>{t("The best Novomatic selected for you")}</h1>
                {producerSlots.length > 0 ? <Carousel
                    swipeable={true}
                    ssr={true}
                    autoPlay={true}
                    infinite={true}
                    arrows={false}
                    autoPlaySpeed={4000}
                    responsive={responsive}>
                    {producerSlots.map((slotCard, index) =>
                        <div key={index}>
                            <SlotCardComponent slotCardData={slotCard} />
                        </div>
                    )}
                </Carousel> : <div>loading</div>}
            </Container>
        </Fragment>
    )
}

const params = {
    slidesPerView: 1,
    slidesPerGroup: 1,
    loop: true,
    autoplay: {
        delay: 1500,
        disableOnInteraction: false
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: (index, className) => {
            return '<div />';
        }
    },
    // navigation: {
    //     nextEl: '.swiper-button-next',
    //     prevEl: '.swiper-button-prev'
    // },
    breakpoints: {
        1024: {
            slidesPerView: 3,
            spaceBetween: 20
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 10
        },
        640: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        320: {
            slidesPerView: 1,
        }
    }
}


const ProducerLogo = styled.img`
    display : none;
    width : 76px;
    height : 76px;
    border-radius : 50%;
    border : 2px solid #09d1e3;
    position : absolute;
    top : -30px;
    left: -40px;
    animation : wiggle 2s infinite linear;

    @keyframes wiggle {
        from{
            transform : rotate(0deg);
        }

        25%{
            transform : rotate(15deg);
        }

        50%{
            transform : rotate(0deg);
        }

        75%{
            transform : rotate(-15deg);
        }

        to{
            transform : rotate(0deg);
        }
    }

    ${desktop}{
        display : block;
    }
`


const Container = styled.div`
    padding : 1rem;
    /* background : ${(props) => props.theme.colors.primary}; */
    background : #0c3267;
    border-radius : 4px;
    border : 5px solid #09d1e3;
    position : relative;
    width : 300px;
    box-shadow: 10px 10px 5px -4px rgba(0,0,0,0.73);
    margin-left : .8rem;
    
    /* classe del contenitore più esterno da modificare per l'offset dello swiper */
    .swiper-container{
        padding-left : 1.5rem;

        ${laptop}{
            padding-left : 0rem;
        }
    }

    ${tablet}{
        width : 600px;
        margin-left : 4rem;
    }

    ${laptop}{
        width : 800px;
        padding : 2rem;
        margin-left : 0;
    }

    
    h1{
        font-family: ${(props) => props.theme.text.secondaryFont};
        /* color : white; */
        color : #09d1e3;
        font-size : 2rem;
        padding-bottom : 2rem;
    }

   
`

export default ApolloHighlightProducerSlideShow
