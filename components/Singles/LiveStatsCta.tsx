import React from 'react'
import { FunctionComponent } from 'react';
import styled from 'styled-components'
import { injectCDN } from '../../utils/Utils'
import { laptop, tablet } from './../Responsive/Breakpoints';
import  Router  from 'next/router'

interface Props {
    
}

const LiveStatsCta : FunctionComponent<Props> = (props: Props) => {

    const goToCrazyTime = () => Router.push('/live-stats/crazy-time/it')
    const goToMonopoly = () => Router.push('/live-stats/monopoly/it')

    return (
        <Container>
            <CTAImage onClick={goToCrazyTime} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/crazy_time_cta_27c89931a9.jpeg')}/>
            <CTAImageAnim className='pointer' onClick={goToMonopoly} src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly_active_e9d2a6d505.jpeg')}/>

            <ImgContainer>
                <CTAImage src={injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/dream_catcher_active_e3832ccd0d.jpeg')}/>    

                <img className='sticker' src='/icons/new_icon.svg'/>
            </ImgContainer>

        </Container>
    )
}

const Container = styled.div`
    max-width : 880px;
    display : flex;
    justify-content : space-around;
    margin-bottom : 3rem;
    
`

const ImgContainer = styled.div`
    position : relative;

    .pointer {
        cursor : pointer;
    }

    .sticker{
        position : absolute;
        top : -25px;
        right : -13px;
        width :45px;
        height : 45px;
        transform : rotate(25deg);
    }

    animation : animated 2s infinite;

    @keyframes animated {
        0% {
            transform : scale(1);
        }

        50% {
            transform : scale(1.05);
        }

        100% {
            transform : scale(1);
        }
    }
`

const CTAImage = styled.img`
    width : 260px;
    border-radius : 6px;
    box-shadow: 3px 3px 5px 3px #ccc;

    display : none;

    ${laptop} {
        display : block;
    }

   
`

const CTAImageAnim = styled.img`
    position : relative;
    cursor : pointer;
    width : 260px;
    border-radius : 6px;
    box-shadow: 3px 3px 5px 3px #ccc;  
`

export default LiveStatsCta
