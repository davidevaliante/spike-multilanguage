import React,{useContext} from 'react'
import styled from 'styled-components'
import { AlgoliaVideo } from './../../graphql/schema'
import { FunctionComponent } from 'react'
import LazyVideoImage from './../Lazy/LazyVideoImage'
import { tablet } from '../Responsive/Breakpoints'
import { formatVideoCardDate, getColorForType } from '../../utils/Utils'
import { formatVideoCardType } from './../../utils/Utils'
import Link from 'next/link'
import snakeCase from 'lodash/snakeCase'
import {countryContext} from '../../context/CountryContext'
import {useTranslation} from 'react-i18next'

interface Props {
    videoData: AlgoliaVideo
}

const LatestVideoCardList: FunctionComponent<Props> = ({ videoData }) => {

    const {currentCountry} = useContext(countryContext)
    const { t } = useTranslation();

    return (
        <Link href={`/videos/${snakeCase(videoData.title)}/${currentCountry}`}>
            <a>
                <CardContainer>
                    <div className="ribbon">
                        <p className='scale'>{t("New")}</p>
                    </div>
                    <LazyVideoImage
                        alt={`${videoData.title} spike video`}
                        className='image'
                        width={350}
                        height={'198px'}
                        vid={videoData.videoId} />

                    <DataContainer typeTextColor={getColorForType(videoData.slotType)}>
                        <h2>{videoData.title}</h2>
                        <p>{formatVideoCardDate(videoData.time)}</p>
                        <p className='slot-type'>{formatVideoCardType(videoData.slotType)}</p>
                    </DataContainer>
                </CardContainer>
            </a>
        </Link>

    )
}

interface IDataContainer {
    typeTextColor: string
}

const DataContainer = styled.div`
    display :flex;
    flex-direction : column;
    justify-content : center;
    background: #525252;
    width : 350px;
    border-bottom-left-radius : 6px;
    border-bottom-right-radius: 6px;    

    ${tablet}{
        border-top-right-radius : 6px;
        border-top-left-radius : 0px;
        border-bottom-left-radius : 0px;
    }
    
    h2{
        text-align:center;
        font-family : ${(props) => props.theme.text.secondaryFont};
        /* color : ${(props) => props.theme.colors.primary};        */
        color : white;      
        padding : 1rem;     
        letter-spacing : .2rem;
    }

    p{
        padding :1rem;
        text-align : center;
        color : #ffc42e;
    }

    .slot-type{
        color : ${(props: IDataContainer) => props.typeTextColor};
        font-weight : bold;
    }
`

const CardContainer = styled.div`
    cursor : pointer;
    display : inline-flex;  
    flex-wrap : wrap;
    margin : 1rem auto;
    position : relative;
    max-width : 350px;

    ${tablet}{
        max-width : none;
    }

    .image{
        border-top-left-radius : 6px;
        border-top-right-radius : 6px;
        border-bottom-left-radius : 0px;

        ${tablet}{
            border-top-right-radius : 0px;
            border-top-left-radius : 6px;
            border-bottom-left-radius : 6px;
        }
    }

    .ribbon{
        position:absolute;
        top:10px;
        left : 14px;
        padding: 0 0.5em;
        font-size:1.3rem;
        margin: 0 0 0 -0.625em;
        line-height: 1.875em;
        color: white;
        border-radius: 0 0.156em 0.156em 0;
        background: ${(props) => props.theme.colors.primary};
        box-shadow: -1px 2px 3px rgba(0,0,0,0.5);
        z-index : 10;
    }

    .scale{
        animation : scale 1s infinite;    
        color : white;        
    }

    @keyframes scale {
        0%{
            transform : scale(1);
        }

        50%{
            transform : scale(1.1);
        }

        100%{
            transform : scale(1);
        }
    }

    .ribbon:before, .ribbon:after{
        position:absolute;
        content: '';
        display: block;
    }

    .ribbon:before{
        width: 0.469em;
        height: 100%;
        padding: 0 0 0.438em;
        top:0;
        left: -0.469em;
        background:inherit;
        border-radius: 0.313em 0 0 0.313em;
    }

    .ribbon:after{
        width: 0.313em;
        height: 0.313em;
        background: rgba(0,0,0,0.35);
        bottom: -0.313em;
        left: -0.313em;
        border-radius: 0.313em 0 0 0.313em;
        box-shadow: inset -1px 2px 2px rgba(0,0,0,0.3);
    }
`

export default LatestVideoCardList
