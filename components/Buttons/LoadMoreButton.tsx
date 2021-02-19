import React from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
    onLoadMore: () => void
}

const LoadMoreButton: FunctionComponent<Props> = ({ onLoadMore }) => {

    const {t} = useTranslation()

    return (
        <LoadMoreButtonStyle onClick={() => onLoadMore()}>
            <p>{t("Show other slots")}</p>
        </LoadMoreButtonStyle>
    )
}

const LoadMoreButtonStyle = styled.div`
    cursor: pointer;
    background : ${(props) => props.theme.colors.primary};
    padding : 1rem 2rem;
    text-align : center;
    color:white;
    font-family : ${(props) => props.theme.text.secondaryFont};
    margin : 1rem auto;
    border-radius : 8px;
    transition : all .3s ease-in;
    max-width : 330px;

    :hover{
        background : ${(props) => props.theme.colors.primaryDark};
    }
`

export default LoadMoreButton
