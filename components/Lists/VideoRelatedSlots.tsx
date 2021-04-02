import React, { useContext } from 'react'
import styled from 'styled-components'
import { AlgoliaSearchResult } from './../../graphql/schema'
import SlotListSlotCard from '../Cards/SlotListSlotCard'
import { LocaleContext } from '../../context/LocaleContext'

interface Props {
    slotList: AlgoliaSearchResult[]
}

const palette = {
    darkBg: '#2e2e2e',
    extraDarkBg: '#1c1c1c',
    red: '#f95565'
}

const VideoRelatedSlots = ({ slotList }) => {

    const { t } = useContext(LocaleContext)

    return (
        <StyleProvider>
            <div className='header-container'>
                <h4 className='related-slots-header'>{t("Related Slots")}</h4>
                <h4 className='related-slots-subheader'>{t("These slots are similar to the one you are looking at, take a look")}</h4>
            </div>

            <RelatedSlotsContainer>
                {slotList.map((slot, index) => <SlotListSlotCard key={`related_slot_${index}`} slotCardData={slot} />)}
            </RelatedSlotsContainer>
        </StyleProvider>
    )
}

const StyleProvider = styled.div`
    .header-container {
        background : ${palette.darkBg};
        margin : 2rem 0rem;
        padding : 1.5rem;
        border-radius : 4px;
    }

    .related-slots-header{
        font-family : ${(props) => props.theme.text.secondaryFont};
        color : ${(props) => props.theme.colors.primary};;
        text-align : center;
        font-size : 2rem;
        margin-bottom : 1rem;
    }

    .related-slots-subheader{
        font-family : ${(props) => props.theme.text.primaryFont};
        color : white;
        text-align : center;
        font-size : 1rem;
    }
`

const RelatedSlotsContainer = styled.div`
    display : flex;
    justify-content : space-around;
    flex-wrap : wrap;
`

export default VideoRelatedSlots
