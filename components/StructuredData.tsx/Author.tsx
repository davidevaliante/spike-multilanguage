import React, { FunctionComponent, Fragment } from "react"
import styled from "styled-components"

interface IAuthor {
    articleType: "NewsArticle"
    headLine?: string
    images: string[]
    datePublished: string
    dateModified: string
}

const Author: FunctionComponent<IAuthor> = ({ articleType, headLine, images, datePublished, dateModified }) => {
    const AuthorObject = () => {
        return {
            "@context": "https://schema.org",
            "@type": articleType,
            headline: headLine,
            image: images,
            datePublished: datePublished,
            dateModified: dateModified,
            author: [
                {
                    "@type": "Person",
                    name: "SPIKE",
                    url: "https://spikeslot.com/spike/it",
                },
            ],
        }
    }

    return <script dangerouslySetInnerHTML={{ __html: JSON.stringify(AuthorObject()) }} type="application/ld+json" />
}

export default Author
