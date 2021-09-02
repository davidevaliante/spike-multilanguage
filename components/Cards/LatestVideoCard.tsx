import React, { CSSProperties, useEffect, useState, useContext } from "react"
import styled from "styled-components"
import { FunctionComponent } from "react"
import { getLatestVideo } from "./../../data/api/video"
import { AwsVideoApproved } from "./../../data/models/AwsVideoApproved"
import LazyLoad from "react-lazyload"
import Link from "next/link"
import { snakeCase } from "lodash"
import { countryContext } from "../../context/CountryContext"
import { LocaleContext } from "./../../context/LocaleContext"

interface Props {
    style?: CSSProperties
    videoData?: AwsVideoApproved
}

const LatestVideoCard: FunctionComponent<Props> = ({}) => {
    const { contextCountry } = useContext(LocaleContext)

    const [videoData, setVideoData] = useState<AwsVideoApproved | undefined>(undefined)

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const latestVideo = await getLatestVideo()
        setVideoData(latestVideo)
    }

    return videoData !== undefined ? (
        <AnimatedBorder>
            <div className="rainbow">
                <Link
                    href={`/videos/[slug]/[countryCode]`}
                    as={`/videos/${snakeCase(videoData.title)}/${contextCountry}`}
                >
                    <a>
                        <Container>
                            <LazyLoad>
                                <img
                                    alt="latest video image"
                                    src={`https://firebasestorage.googleapis.com/v0/b/spike-2481d.appspot.com/o/VideoThumbnails%2Fvideo_${videoData?.videoId}?alt=media`}
                                />
                            </LazyLoad>

                            <h1>{videoData.title}</h1>
                        </Container>
                    </a>
                </Link>
            </div>
        </AnimatedBorder>
    ) : (
        <div></div>
    )
}

const Container = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    position: relative;

    h1 {
        font-family: ${(props) => props.theme.text.secondaryFont};
        padding: 1rem 0.5rem;
        color: ${(props) => props.theme.colors.primary};
    }

    img {
        width: 100%;
    }
`

const AnimatedBorder = styled.div`
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    @keyframes rotate {
        100% {
            transform: rotate(1turn);
        }
    }

    .rainbow {
        position: relative;
        z-index: 0;
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        padding: 6px;

        &::before {
            content: "";
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background-color: #399953;
            background-repeat: no-repeat;
            background-size: 50% 50%, 50% 50%;
            background-position: 0 0, 100% 0, 100% 100%, 0 100%;
            background-image: linear-gradient(#399953, #399953), linear-gradient(#fbb300, #fbb300),
                linear-gradient(#d53e33, #d53e33), linear-gradient(#662e9b, #662e9b);
            animation: rotate 4s linear infinite;
        }

        &::after {
            content: "";
            position: absolute;
            z-index: -1;
            left: 6px;
            top: 6px;
            width: calc(100% - 12px);
            height: calc(100% - 12px);
            background: white;
            border-radius: 5px;
        }
    }
`

export default LatestVideoCard
