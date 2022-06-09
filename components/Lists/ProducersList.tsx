import React, { useContext, FunctionComponent } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { LocaleContext } from './../../context/LocaleContext'
import { Producer } from '../../graphql/schema'
import { laptop } from '../Responsive/Breakpoints'

interface Props {
    producers: Producer[] | undefined
    showProducers: boolean
    showMoreFilter: boolean
    onProducerSelected: (producerName: string) => void
}

const ProducersList: FunctionComponent<Props> = ({ producers, showProducers, showMoreFilter, onProducerSelected }) => {
    const { contextCountry } = useContext(LocaleContext)
    const router = useRouter()

    const goToProducer = (slug: string) => router.push(`/producer/${slug}/${contextCountry}`)

    return (
        <Container>
            {producers &&
                showProducers &&
                producers.map((p: Producer) => (
                    <ProducerButton key={p.name} onClick={() => onProducerSelected(p.name)} className='hollow-button'>
                        {p.name}
                    </ProducerButton>
                ))}
        </Container>
    )
}

export const OptionalFiltersContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    padding: 0rem 1rem;
`

interface MoreFiltersWrapper {
    isOpen: boolean
}

export const MoreFiltersWrapper = styled.div`
    max-height: ${(props: MoreFiltersWrapper) => (props.isOpen ? '3000px' : '0px')};
    transition: max-height 0.7s ease-in-out;
    display: flex;
    width: 100%;
    flex-direction: column;
`

export const MoreFiltersList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    h4 {
        cursor: pointer;
        user-select: none;
        background: ${(props) => props.theme.colors.primary};
        color: white;
        text-align: center;
        padding: 1rem 3rem;
        border-radius: 6px;
        transition: all 0.3s ease-in;
        margin-bottom: 1rem;
        width: 250px;
        border: 3px solid ${(props) => props.theme.colors.primary};

        :hover {
            background: ${(props) => props.theme.colors.primaryDark};
        }
    }

    .selected {
        cursor: pointer;
        user-select: none;
        background: ${(props) => props.theme.colors.primaryDark};
        color: white;
        text-align: center;
        padding: 1rem 3rem;
        border-radius: 6px;
        transition: all 0.3s ease-in;
        margin-bottom: 1rem;
        width: 250px;
        border: 3px solid ${(props) => props.theme.colors.yellow};

        :hover {
            background: ${(props) => props.theme.colors.primaryDark};
        }
    }
`

export const MoreFiltersButton = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-tap-highlight-color: transparent;

    h3 {
        text-align: center;
        color: ${(props) => props.theme.colors.primary};
        font-size: 85%;
    }

    img {
        margin-left: 1rem;
        width: 16px;
        height: 16px;
    }
`

export const MainFiltersContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    span {
        font-size: 0.8rem;
    }

    ${laptop} {
        justify-content: space-between;
    }
`

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    align-items: flex-start;
    margin-bottom: 1rem;
`

const ProducerButton = styled.h1`
    cursor: pointer;
    color: white;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0.3rem;
    border: 2px solid #f2a20c;
    border-radius: 36px;
    transition: all 0.3s ease-in-out;
    background: ${(props) => props.theme.colors.yellowDark};
    box-shadow: 10px 10px 5px -5px rgba(0, 0, 0, 0.1);

    :hover {
        color: white-space;
        border: 2px solid ${(props) => props.theme.colors.primaryDark};
        background: ${(props) => props.theme.colors.primary};
        color: white;
    }
`

export default ProducersList
