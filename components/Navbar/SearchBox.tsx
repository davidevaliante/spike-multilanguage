
import React, { FunctionComponent, Fragment, ChangeEvent } from 'react'
import styled from 'styled-components'
import { SearchString } from './../../translations/translations'
import FadeInOut from '../Ui/FadeInOut'
import LazyImage from '../Lazy/LazyImage'

interface Props {
    value: string
    onSearchClose: Function
    onSearchChange: (s: string) => void
    searchOpen: boolean
}

const SearchBox: FunctionComponent<Props> = ({ onSearchClose, onSearchChange, value, searchOpen }) => {

    return <Fragment>
        <FadeInOut visible={searchOpen}>
            <Wrapper >
                <Container>

                    <LazyImage
                        width={30}
                        height={30}
                        style={{ marginRight: '16px' }}
                        alt='search icon white'
                        onClick={() => onSearchClose()}
                        src='/icons/search_white.svg'
                    />

                    <SearchInput
                        value={value}
                        autoFocus
                        placeholder={SearchString.it}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)} />

                    <LazyImage
                        width={30}
                        height={30}
                        alt='search icon white'
                        onClick={() => onSearchClose()}
                        src='/icons/cross_white.svg'
                    />
                </Container>
            </Wrapper>
        </FadeInOut>
    </Fragment>

}


const Wrapper = styled.div`
    display : flex;
    justify-content : space-between;
    align-items : center;
    background : transparent;
    width : 100vw;
    height : 96px;
    transition : all .3s ease-in-out;   

`

const Container = styled.div`
    display : flex;
    justify-content : space-around;
    align-items : center;
    padding : 16px;
`

const SearchInput = styled.input`
    background : transparent;
    font-family : ${(props) => props.theme.text.primaryFont};
    border : none;
    padding : 16px;
    font-size : 1.3rem;
    color : white;

    :focus {
        outline : none; 
    }

    ::placeholder {
        color : white;
    }
`

export default SearchBox