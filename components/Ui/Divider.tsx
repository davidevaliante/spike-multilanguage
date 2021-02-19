
import { FunctionComponent, Fragment, CSSProperties } from 'react'
import styled from 'styled-components'

interface Props {
    vertical?: boolean
    thickness?: number
    color?: string
    style?: CSSProperties
}

const Divider: FunctionComponent<Props> = ({ vertical, thickness, color, style }) => {

    return <Fragment>
        <DividerElement
            style={style}
            vertical={vertical}
            thickness={thickness}
            color={color} />
    </Fragment>
}

const DividerElement = styled.div`
    height : ${(props: Props) => props.vertical ? `${props.thickness}px` : '100%'};
    width : ${(props: Props) => !props.vertical ? `${props.thickness}px` : '100%'};
    background : ${(props: Props) => props.color};
`

Divider.defaultProps = {
    vertical: true,
    thickness: 1,
    color: '#ffffff'
}

export default Divider