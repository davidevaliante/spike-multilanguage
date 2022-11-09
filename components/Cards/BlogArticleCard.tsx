import React, { useContext } from 'react'
import styled from 'styled-components'
import { Article } from './../../graphql/schema'
import { FunctionComponent } from 'react'
import Link from 'next/link'
import LazyImage from '../Lazy/LazyImage'
import { injectCDN } from './../../utils/Utils'
import { format } from 'date-fns'
import { LocaleContext } from '../../context/LocaleContext'
import Image from 'next/image'

interface Props {
    article: Article
}

const BlogArticleCard: FunctionComponent<Props> = ({ article }) => {
    const { t, contextCountry } = useContext(LocaleContext)

    return (
        <StyleProvider>
            <Link href={`/blog/[slug]/[countryCode]`} as={`/blog/${article.slug}/${contextCountry}`}>
                <a>
                    <CardContainer>
                        <Image objectFit='cover' width={270} height={200} src={injectCDN(article.image?.url!)} />

                        <div style={{ height: '64px', display: 'flex', alignItems: 'center' }}>
                            <h3>{article.title}</h3>
                        </div>
                        <Divider />
                        <p style={{ textAlign: 'end', margin: '.5rem', fontSize: '.8rem' }}>{`${t(
                            'Published on'
                        )} ${format(new Date(article.created_at), 'dd/MM/yyyy')}`}</p>
                    </CardContainer>
                </a>
            </Link>
        </StyleProvider>
    )
}

const Divider = styled.div`
    width: 100%;
    height: 2px;
    color: grey;
`

const StyleProvider = styled.div`
    a {
        color: black;
    }
`

const CardContainer = styled.div`
    width: 270px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    margin-bottom: 1rem;
    h3 {
        color: ${(props) => props.theme.colors.primary};
        font-weight: bold;
        padding: 1rem 0.5rem;
    }

    border: 1px solid grey;
    border-radius: 6px;

    :hover {
        transform: scale(1.05);
    }
`

export default BlogArticleCard
