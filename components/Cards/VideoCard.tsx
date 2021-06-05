import React, { useContext, CSSProperties } from 'react'
import styled from 'styled-components'
import { AlgoliaVideo } from './../../graphql/schema'
import { FunctionComponent } from 'react'
import LazyVideoImage from './../Lazy/LazyVideoImage'
import truncate from 'lodash/truncate'
import snakeCase from 'lodash/snakeCase'
import { getColorForType, formatVideoCardType, formatVideoCardDate, replaceAll } from '../../utils/Utils'
import { countryContext } from '../../context/CountryContext'

interface Props {
    videoData: AlgoliaVideo
    newest?: boolean
    style?: CSSProperties
}

const VideoCard: FunctionComponent<Props> = ({ videoData }) => {

    const { currentCountry } = useContext(countryContext)
    return (
        <CardContainer headerColor={getColorForType(videoData.slotType)}>
            <a href={`/videos/${snakeCase(replaceAll(videoData.title, '€', 'euro'))}/${currentCountry}`}>
                <LazyVideoImage
                    alt={`${videoData.title} spike video`}
                    fromTop={100}
                    style={{ borderRadius: '0' }}
                    width={'100%'}
                    height={'166px'}
                    vid={videoData.videoId} />

                <div className='time-type'>
                    <p>{formatVideoCardDate(videoData.time)}</p>
                    <p className='type'>{formatVideoCardType(videoData.slotType)}</p>
                </div>

                <div className='header-container'>
                    <h3>{truncate(videoData.title, { 'length': 60 })}</h3>
                </div>

                <div className='desc-container'>
                    <p>{truncate(videoData.description, { 'length': 160 })}</p>
                </div>
            </a>
        </CardContainer>
    )
}

interface ICardContainer {
    headerColor: string
}

const CardContainer = styled.div`
    cursor : pointer;
    width : 300px;
    background : white;
    border-radius : 4px;
    margin : 1rem;
    border : 1px solid grey;
    transition : all .3s ease-in-out;
    box-shadow: 10px 10px 5px -8px rgba(0,0,0,0.35);

    a{
        color : black;
    }

    a:visited  {
       color : inherit;
    }

    :hover{
        transform : scale(1.1);
    }

    .time-type{
        display : flex;
        justify-content : space-between;    
        padding : .5rem;
        background : ${(props: ICardContainer) => props.headerColor};
        color : white;

        p{
            font-size : .8rem;  
        }

        .type{
            font-weight : bold;
        }
    }

    .header-container {
        display : flex;
        flex-direction : column;
        justify-content : center;
        height : 48px;
    }

    .desc-container{
        padding : .5rem;
    }

    h3{
        padding : .5rem;
        font-weight : bold;
        color : ${(props) => props.theme.colors.primary};
    }
`

export default VideoCard
