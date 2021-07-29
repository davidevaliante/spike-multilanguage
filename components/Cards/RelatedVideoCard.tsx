import React, { FunctionComponent,useContext } from "react"
import { Video } from "../../graphql/schema"
import snakeCase from "lodash/snakeCase"
import LazyVideoImage from "../Lazy/LazyVideoImage"
import styled from 'styled-components'
import { laptop } from "../Responsive/Breakpoints"
import { replaceAll } from "../../utils/Utils"
import {countryContext} from '../../context/CountryContext'

interface RelatedVideosProps {
    videoData: Video
}

const RelatedVideoCard: FunctionComponent<RelatedVideosProps> = ({ videoData }) => {

    const {currentCountry} = useContext(countryContext)
    
    const typeToString = (type: 'GRATIS' | 'BAR' | 'VLT') => {
        if (type === 'GRATIS') return 'SLOT ONLINE'
        if (type === 'BAR') return 'SLOT BAR'
        if (type === 'VLT') return 'SLOT VLT'
    }

    return (
        <a href={`/videos/${snakeCase(replaceAll(videoData.title, '€', 'euro'))}/${currentCountry}`}>
            <Container>
                <LazyVideoImage width={150} height={'87px'} vid={videoData.videoId} />
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '.5rem', 
                    justifyContent: 'space-around' 
                }}>
                    <h3>{videoData.title}</h3>
                    <h4>{typeToString(videoData.slotType)}</h4>
                </div>
            </Container>
        </a>
    )
}

const Container = styled.div`
    cursor : pointer;
    display : flex;
    background : white;
    margin : 1rem; 
    border-radius : 6px;    
    max-width : 350px;
    h3{
        color : black;
        font-size : .8rem;
    }

    h4{
        color : ${(props) => props.theme.colors.primary};
        font-size : .8rem;
    }

    ${laptop}{
        margin-bottom : .5rem;
    }
`

export default RelatedVideoCard