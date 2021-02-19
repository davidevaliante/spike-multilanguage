import React, { CSSProperties, FunctionComponent, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'

interface Props {
    onClick?: () => void
    onVisibilityChanged?: (visible: boolean) => void
    fromTop?: number
    fromBottom?: number
    fromRight?: number
    fromLeft?: number
    once?: boolean
    style?: CSSProperties
    className?: string
    show?: boolean
    src?: string
    alt?: string
    withPlaceholder?: boolean
}
const LazyComponent: FunctionComponent<Props> = ({
    fromTop = '0',
    fromRight = '0',
    fromBottom = '0',
    fromLeft = '0',
    once = true,
    onVisibilityChanged,
    onClick,
    style,
    className,
    src,
    withPlaceholder = false,
    children
}) => {

    const [imageSrc, setImageSrc] = useState(src)
    const [_inView, setInView] = useState(false)
    const [fadeIn, setFadeIn] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const _rootMargin = `${fromTop}px ${fromRight}px ${fromBottom}px ${fromLeft}px`

    const [ref, inView, entry] = useInView({
        rootMargin: _rootMargin,
        threshold: 0,
        triggerOnce: once,
    })
    useEffect(() => {
        onVisibilityChanged && onVisibilityChanged(inView)
        setInView(inView)
    }, [inView])

    return (
        <LazyLoadComponentWrapper
            ref={ref}
            onClick={() => onClick && onClick()}
            style={style}
        >
            {!_inView && withPlaceholder && <div style={style} className='transparent-div'></div>}
            {_inView && { children }}
        </LazyLoadComponentWrapper>
    )
}


const LazyLoadComponentWrapper = styled.div`
    position : relative;
    box-sizing: border-box;

    .fade-in{
        opacity : 1;
        transition : all .3s ease-in;
    }

    .transparent-div{
        position : absolute;
        top:0;
        left:0;
        background : transparent;
    }
`
export default LazyComponent