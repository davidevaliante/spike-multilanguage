import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react';
import { tablet } from '../Responsive/Breakpoints';

interface Props {
    style?: CSSProperties
}

const SocialBanner: FunctionComponent<Props> = ({ style }) => {
    return (
        <Container style={style}>
            <Icon onClick={() => window.open('https://www.instagram.com/spikeslot/')} src='/icons/instagram_icon.svg' alt='instagram icon' />
            <Icon onClick={() => window.open('https://www.facebook.com/spikeslot/')} src='/icons/facebook.svg' alt='facebook icon' />
            <Icon onClick={() => window.open('https://t.me/s/spikeslot')} src='/icons/telegram_icon.svg' alt='telegram icon' />
            <Icon onClick={() => window.open('https://www.youtube.com/channel/UCoXNe8H_Qyvaf_pJkDLIfiA')} src='/icons/youtube_icon.svg' alt='youtube icon' />
            <Icon onClick={() => window.open('https://www.youtube.com/channel/UCbV9mFVl29NkN48P5wpKhQw')} src='/icons/youtube_bar.svg' alt='youtube icon' />
            <Icon onClick={() => window.open('/contatti')} src='/icons/email.svg' alt='email icon' />
        </Container>
    )
}

const Icon = styled.img`
    all:initial;
    cursor : pointer;
    width : 50px !important;
    height : 50px !important;
    transition : all .3s ease;
    
    :hover{
        transform: scale(1.2);
    }

    ${tablet}{
        width : 70px !important;
        height : 70px !important;
    }
`

const Container = styled.div`
    width : 100%;
    display : flex;
    margin-bottom : 2rem;
    justify-content : space-around;
`

export default SocialBanner
