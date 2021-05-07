import React from 'react'
import { FunctionComponent } from 'react';
import { Bonus } from './../../graphql/schema';
import styled from 'styled-components'

interface Props {
    bonus : Bonus
}

const StickyBonus : FunctionComponent<Props> = ({bonus}) => {
    return (
        <Container>
            
        </Container>
    )
}

const Container = styled.div`
    height : 120px;
    position : absolute;
    background : peachpuff;
    bottom : 0;
    left : 0;
    width : 100%;
    z-index : 15;
`

export default StickyBonus
