import { CircularProgress } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

interface Props {
    
}

const FullPageLoader = (props: Props) => {
    return (
        <Wrapper>
              <img src='/gifs/spike-loader.gif' />
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width : 100vw;
    height : 100vh;
    display : flex;
    justify-content : center;
    align-items : center;
`

export default FullPageLoader
