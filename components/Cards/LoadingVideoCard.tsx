import React, { CSSProperties, useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { AlgoliaVideo } from './../../graphql/schema'
import { FunctionComponent } from 'react'
import LazyVideoImage from './../Lazy/LazyVideoImage'
import truncate from 'lodash/truncate'
import snakeCase from 'lodash/snakeCase'
import { getColorForType, formatVideoCardType, formatVideoCardDate, replaceAll } from '../../utils/Utils'
import axios from 'axios'
import { firebaseDatabaseUrl } from '../../data/firebaseConfig'
import {countryContext} from '../../context/CountryContext'

interface Props {
    videoTitle: string
    newest?: boolean
    style?: CSSProperties
}

const LoadingVideoCard: FunctionComponent<Props> = ({ videoTitle }) => {

    const [videoData, setVideoData] = useState<undefined | AlgoliaVideo>(undefined)
    
    const {currentCountry} = useContext(countryContext)

    useEffect(() => {
        getVideoData()
    }, [])

    const getVideoData = async () => {
        const videoIdRequest = await axios.get(`${firebaseDatabaseUrl}/AwsVideoMappings/${snakeCase(replaceAll(videoTitle, '€', 'euro'))}.json`)
        try {
            const videoData = await (await axios.get(`${firebaseDatabaseUrl}/AwsVideosApproved/${videoIdRequest.data}.json`)).data

            if (videoData) setVideoData(videoData)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            {videoData && <CardContainer headerColor={getColorForType(videoData.slotType)}>
                <a href={`/videos/${snakeCase(replaceAll(videoData.title, '€', 'euro'))}/it`}>
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
                        <h6>{truncate(videoData.title, { 'length': 60 })}</h6>
                    </div>

                    <div className='desc-container'>
                        <p>{truncate(videoData.description, { 'length': 160 })}</p>
                    </div>
                </a>
            </CardContainer>}
        </div>

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
        font-family : ${(props) => props.theme.text.primaryFont};
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
            font-size : .8rem !important;   
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

        p{
            color : black;
            line-height : 1rem;
        }
    }

    h6{
        padding : .5rem;
        font-size : 1rem;
        font-family:  ${(props) => props.theme.text.primaryFont} !important;
        font-weight : bold;
        color : ${(props) => props.theme.colors.primary};
    }
`

export default LoadingVideoCard
