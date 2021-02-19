import React, { FunctionComponent, Fragment } from "react"
import styled from 'styled-components'


const Example: FunctionComponent = () => {
    return <Fragment>
        <Box isGreen={true} />
    </Fragment>
}

interface BoxProps {
    isGreen?: boolean
}

const Box = styled.div<BoxProps>`
    width : 100px;
    height : 100px;
    background : ${(props) => props.isGreen ? 'green' : 'red'};
`

export default Example