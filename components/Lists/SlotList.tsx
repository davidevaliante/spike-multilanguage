import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { AlgoliaSearchResult } from './../../graphql/schema'
import SlotListSlotCard from '../Cards/SlotListSlotCard'
import {useTranslation} from 'react-i18next'

interface Props {
    slotList: AlgoliaSearchResult[] | undefined
    showSearchHasNoResults?: boolean
}

const SlotList: FunctionComponent<Props> = ({ slotList, showSearchHasNoResults }) => {

    const {t} = useTranslation()
    
    return (
        <Fragment>
            <SlotListContainer>
                {(showSearchHasNoResults === false) && slotList?.map((slot, index) => <SlotListSlotCard key={`${slot.name}_${index}`}
                    slotCardData={slot} />)}
                {showSearchHasNoResults && <h2>{t("The search returned no results")}</h2>}
            </SlotListContainer>
        </Fragment>
    )
}

const SlotListContainer = styled.div`
    display : flex;
    flex-wrap : wrap;
    border-radius : 4px;
    background : #f5f5f5;
    justify-content : center;
    padding : 1rem;
    margin : 1.4rem;  
`

export default SlotList
