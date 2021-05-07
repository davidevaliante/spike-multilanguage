import React, { Fragment, useState, useContext } from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import Divider from '../Ui/Divider'
import Link from 'next/link'
import LazyImage from '../Lazy/LazyImage'
import ArticleToMarkdown from '../Markdown/ArticleToMarkdown'
import { LocaleContext } from './../../context/LocaleContext';

interface Props {
    topArticle: string
}

const HomeHeader: FunctionComponent<Props> = ({ topArticle }) => {
    const { t, contextCountry } = useContext(LocaleContext)

    const [disclaimerOpen, setDisclaimerOpen] = useState(false)

    return (
        <Fragment>
            <DescriptionContainer>
                <HeaderAndButtonContainer>
                    <HeaderContainer>
                        <h1>SPIKE SLOTs</h1>
                        <LazyImage
                            style={{ marginLeft: '1rem', cursor: 'pointer' }}
                            width={16}
                            height={16}
                            onClick={() => setDisclaimerOpen(!disclaimerOpen)}
                            alt='alert icon'
                            src='/icons/alert.svg' />
                    </HeaderContainer>

                    <Link href={'/slots/[countryCode]'} as={`/slots/${contextCountry}`}>
                        <a>
                            <div>
                                <GoToFullSlotListButton>
                                    <h2>{t('Go to the full list of slots')}</h2>
                                    <LazyImage
                                        style={{ marginLeft: '1rem' }}
                                        width={36}
                                        height={36}
                                        alt='777_slot_icon'
                                        src='/icons/jackpot_slot_icon.svg' />
                                    <LazyImage
                                        style={{ marginLeft: '1rem' }}
                                        width={26}
                                        height={26}
                                        alt='arrow_right_icon'
                                        src='/icons/cheveron_right_white.svg' />
                                </GoToFullSlotListButton>
                            </div>
                        </a>
                    </Link>
                </HeaderAndButtonContainer>
                {disclaimerOpen && <div>
                    <p className='disclaimer'>{t("HomeHeaderDisclaimer")}</p>
                </div>}
                <Divider color='#a8a8a8' style={{ marginBottom: '1.5rem' }} />

                <ArticleToMarkdown content={topArticle} />

            </DescriptionContainer>
        </Fragment >
    )
}

const DescriptionContainer = styled.div`
    padding : 1rem 1rem;

    h1{
        color : ${(props) => props.theme.colors.primary};
        font-family: ${(props) => props.theme.text.secondaryFont};
        font-size : 2rem;
        letter-spacing : .1rem; 
    }

    p{
        margin-bottom : 1rem;
        font-size : 90%;
    }

    .disclaimer {
        font-size : 80%;
    }
    
    .header-desc {
        margin : 1rem 0rem;
        line-height : 1.3rem;

        strong{
            font-family : ${(props) => props.theme.text.secondaryFont};
            color : ${(props) => props.theme.colors.primaryDark};
            font-size : 1rem;
        }
     
        .bolder{
            font-weight : bold;
        }

        .strong-secondary{
            cursor : pointer;
            font-family : ${(props) => props.theme.text.secondaryFont};
            color : ${(props) => props.theme.colors.secondary};
            font-size : 1rem;
        }

        .strong-terziary{
            cursor : pointer;
            font-family : ${(props) => props.theme.text.secondaryFont};
            /* color : ${(props) => props.theme.colors.fourth}; */
            color : #ab3aa2;
            font-size : 1rem;
        }

        .video-link{
            cursor : pointer;
            font-family : ${(props) => props.theme.text.secondaryFont};
            color : ${(props) => props.theme.colors.primaryDark};
            font-size : 1rem;
        }
    }
`

const HeaderContainer = styled.div`
    display : flex;
    align-items : center;
    margin-bottom : 1rem;
`

const HeaderAndButtonContainer = styled.div`
    display : flex;
    flex-wrap : wrap;
    justify-content : space-between;
    
    h2{
        font-weight : bold;
    }
`

const GoToFullSlotListButton = styled.div`
    cursor : pointer;
    display : flex;
    padding : 1rem;
    background : ${(props) => props.theme.colors.primaryDark};
    margin-bottom : 1rem;
    border-radius : 4px;
    align-items : center;
    color : #fff;
    font-weight : bold;
    justify-content : space-between;
    max-width : 450px;
    transition : background .2s ease-in;

    :hover{
        background : ${(props) => props.theme.colors.primary};
    }
`

const GoToCrazyTimeStatsButton = styled.div`
    cursor : pointer;
    display : flex;
    padding : 1rem;
    background : ${(props) => props.theme.colors.primaryDark};
    margin-bottom : 1rem;
    border-radius : 4px;
    align-items : center;
    color : #fff;
    font-weight : bold;
    justify-content : space-between;
    max-width : 450px;
    transition : background .2s ease-in;

    :hover{
        background : ${(props) => props.theme.colors.primary};
    }
`

const NewsLetterCTAButton = styled.div`
    cursor : pointer;
    display : flex;
    padding : 1rem;
    background : #5290f2;
    margin-bottom : 1rem;
    border-radius : 4px;
    align-items : center;
    color : #fff;
    font-weight : bold;
    justify-content : space-between;
    max-width : 450px;
    transition : background .2s ease-in;

    :hover{
        background : ${(props) => props.theme.colors.primary};
    }
`

export default HomeHeader
