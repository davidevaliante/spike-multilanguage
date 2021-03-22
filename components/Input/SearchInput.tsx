
import React, { FunctionComponent, Fragment, ChangeEvent, useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { SearchStringBigScreens } from './../../translations/translations'
import { StyledTheme } from './../../theme/theme'
import SearchResults from '../Navbar/SearchResults'
import { AlgoliaSearchResult } from '../../graphql/schema'
import LazyImage from '../Lazy/LazyImage'
import useOnClickOutside from './../../hooks/useOnClickOutside'
import { LocaleContext } from './../../context/LocaleContext';

interface Props {
    value: string
    onSearchChange: (s: string) => void
    onSearchFocusChange: (hasFocus: boolean) => void
    searchResults: AlgoliaSearchResult[] | undefined
}

const SearchInput: FunctionComponent<Props> = ({ onSearchChange, value, onSearchFocusChange, searchResults }) => {

    const [hasFocus, setHasFocus] = useState(false)

    const {t} = useContext(LocaleContext)

    useEffect(() => {
        if (hasFocus) onSearchFocusChange(true)
        else onSearchFocusChange(false)
    }, [hasFocus])

    const ref = useRef(null)

    useOnClickOutside(ref, () => {
        setHasFocus(false)
    })

    return <Fragment>

        <Wrapper ref={ref} hasFocus={hasFocus} onClick={() => !hasFocus && document.getElementById('searchField')!.focus()}>
            <Container>
                <Search
                    id='searchField'
                    value={value}
                    autoComplete={'new-password'}
                    onFocus={() => setHasFocus(true)}
                    placeholder={t('Search for a Slot or a Software House')}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)} >
                </Search>

                {hasFocus ? <LazyImage
                    width={26}
                    height={26}
                    src='/icons/search_primary.svg' /> :
                    <LazyImage
                        width={26}
                        height={26}
                        src='/icons/search_white.svg' />
                }
            </Container>

            <SearchResults show={hasFocus} searchResults={searchResults} />
        </Wrapper>
    </Fragment>

}

interface WrapperProps {
    hasFocus: boolean
    theme?: StyledTheme
}

const Wrapper = styled.div`
    display : flex;
    position: relative;
    justify-content : space-between;
    align-items : center;
    max-height : 56px;
    padding : 1rem;
    background : transparent;
    background : ${(props: WrapperProps) => props.hasFocus ? 'white' : props.theme!.colors.primaryDark};
    border-radius : 4px;
    transition : all .3s ease-in;
    box-sizing : border-box;
    border : ${(props: WrapperProps) => {
        if (props.hasFocus) return `2px solid ${props.theme!.colors.primaryDark}`;
        else return `2px solid ${props.theme!.colors.primary}`
    }};
`

const Container = styled.div`
    display : flex;
    justify-content : space-around;
    align-items : center;
    padding : 0px 16px;
`

const Search = styled.input`
    font-family : ${(props) => props.theme.text.primaryFont};
    border : none;
    font-size : .8rem;
    min-width : 260px;
    background : transparent;
    color : white;
    transition : background .2s ease-in;

    :focus {
        outline : none; 
        color : black;

        ::placeholder{
            color : ${(props) => props.theme.colors.primary};
        }
    }

    ::placeholder {
        color : white;
    }
`

export default SearchInput