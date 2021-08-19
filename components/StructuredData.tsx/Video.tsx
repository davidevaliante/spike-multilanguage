import React, { FunctionComponent, Fragment } from "react"
import styled from "styled-components"

interface IVideo {
    name: string
    thumbnailUrl: string
    description: string
    uploadDate: string
    embedUrl: string
}

const VideoMeta: FunctionComponent<IVideo> = ({ name, thumbnailUrl, description, uploadDate, embedUrl }) => {
    const VideoObject = () => ({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        description: description,
        name: name,
        thumbnailUrl: [thumbnailUrl],
        uploadDate: uploadDate,
        embedUrl: embedUrl,
    })

    console.log(VideoObject())

    return <script dangerouslySetInnerHTML={{ __html: JSON.stringify(VideoObject()) }} type="application/ld+json" />
}
// uploadDate: "2016-03-31T08:00:00+08:00"

export default VideoMeta
