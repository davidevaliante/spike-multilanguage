import React, { useContext } from 'react'
import MarkdownProvider from './MarkdownProvider'
import ReactMarkdown from 'react-markdown'
import { injectCDN } from '../../utils/Utils'
import { Children, FunctionComponent } from 'react'
import ArticleBonus from './ArticleBonus'
import styled from 'styled-components'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import ArticleTable from './ArticleTable'
import SocialBanner from './../Banners/SocialBanner'
import LoadingSlotCard from './../Cards/LoadingSlotCard'
import LoadingVideoCard from './../Cards/LoadingVideoCard'
import { tablet } from '../Responsive/Breakpoints'
import { LocaleContext } from '../../context/LocaleContext'
import RtpDisplayer from '../Singles/RtpDisplayer'

interface Props {
    content: string
    style?: CSSProperties
    isBakeca?: boolean
    allowBonuses?: boolean
    slotRtp?: number
    slotImage?: string
}

const ArticleToMarkdown: FunctionComponent<Props> = ({
    content,
    style,
    isBakeca = false,
    allowBonuses,
    slotImage,
    slotRtp,
}) => {
    const replaceWithCustomElement = (props: any) => {
        const customCode = props.children[0].props.children[0].props.value
        const parts = customCode.toString().split('@')
        const elementType = parts[0]

        const elementData = parts[1]
        const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

        if (elementType === 'spikeBonusCard') {
            // if (allowBonuses) return <ArticleBonus bonusName={elementData} countryCode={"it"} />
            return <ArticleBonus bonusName={elementData} countryCode={'it'} />
        }

        if (elementType === 'spikeCompare') {
            // to remove bonuses we need this prop
            if (allowBonuses) {
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
            } else return <div></div>
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

        if (elementType === 'rtpChart' && slotRtp && slotImage) {
            return <RtpDisplayer rtp={slotRtp} image={slotImage} />
        }

        return <h1>{customCode}</h1>
    }

    const replaceLink = (props: any) => {
        if (props.href === 'https://vincipromo.it/wincasino/?mp=42794b32-7604-49d2-92d0-8adf67a6b173') {
            return (
                <a rel='nofollow' href={props.href}>
                    {props.children[0].props.children}
                </a>
            )
        }
        return <a href={props.href}>{props.children[0].props.children}</a>
    }

    return (
        <MarkdownProvider style={style}>
            <ReactMarkdown
                escapeHtml={false}
                renderers={{
                    blockquote: (props) => replaceWithCustomElement(props),
                    link: (props) => replaceLink(props),
                }}
                source={injectCDN(content)}
            />
        </MarkdownProvider>
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

const TableTop = styled.div`
    display: flex;
    background: ${(props) => props.theme.colors.primary};
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    margin: 0rem auto;
    justify-content: space-between;
    align-items: center;
    max-width: 550px;

    h4 {
        color: white;
        font-family: ${(props) => props.theme.text.secondaryFont};
        padding: 1rem;
        width: 80px;
    }
`

const TableTopDivider = styled.div`
    width: 2px;
    height: 40px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export default ArticleToMarkdown
