import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import Divider from '../Ui/Divider'
import { AlgoliaSearchResult } from '../../graphql/schema'
import Router from 'next/router'
import { injectCDN } from './../../utils/Utils'
import {useTranslation} from 'react-i18next'

interface Props {
    searchResults: AlgoliaSearchResult[] | undefined
}

const MobileSearchResults: FunctionComponent<Props> = ({ searchResults }) => {
    
    const handleEntityClick = (result: AlgoliaSearchResult) => {
        if (result.type === 'slot') Router.push(`/slot/${result.slug}/${result.country}`)

        if (result.type === 'bonus') {
            if (result.slug) Router.push(`/guida/${result.slug}/${result.country}`)
            else window.open(result.link)
        }

        if (result.type === 'producer') Router.push(`/producer/${result.slug}/${result.country}`)
        else console.log(result.type)
    }

    return <SearchResultsContainer>
        {searchResults ? searchResults?.map((r: AlgoliaSearchResult, index: number) =>
            <div key={`mobile_search_res_${index}`} onClick={() => handleEntityClick(r)}>
                <SearchTile result={r} />
                <Divider color='#c9c9c9' />
            </div>)
            :
            <SuggestedSearchs />
        }
    </SearchResultsContainer>
}

const SuggestedSearchs: FunctionComponent = () => {

    const {t} = useTranslation()
    
    return (
        <div>
            <h3 className='search-suggestions'>{t("Popular searches")} :</h3>
        </div>
    )
}

const SearchTile: FunctionComponent<{ result: AlgoliaSearchResult }> = ({ result }) => {

    const typeToString = (type: 'slot' | 'producer' | 'bonus') => {
        switch (type) {
            case 'slot':
                return 'Slot'
            case 'producer':
                return 'Software house'
            case 'bonus':
                return 'Bonus di benvenuto'
            default:
                return 'Unknown'
        }
    }

    const getImageUrl = (): string => {
        if (result.image.url === undefined) return result.image.toString()
        return result.image.url
    }

    return (
        <div className='tile-container'>
            <img style={{ width: '36px', height: '36px' }} src={injectCDN(getImageUrl())} />
            <h3>{result.name}</h3>
            <h3 className='type'>{typeToString(result.type)}</h3>
        </div>
    )
}

const SearchResultsContainer = styled.div`
    display : flex;
    flex-direction:  column;
    background : white;
    overflow-y : scroll;
    width : 100%;
    z-index : 999;

    .search-suggestions{
        color : ${(props) => props.theme.colors.primary};
        padding : 1rem;
        font-family : ${(props) => props.theme.text.secondaryFont};
        font-size : 80%;
    }

    .tile-container{
        cursor: pointer;    
        display : flex;
        align-items : center;
        color : black;
        padding : 1rem;
    }

    .type{
        color : black;
        padding: .3rem .5rem;
        letter-spacing : .05rem;
        font-family : ${(props) => props.theme.text.secondaryFont};
        border-radius : 6px;
        font-size : 65%;
        margin-left: auto;
        background : grey;
    }

    h3{
        text-align : start;
    }

    img{
        border-radius : 50%;
        margin-right : 1rem;
    }
`

export default MobileSearchResults