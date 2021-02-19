import React, { Fragment, CSSProperties } from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { ApolloSlotCard } from '../../data/models/Slot'
import { laptop, tablet } from '../Responsive/Breakpoints'
import { AppTheme, appTheme } from '../../theme/theme'
import snakeCase from 'lodash/snakeCase'
import Link from 'next/link'
import SlotCardComponent from '../Cards/SlotCardComponent'
import Carousel from 'react-multi-carousel'
import { useTranslation } from "react-i18next"

interface Props {
    title: string
    icon?: string
    buttonText: string
    buttonRoute: string
    buttonRouteAs?: string
    mainColor?: string
    secondaryColor?: string,
    apolloSlotCards: ApolloSlotCard[],
    style?: CSSProperties,
}


const ApolloSlideShow: FunctionComponent<Props> = ({ title, buttonText, buttonRoute, buttonRouteAs, icon, apolloSlotCards, ...restProps }, ) => {
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
            items: 1,
        }
    };

    const { t } = useTranslation()

    return (
        <Fragment>
            <Container {...restProps}>
                {/* <ProducerLogo src='/icons/pragmatic_logo.png' /> */}
                <TitleAndIconContainer>
                    <h1>{t(title)}</h1>
                    {icon && <img alt={snakeCase(icon)} src={icon} />}
                </TitleAndIconContainer>
                {apolloSlotCards ? <Carousel
                    swipeable={true}
                    ssr={true}
                    autoPlay={true}
                    infinite={true}
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    arrows={false}
                    autoPlaySpeed={4000}
                    responsive={responsive}>
                    {apolloSlotCards.map((slotCard, index) =>
                        <div key={index}>
                            <SlotCardComponent slotCardData={slotCard} />
                        </div>
                    )}
                </Carousel> : <div>loading</div>}

                <Link href={buttonRoute} as={buttonRouteAs} passHref>
                    <ButtonSlider>
                        <a>
                            {t(buttonText)}
                        </a>

                        <img
                            alt='cheveron_right'
                            src='/icons/cheveron_right_white.svg'
                        />
                    </ButtonSlider>
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
    display : flex;
    justify-content : space-between;
    align-items : center;
    padding-bottom : 1.5rem;  

    img{
        width : 46px;
        height : 46px;
    }

    h1{
        font-family: ${(props) => props.theme.text.secondaryFont};
        /* color : white; */
        color : #fff;
        font-size : 2rem;
    }
`

const ButtonSlider = styled.div`
    cursor : pointer;
    display : flex;
    justify-content : flex-end;
    align-items : center;
    font-family : ${(props) => props.theme.text.secondaryFont};
    color : white; 
    padding : 1rem;
    
    img{
        width : 26px;
        height : 26px;
    }

`

const Container = styled.div`
    width : 300px;
    padding : 1rem;
    /* background : ${(props) => props.theme.colors.primary}; */
    background : ${(props: ContainerProps) => props.mainColor};
    border : ${(props: ContainerProps) => props.secondaryColor ? `5px solid ${props.secondaryColor}` : `5px solid ${props.theme.colors.primary}`};
    border-radius : 4px;
    position : relative;
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
        padding-bottom : 0rem;
        margin-left : 0;
    }
`

ApolloSlideShow.defaultProps = {
    mainColor: appTheme.colors.primary,
}

export default ApolloSlideShow