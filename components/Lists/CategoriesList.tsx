import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

interface Props {
    categories: string[]
    showCategories: boolean
    onThemeSelected: (theme: string) => void
}

const CategoriesList: FunctionComponent<Props> = ({ categories, showCategories, onThemeSelected }) => {
    return (
        <Container>
            {categories &&
                showCategories &&
                categories.map((c) => (
                    <CategoriesButton key={c} className='hollow-button-cyan' onClick={() => onThemeSelected(c)}>
                        {c}
                    </CategoriesButton>
                ))}
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    align-items: flex-start;
`

const CategoriesButton = styled.h1`
    cursor: pointer;
    color: black;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0.3rem;
    border: 2px solid #1e8ef7;
    border-radius: 36px;
    transition: all 0.3s ease-in-out;
    background: #0cebf2;
    box-shadow: 10px 10px 5px -5px rgba(0, 0, 0, 0.1);

    :hover {
        color: white-space;
        border: 2px solid #0cebf2;
        background: #1e8ef7;
        color: white;
    }
`

export default CategoriesList
