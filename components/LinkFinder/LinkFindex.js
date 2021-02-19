import React, { useState, useEffect } from 'react'
import { Fragment } from 'react'
import styled from 'styled-components'
import axios from 'axios'

class AquaClient {

    myAxios;

    constructor() {
        this.myAxios = axios.create({ baseURL: 'https://spikeapistaging.tech/graphql' })
    }

    query({ query, variables }) {
        return this.myAxios.post('', {
            query,
            variables
        })
    }

    mutation({ mutation, variables }) {
        return this.myAxios.post('', {
            query: mutation,
            variables
        })
    }
}

const SLOT_BY_NAME = `
query SLOT_BY_NAME($name:String){
    slots(limit : 15, where : {name_contains:$name}){
      name
      slug
      country{
        code
      }
      type
    }
  }
`

const PRODUCER_BY_NAME = `
query PRODUCER_BY_NAME($name:String){
    producers(limit : 15, where : {name_contains:$name}){
      name
      slug
      country{
        code
      }
    }
  }
`

const BONUSES_BY_NAME = `
query BONUSES_BY_NAME($name:String){
    bonuses(limit : 15, where : {name_contains:$name}){
      name
      link
      country{
        code
      }
    }
  }
`

const LinkFinder = () => {

    const options = ['Produttore', 'Slot', 'Guida Bonus']

    const [searchValue, setSearchValue] = useState('')
    const [selectedEntity, setSelectedEntity] = useState('slot')
    const [searchTimer, setSearchTimer] = useState(undefined)
    const [results, setResults] = useState(undefined)

    const aquaClient = new AquaClient()

    useEffect(() => {
        if (searchValue && searchValue.length !== 0) {
            if (searchTimer === undefined) {
                const timer = setTimeout(() => {
                    handleSearch(searchValue)
                }, 200);
                setSearchTimer(timer)
            } else {
                clearInterval(searchTimer)
                setSearchTimer(undefined)
                const timer = setTimeout(() => {
                    handleSearch(searchValue)
                }, 200);
                setSearchTimer(timer)
            }
        } else {
            setResults(undefined)
            if (searchTimer !== undefined) clearInterval(searchTimer)
        }
    }, [searchValue])

    const handleSearch = async s => {
        if (selectedEntity === 'slot') {
            const data = await aquaClient.query({
                query: SLOT_BY_NAME,
                variables: {
                    name: s
                }
            })
            if (data.data.data.slots) {
                setResults(data.data.data.slots.map(r => {
                    return {
                        name: r.name,
                        countryCode: r.country.code,
                        type: r.type,
                        slug: r.slug
                    }
                }))
            }
        }

        if (selectedEntity === 'producer') {
            const data = await aquaClient.query({
                query: PRODUCER_BY_NAME,
                variables: {
                    name: s
                }
            })

            if (data.data.data.producers) {
                setResults(data.data.data.producers.map(r => {
                    return {
                        name: r.name,
                        countryCode: r.country.code,
                        type: r.type,
                        slug: r.slug
                    }
                }))
            }
        }

        if (selectedEntity === 'bonus') {
            const data = await aquaClient.query({
                query: BONUSES_BY_NAME,
                variables: {
                    name: s
                }
            })

            if (data.data.data.bonuses) {
                setResults(data.data.data.bonuses.map(r => {
                    return {
                        name: r.name,
                        countryCode: r.country.code,
                        link: r.link
                    }
                }))
            }
        }
    }

    const handleChange = (event) => {
        setSearchValue(event.target.value)
    }

    const copyToClipBoard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setSearchValue('')
        setResults(undefined)
    }

    const handleSelected = value => {
        setResults(undefined)
        setSelectedEntity(value)
    }

    const resultRenderer = () => {
        if (selectedEntity === 'slot') {
            return results.map((r) => <ResultCard
                key={`${r.name} - ${r.countryCode} - ${r.type}`}
                onClick={() => copyToClipBoard(`[${r.name}](/slot/${r.slug}/${r.countryCode})`)}>
                <h1>{`${r.name} - ${r.countryCode} - ${r.type}`}</h1>
            </ResultCard>)
        }

        if (selectedEntity === 'producer') {
            return results.map((r) => <ResultCard
                key={`${r.name} - ${r.countryCode}`}
                onClick={() => copyToClipBoard(`[${r.name}](/producer/${r.slug}/${r.countryCode})`)}>
                <h1>{`${r.name} - ${r.countryCode}`}</h1>
            </ResultCard>)
        }

        if (selectedEntity === 'bonus') {
            return results.map((r) => <ResultCard
                key={`${r.name} - ${r.countryCode}`}
                onClick={() => copyToClipBoard(`[${r.name}](${r.link})`)}>
                <h1>{`${r.name} - ${r.countryCode}`}</h1>
            </ResultCard>)
        }
    }

    return (
        <Fragment>
            <StyleProvider>
                <div className='field-container'>
                    <SwitchItem onClick={() => handleSelected('slot')} selected={selectedEntity === 'slot'}>
                        Slot
                    </SwitchItem>

                    <SwitchItem onClick={() => handleSelected('producer')} selected={selectedEntity === 'producer'}>
                        Produttore
                    </SwitchItem>

                    <SwitchItem onClick={() => handleSelected('bonus')} selected={selectedEntity === 'bonus'}>
                        Bonus
                    </SwitchItem>
                    <input placeholder={`Cerca ${selectedEntity}...`} value={searchValue} onChange={handleChange} />

                </div>

                {results && resultRenderer()}
            </StyleProvider>
        </Fragment>
    )
}

const SwitchItem = styled.div`
    cursor : pointer;
    color : ${(props) => props.selected ? 'white' : 'black'};
    background : ${(props) => props.selected ? '#007eff' : 'white'};
    padding : 1rem;
`

const StyleProvider = styled.div`
    .field-container{
        display : flex;
    }
`

const ResultCard = styled.div`
    cursor : pointer;
    padding : 1rem 0rem;

    h1{
        font-size : .8rem
    }

    input{
        display : hidden;
        font-size : .6rem;
        color : transparent;
    }
`

export default LinkFinder