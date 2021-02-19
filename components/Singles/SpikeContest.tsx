import React from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import Router from 'next/router'

interface Props {
}

const SpikeContest: FunctionComponent<Props> = ({ }) => {

    const handleClick = () => {
        Router.push('/blog/spike-christmas-giveaway/it')
    }
    return (
        <Container onClick={handleClick}>
            <img width={'90%'} src='https://spike-images.s3.eu-central-1.amazonaws.com/contest_natale_immagine_0f16bc0307.png' />
            <div className='button'>
                <p>Partecipa al contest della Live Natalizia</p>
                <img height='20px' width='20px' style={{ marginLeft: '1rem' }} src='/icons/cheveron_right_white.svg' />
            </div>
        </Container>
    )
}

const Container = styled.div`
    cursor : pointer;
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    margin : 2rem 0rem;
    border-radius : 3px;

    img{
        border-top-left-radius : 5px;
        border-top-right-radius : 5px;
    }

    .button{
        box-sizing : border-box;
        width : 90%;
        background : ${(props) => props.theme.colors.primary};
        color : white;
        font-weight : bold;
        text-align : center;
        display : flex;
        padding : 1rem 1rem;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius : 5px;
        justify-content : center;
        align-items : center;
    }
`

export default SpikeContest
