import React, { Fragment, FunctionComponent, useContext } from "react"
import styled from 'styled-components'
import { Bonus } from "../../graphql/schema"
import { injectCDN } from './../../utils/Utils'
import LazyLoad from 'react-lazyload'
import { LocaleContext } from '../../context/LocaleContext'

interface Props {
    bonus: Bonus
}

const BonusPlayCard: FunctionComponent<Props> = ({ bonus }) => {

    const {t} = useContext(LocaleContext)
    
    return <Fragment>
        <Container bonus={bonus} onClick={() => window.open(bonus.link)}>
            <ImageContainer bonus={bonus}>
                <LazyLoad>
                    <img
                        src={injectCDN(bonus.circular_image.url)}
                        className='circular-image' />
                </LazyLoad>
                <div>
                    <p style={{ fontSize: '.5rem', marginTop: '.3rem' }}>{t("YOU CAN PLAY FOR REAL MONEY HERE")}</p>
                    <p>{bonus.description}</p>
                </div>

                <LazyLoad>
                    <img style={{ width: '16px', height: '16px', marginRight: '1rem' }} src='/icons/cheveron_right_white.svg' />
                </LazyLoad>
            </ImageContainer>
        </Container>
    </Fragment>
}

interface SecondaryBonusCardProps {
    bonus: Bonus
}

const Container = styled.div`
    cursor:pointer;
    width : 230px;
    display : flex;
    flex-direction : column;
    align-items:center;
    justify-content:center;
    margin : auto;
    position : relative;
    z-index : 10;
    border-radius : 6px;
    box-shadow: 5px 5px 5px -2px rgba(0,0,0,0.39);
    background : white;

    transition : all .5s ease-in;

    .circular-image{
        width : 36px;
        height : 36px;
        border : ${(props: SecondaryBonusCardProps) => `2px solid ${props.bonus.borderColor}`};
        border-radius : 50%;
        margin : .5rem;
    }
`

const ImageContainer = styled.div`
    background : ${(props: SecondaryBonusCardProps) => props.bonus.backgroundColor};
    width : 100%;
    display : flex;
    color : white;
    justify-content : space-evenly;
    align-items : center;
    border-radius : 6px;
    text-align : center;
    
    p{
        font-size : .8rem;
        margin-bottom : .3rem;
    }

`

export default BonusPlayCard