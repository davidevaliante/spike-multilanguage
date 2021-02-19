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
    alt?: string
    width: string | number
    height?: string | number
    withPlaceholder?: boolean
    vid: string
}
const LazyVideoImage: FunctionComponent<Props> = ({
    fromTop = '0',
    fromRight = '0',
    fromBottom = '0',
    fromLeft = '0',
    once = true,
    onVisibilityChanged,
    onClick,
    style,
    className,
    width,
    height,
    withPlaceholder = false,
    alt,
    vid
}) => {

    const [imageSrc, setImageSrc] = useState(`https://firebasestorage.googleapis.com/v0/b/spike-2481d.appspot.com/o/VideoThumbnails%2Fthumb_500_${vid}?alt=media`)
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
        <LazyLoadWrapper
            vid={vid}
            ref={ref}
            onClick={() => onClick && onClick()}
            onError={() => setImageSrc(`https://firebasestorage.googleapis.com/v0/b/spike-2481d.appspot.com/o/VideoThumbnails%2Fvideo_${vid}?alt=media`)}
            show={_inView}
            width={width}
            style={style}
            height={height}>
            {!_inView && withPlaceholder && <div style={style} className='grey-div'></div>}


            <img
                style={style}
                className={`image ${_inView ? 'fade-in' : ''} ${className ? className : ''}`}
                onLoad={() => setImageLoaded(true)}
                src={_inView ? imageSrc : ''}
                alt={alt && alt} />

        </LazyLoadWrapper>
    )
}


const LazyLoadWrapper = styled.div`
    position : relative;
    box-sizing: border-box;
    width : ${(props: Props) => {
        if (typeof props.width === 'string') return props.width
        if (typeof props.width === 'number') return `${props.width}px`
    }};
    height : ${(props: Props) => props.height ? props.height : '86px'};

    .image{
        width : ${(props: Props) => {
        if (typeof props.width === 'string') return props.width
        if (typeof props.width === 'number') return `${props.width}px`
    }};
        border-top-left-radius : 6px;
        border-bottom-left-radius : 6px;
        height : ${(props: Props) => props.height ? props.height : '86px'};
        opacity:0;
        transition : all .3s ease-in;
    }

    .fade-in{
        opacity : 1;
        transition : all .3s ease-in;
    }

    .grey-div{
        position : absolute;
        top:0;
        left:0;
        width : ${(props: Props) => {
        if (typeof props.width === 'string') return props.width
        if (typeof props.width === 'number') return `${props.width}px`
    }};
    
    height : ${(props: Props) => {
        if (typeof props.height === 'string') return props.height
        if (typeof props.height === 'number') return `${props.height}px`
    }};
        background : lightgrey;
        border-radius : 4px;
    }
`
export default LazyVideoImage