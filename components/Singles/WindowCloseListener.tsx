import React, { useEffect, useState } from 'react'
import { useHover } from '../../hooks/useHover'
import styled from 'styled-components'

interface Props {
    onGoOutside: () => void
}

const WindowCloseListener = ({ onGoOutside }) => {

    const [isGoingOutside, setIsGoingOutside] = useState(false)

    const [hoverRef, isHovered] = useHover()

    useEffect(() => {
        if (isHovered && isGoingOutside === false) {
            setIsGoingOutside(true)
            onGoOutside()
        }
    }, [isHovered])

    return (
        // @ts-ignore
        <Wrapper ref={hoverRef} />
    )
}

const Wrapper = styled.div`
    position : fixed;
    width : 100vw;
    height : 1px;
    z-index : 999;
    top : 0;
    left : 0;
    background : transparent;
`

export default WindowCloseListener
