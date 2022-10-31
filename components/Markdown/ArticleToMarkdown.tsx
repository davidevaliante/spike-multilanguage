import React, { useContext } from 'react'
import MarkdownProvider from './MarkdownProvider'
import { injectCDN } from '../../utils/Utils'
import { FunctionComponent, Children } from 'react'
import ArticleBonus from './ArticleBonus'
import styled from 'styled-components'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import ArticleTable from './ArticleTable'
import SocialBanner from './../Banners/SocialBanner'
import LoadingSlotCard from './../Cards/LoadingSlotCard'
import LoadingVideoCard from './../Cards/LoadingVideoCard'
import { tablet } from '../Responsive/Breakpoints'
import { LocaleContext } from '../../context/LocaleContext'
import Markdown from 'markdown-to-jsx'
import MardownStyleProvider from '../commons/MardownStyleProvider'

interface Props {
    content?: string
    style?: CSSProperties
    isBakeca?: boolean
    allowBonuses?: boolean
}

const ArticleToMarkdown: FunctionComponent<Props> = ({ content, style, isBakeca = false, allowBonuses }) => {
    const replaceWithCustomElement = (props: any) => {
        const customCode = props.children[0].props.children[0].props.value
        const parts = customCode.toString().split('@')
        const elementType = parts[0]

        const elementData = parts[1]
        const {
            t,
            appCountry: contextCountry,
            setAppCountry: setContextCountry,
            userCountry,
            setUserCountry,
        } = useContext(LocaleContext)

        if (elementType === 'spikeBonusCard') {
            // if (allowBonuses) return <ArticleBonus bonusName={elementData} countryCode={"it"} />
            return <ArticleBonus bonusName={elementData} countryCode={'it'} />
        }

        if (elementType === 'spikeCompare') {
            // to remove bonuses we need this prop
            // if (allowBonuses) {

            // } else return <div></div>;
            const bonusNames = elementData.split('&').map((bonusName) => {
                if (bonusName === 'Slot Yes') {
                    return 'AdmiralBet'
                }

                return bonusName
            })
            return (
                <Wrapper>
                    {bonusNames &&
                        bonusNames.map((name) => (
                            <ArticleBonus
                                style={{ margin: '.7rem auto' }}
                                key={`compare_${name}`}
                                bonusName={name}
                                countryCode={contextCountry ? contextCountry : 'it'}
                                isBakeca={isBakeca}
                            />
                        ))}
                </Wrapper>
            )
        }

        if (elementType === 'spikeVideo') {
            console.log(props.children[0].props.children[0].props.children)
            const videoLink = props.children[0].props.children[0].props.children.split('@')[1]
            return (
                <video controls preload='metadata'>
                    <source src={`${videoLink}#t=0.5`} type='video/mp4'></source>
                </video>
            )
        }

        if (elementType === 'spikeTable') {
            return <ArticleTable tableString={elementData} />
        }

        if (elementType === 'spikeSocialBanner') {
            return <SocialBanner />
        }

        if (elementType === 'spikeSlotCards') {
            const slotNames = elementData.split('&')
            return (
                <SlotNameContainer>
                    {slotNames.map((name) => (
                        <LoadingSlotCard key={`inline_slot_${name}`} slotName={name} />
                    ))}
                </SlotNameContainer>
            )
        }

        if (elementType === 'spikeVideoCards') {
            const videoNames = elementData.split('&')
            return (
                <SlotNameContainer>
                    {videoNames.map((title) => (
                        <LoadingVideoCard key={`inline_video_${title}`} videoTitle={title} />
                    ))}
                </SlotNameContainer>
            )
        }

        if (elementType === 'imageButton') {
            const imageButtonData = elementData.split(',')

            const imageLink = imageButtonData.find((d) => d.includes('img='))?.split('img=')[1]
            const link = imageButtonData.find((d) => d.includes('link='))?.split('link=')[1]
            const width = imageButtonData.find((d) => d.includes('width='))

            return (
                <div style={{ textAlign: 'center', margin: '2rem 0rem' }}>
                    <a href={`https://${link}`}>
                        <ImageButton width={`${width.split('width=')[1]}px`} src={`https://${imageLink}`} />
                    </a>
                </div>
            )
        }

        if (elementType === 'googleForm') {
            console.log(elementData)
            const link = elementData
            return (
                <iframe
                    width={'100%'}
                    height={'1450px'}
                    style={{ marginTop: '2rem' }}
                    src='https://docs.google.com/forms/d/e/1FAIpQLSeBOYGD66e_zs29HG36OJjFe2851Yiqh0cveG3BvU5pOSTh0Q/viewform'
                />
            )
        }

        return <h1>{customCode}</h1>
    }

    const replaceLink = (props: any) => {
        if (props.href === 'https://vincipromo.it/wincasino/?mp=42794b32-7604-49d2-92d0-8adf67a6b173')
            return (
                <a rel='nofollow' href={props.href}>
                    {props.children[0].props.children}
                </a>
            )
        return <a href={props.href}>{props.children[0].props.children}</a>
    }

    return (
        <MardownStyleProvider>
            <Markdown
            // options={{
            //     overrides: {
            //         blockquote: {
            //             component: MyParagraph,
            //             props: {
            //                 className: 'foo',
            //             },
            //         },
            //     },
            // }}
            >
                {content ? content : ''}
            </Markdown>
        </MardownStyleProvider>
    )
}

const ImageButton = styled.img`
    width: 100%;

    ${tablet} {
        width: ${(props) => props.width} !important;
    }
`

const Wrapper = styled.div`
    margin: 1rem 0rem;
`

const SlotNameContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 1rem 0rem;
`

export default ArticleToMarkdown
