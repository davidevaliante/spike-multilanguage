import React from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'

interface Props {
    text: string
    onClick?: any
}

const NewAnchorTag: FunctionComponent<Props> = ({ text, onClick }) => {
    return (
        <Container>
            <a onClick={onClick}>{text}</a>
            <img src='/icons/new_icon.svg' alt='new icon' />
        </Container>
    )
}

const Container = styled.div`
    position: relative;
    display: inline-block;

    img {
        position: absolute;
        top: -35px;
        right: -25px;
        width: 40px;
        height: 40px;
        transform: rotate(25deg);
    }
`

export default NewAnchorTag
