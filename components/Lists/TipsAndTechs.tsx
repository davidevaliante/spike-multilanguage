import React, { FunctionComponent } from "react"
import LazyImage from "../Lazy/LazyImage"
import ArticleToMarkdown from "../Markdown/ArticleToMarkdown"
import styled from "styled-components"

interface TipsProps {
    content: string
    type: 'tips' | 'tech'
}

const TipsAndTechs: FunctionComponent<TipsProps> = ({ content, type }) => {

    const extractData = () => {
        const copy = type === 'tips' ? content.split('@') : content.split('$')
        copy.splice(0, 1)
        return copy

    }

    const data = extractData()

    return (
        <TipsStyleProvider type={type}>
            <h1>{type === 'tips' ? 'Consigli di gioco' : 'Scheda Tecnica'}</h1>
            <div style={{ marginTop: '.5rem' }}>
                {data.map(t => <TipStripe>
                    <LazyImage
                        style={{ marginRight: '.5rem' }}
                        width={26}
                        height={26}
                        src={type === 'tips' ? '/icons/tips.svg' : '/icons/gears.svg'} />
                    <p><ArticleToMarkdown content={t} /></p>
                </TipStripe>)}
            </div>
        </TipsStyleProvider>
    )
}

interface ITips {
    type: 'tips' | 'tech',
    theme: any
}

const TipsStyleProvider = styled.div`
    display : flex;
    flex-direction : column;
    border : 2px solid ${(props: ITips) => props.type === 'tips' ? props.theme.colors.primary : '#1681fa'};
    padding : 1rem .5rem;
    border-radius : 6px;
    margin-top : 3rem;

    h1{
        color : ${(props: ITips) => props.type === 'tips' ? props.theme.colors.primary : '#1681fa'};
        font-weight : bold;
        padding : .7rem 1rem;
        text-align : center;
    }

    p{
        font-size : .75rem;
    }
`

const TipStripe = styled.div`
    display : flex;
    align-items : start;
`

export default TipsAndTechs