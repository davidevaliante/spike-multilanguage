import React, { useState, useEffect } from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import delay from 'lodash/delay'

interface Props {
    visible: boolean
    duration?: number
    style?: CSSProperties
}

const FadeInOut: FunctionComponent<Props> = ({ duration, visible, children }) => {

    const [show, setShow] = useState(true)

    useEffect(() => {
        if (!visible) {
            delay(() => {
                setShow(false)
            }, 301)
        } else {
            setShow(true)
        }
    }, [visible])

    return (
        <FadeInOutWrapper show={show} duration={duration} visible={visible}>
            {children}
        </FadeInOutWrapper>
    )
}

interface IFadeInOutWrapper {
    visible: boolean
    duration?: number
    show: boolean
}

const FadeInOutWrapper = styled.div`
    display : ${(props: IFadeInOutWrapper) => props.show ? 'block' : 'none'};
    transition : opacity ${(props: IFadeInOutWrapper) => `${props.duration ? props.duration : '.3'}s`} ease-in-out;
    opacity : ${(props: IFadeInOutWrapper) => props.visible ? 1 : 0};
`

export default FadeInOut
