import React from 'react'
import { FunctionComponent } from 'react';
import styled from 'styled-components'

interface Props {
    href : string,
    text : string
}

const NewAnchorTag : FunctionComponent<Props> = ({href, text}) => {
    return (
        <Container>
            <a href={href}>
                {text}
            </a>

            <img src='/icons/new_icon.svg'/>
        </Container>

    )
}

const Container = styled.div`
    position : relative;
    display : inline-block;

    img{
        position : absolute;
        top : -25px;
        right : -13px;
        width :30px;
        height : 30px;
        transform : rotate(25deg);
    }
`

export default NewAnchorTag
