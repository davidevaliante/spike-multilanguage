
import React, { FunctionComponent, Fragment, ChangeEvent, useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { StyledTheme } from './../../theme/theme'
import { LocaleContext } from '../../context/LocaleContext'

interface Props {
    value: string
    onSearchChange: (s: string) => void
    onSearchFocusChange?: (hasFocus: boolean) => void
    countryCode: string
}

const VideoListSearchInput: FunctionComponent<Props> = ({ onSearchChange, value, onSearchFocusChange, countryCode }) => {

    const [hasFocus, setHasFocus] = useState(false)

    const { t } = useContext(LocaleContext)

    useEffect(() => {
        if (onSearchFocusChange) {
            if (hasFocus) onSearchFocusChange(true)
            else onSearchFocusChange(false)
        }

    }, [hasFocus])

    return <Fragment>

        <Wrapper hasFocus={hasFocus} onClick={() => !hasFocus && document.getElementById('slotListSearchField')!.focus()}>
            <Container>
                <Search
                    id='slotListSearchField'
                    value={value}
                    autoComplete={'new-password'}
                    onFocus={() => setHasFocus(true)}
                    onBlur={() => setHasFocus(false)}
                    placeholder={t('Search for a video')}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)} >
                </Search>
                <img src={hasFocus ? '/icons/search_primary.svg' : '/icons/search_white.svg'} />
            </Container>

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
    margin : 1rem;
    max-width : 340px;
    background : transparent;
    background : ${(props: WrapperProps) => props.hasFocus ? 'white' : props.theme!.colors.primaryDark};
    border-radius : 26px;
    transition : all .3s ease-in;
    box-sizing : border-box;
    border : ${(props: WrapperProps) => {
        if (props.hasFocus) return `2px solid ${props.theme!.colors.primaryDark}`;
        else return `2px solid ${props.theme!.colors.primary}`
    }};


    img {
        width : 26px;
        height : 26px;
    }
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

export default VideoListSearchInput