import React, { useState } from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'
import { FunctionComponent } from 'react'
import LazyImage from '../Lazy/LazyImage'
import itLocale from 'date-fns/locale/it'
import { laptop } from '../Responsive/Breakpoints'
import { replaceAll } from '../../utils/Utils'

interface Props {
    title: string
    time: number
    description: string
}

const palette = {
    darkBg: '#2e2e2e',
    extraDarkBg: '#1c1c1c',
    red: '#f95565',
}

const VideoMainData: FunctionComponent<Props> = ({ title, time, description }) => {
    const [descriptionOpen, setDescriptionOpen] = useState(false)

    console.log(description)
    console.log(replaceAll(description, 'u0001', '<br>'))

    return (
        <div>
            <VideoDataContainer descriptionOpen={descriptionOpen}>
                <div className='title-and-date'>
                    <h1>{title}</h1>
                    <h2>{`${format(time, 'd MMMM yyyy', { locale: itLocale })}`}</h2>
                </div>

                {!descriptionOpen && (
                    <LazyImage
                        onClick={() => setDescriptionOpen(!descriptionOpen)}
                        width={32}
                        height={32}
                        style={{ marginRight: '1rem', marginBottom: '.5rem', cursor: 'pointer' }}
                        alt='chevron down'
                        src={'/icons/chevron_down_white.svg'}
                    />
                )}

                {descriptionOpen && (
                    <LazyImage
                        onClick={() => setDescriptionOpen(!descriptionOpen)}
                        width={32}
                        height={32}
                        style={{ marginRight: '1rem', marginBottom: '.5rem', cursor: 'pointer' }}
                        alt='chevron down'
                        src={'/icons/chevron_up_white.svg'}
                    />
                )}
            </VideoDataContainer>
            {descriptionOpen && (
                <DescriptionContainer
                    dangerouslySetInnerHTML={{
                        __html: description.split('\u0001').join('<br/>'),
                    }}
                ></DescriptionContainer>
            )}
        </div>
    )
}

const DescriptionContainer = styled.div`
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    background: white;
    margin: 0rem 1rem;
    padding: 1.5rem;
    z-index: 1;
    line-height: 1.2rem;
    ${laptop} {
        margin: 0rem 2rem;
    }
`

interface IVideoDataContainer {
    descriptionOpen: boolean
}

const VideoDataContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    background: ${palette.darkBg};
    align-items: flex-end;
    border-radius: 6px;
    margin: 0rem 0rem;
    box-shadow: 9px 9px 8px -4px rgba(249, 85, 101, 1);
    z-index: 2;

    ${laptop} {
        margin: ${(props: IVideoDataContainer) => (props.descriptionOpen ? '1rem 0rem 0rem 0rem' : '1rem 0rem')};
    }

    .title-and-date {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        h1 {
            font-size: 1.3rem;
            color: white;
            padding: 1rem;
            font-family: ${(props) => props.theme.text.secondaryFont};
            padding-bottom: 0.2rem;

            ${laptop} {
                font-size: 1.5rem;
            }
        }

        h2 {
            color: white;
            font-size: 1rem;
            font-family: ${(props) => props.theme.text.primaryFont};
            width: 100%;
            margin: 0.5rem;
            margin-right: 1rem;
            text-align: end;
        }
    }
`

export default VideoMainData
