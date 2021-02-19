import React, { FunctionComponent, Fragment } from "react"
import { AlgoliaVideo } from "../../graphql/schema"
import VideoCard from './../Cards/VideoCard'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'

interface VideoListProps {
    videoList: AlgoliaVideo[] | undefined
    showNewest: boolean
}

const VideoListComponent: FunctionComponent<VideoListProps> = ({ videoList, showNewest }) => {

    const {t} = useTranslation()

    if (videoList === undefined || videoList.length === 0) return <h1>{t("The search returned no results")}</h1>

    return (
        <Fragment>
            <CardContainer>
                {videoList.map((video, index) => (
                    <VideoCard
                        key={`${video.title}_${index}`}
                        videoData={video}
                        newest={showNewest && index === 0} />
                ))}
            </CardContainer>

        </Fragment>
    )
}

const CardContainer = styled.div`
    display : flex;
    flex-wrap : wrap;
    justify-content : center;
`

export default VideoListComponent