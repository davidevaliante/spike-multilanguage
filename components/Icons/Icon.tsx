import React from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { AppTheme } from '../../theme/theme'

interface Props {
    width: string | number
    height: string | number
    style?: CSSProperties
    source: string
}

const Icon: FunctionComponent<Props> = ({ width, height, source, style }) => {
    return <StyledImage src={source} width={width} height={height} style={style} />
}

interface StyledProps {
    width: string | number
    height: string | number
    theme: AppTheme

}

const StyledImage = styled.img`
    width: ${(props: StyledProps) => {
        if (typeof props.width === 'number') return `${props.width}px`
        if (typeof props.width === 'string') return props.width
    }};
    height: ${(props: StyledProps) => {
        if (typeof props.width === 'number') return `${props.height}px`
        if (typeof props.width === 'string') return props.height
    }};
`

export default Icon
