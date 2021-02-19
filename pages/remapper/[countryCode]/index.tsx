import { useEffect, useState } from 'react'
import { getAllProducers, ALL_PRODUCERS_BY_COUNTRY } from '../../../migrations/producer'
import { SupportedCountries } from '../../../context/CountryContext'
import { Producer } from '../../../data/models/Producer'
import { Slot, PRODUCER_STATUS, SLOT_STATUS, SLOT_TYPE, BONUS_STATUS } from '../../../graphql/schema'
import { CREATE_PRODUCER } from '../../../graphql/mutations/producers'
import { mapJsonToArray } from '../../../utils/Utils'
import { Bonus } from '../../../data/models/Bonus'
import { CREATE_BONUS } from '../../../graphql/mutations/bonus'
import { getAllBonuses, ALL_BONUSES_BY_COUNTRY } from '../../../migrations/bonus'
import { GET_COUNTRY_WITH_COUNTRY_CODE } from '../../../graphql/queries/countries'
import { NextPageContext } from 'next'
import { OldSlot } from '../../../data/models/Slot'
import { getAllSlots, ALL_SLOTS_BY_COUNTRY } from '../../../migrations/slots'
import { CREATE_SLOT, UPDATE_RELATED_SLOTS } from '../../../graphql/mutations/slots'
import snakeCase from 'lodash/snakeCase'
import { Button } from '@material-ui/core'
import styled from 'styled-components'
import { countryCodeToEnum } from './../../../context/CountryContext'
import { SupportedCountry } from './../../../data/models/SupportedCountry'
import AquaClient from './../../../graphql/aquaClient'

interface PageProps extends NextPageContext {
    pathname: string
}

const Remapper = (p: any) => {
    const props = p as PageProps

    const aquaClient = new AquaClient()

    const { pathname, query } = props

    const countryCode = query.countryCode as string

    // old data
    const [oldBonusList, setOldBonusList] = useState<Bonus[] | undefined>(undefined)
    const [oldProducerList, setOldProducerList] = useState<Producer[] | undefined>(undefined)
    const [oldSlotList, setOldSlotList] = useState<OldSlot[] | undefined>(undefined)

    useEffect(() => {
        if (oldBonusList && oldBonusList.length > 0 && oldProducerList && oldProducerList.length > 0 && oldSlotList && oldSlotList.length > 0) {
        }
    }, [oldBonusList, oldProducerList, oldSlotList])

    useEffect(() => {
        getOldData()
        getNewData()
    }, [])

    // old data
    const getOldData = async () => {
        const producerResponse = getAllProducers(countryCodeToEnum(countryCode)).then(r => setOldProducerList(r))
        const bonusResponse = getAllBonuses(countryCodeToEnum(countryCode)).then(r => setOldBonusList(r))
        const slotsResponse = getAllSlots(countryCodeToEnum(countryCode)).then(r => setOldSlotList(r))
    }

    const [countryData, setCountryData] = useState<SupportedCountry | undefined>(undefined)
    const [newSlots, setNewSlots] = useState<Slot[] | undefined>(undefined)
    const [newSlotsIdList, setNewSlotsIdList] = useState<string[] | undefined>(undefined)

    useEffect(() => {
        if (newSlots) {
            if (newSlotsIdList === undefined) setNewSlotsIdList(newSlots.map(ns => ns.legacyId))
        }
    }, [newSlots, newSlotsIdList])

    const [newProducers, setNewProducers] = useState<Producer[] | undefined>(undefined)
    const [newProducersIdList, setNewProducersIdList] = useState<string[] | undefined>(undefined)

    useEffect(() => {
        if (newProducers) {
            if (newProducersIdList === undefined) setNewProducersIdList(newProducers.map(np => np.legacyId))
        }
    }, [newProducers, newProducersIdList])

    const [newBonuses, setNewBonuses] = useState<Bonus[] | undefined>(undefined)
    const [newBonusesIdList, setNewBonusesIdList] = useState<string[] | undefined>(undefined)

    useEffect(() => {
        if (newBonuses) {
            if (newBonusesIdList === undefined) setNewBonusesIdList(newBonuses.map(nb => nb.legacyId))
        }
    }, [newBonuses, newBonusesIdList])

    const getNewData = async () => {
        const newSlotsRequest = await aquaClient.query({ query: ALL_SLOTS_BY_COUNTRY, variables: { code: countryCode } })
        const newProducersRequest = await aquaClient.query({ query: ALL_PRODUCERS_BY_COUNTRY, variables: { code: countryCode } })
        const newBonusesRequest = await aquaClient.query({ query: ALL_BONUSES_BY_COUNTRY, variables: { code: countryCode } })
        const countryRequest = await aquaClient.query({ query: GET_COUNTRY_WITH_COUNTRY_CODE, variables: { code: countryCode } })
        setNewSlots(newSlotsRequest.data.data.slots)
        setNewProducers(newProducersRequest.data.data.producers)
        setNewBonuses(newBonusesRequest.data.data.bonuses)
        setCountryData(countryRequest.data.data.supportedCountries[0])
    }

    const remapSlots = async (country: SupportedCountries) => {

        const slotsToAdd: OldSlot[] = []

        const addNewSlot = (oldSlot: OldSlot) => {
            let linkPlay: string
            if (oldSlot.producer && oldSlot.producer.name === 'BetSoft Gaming' ||
                oldSlot.linkPlay === 'non ci sta' ||
                oldSlot.linkPlay === 'da mettere' ||
                oldSlot.linkPlay === "https://workinprogress.commited") linkPlay = 'https://www.nulllink.com'
            else linkPlay = oldSlot.linkPlay

            const oldTypeToNewType = (oldType: string): SLOT_TYPE => {
                if (oldType === 'BAR') return SLOT_TYPE.BAR
                if (oldType === 'VLT') return SLOT_TYPE.VLT
                return SLOT_TYPE.ONLINE
            }

            const newSlotInput = {
                description: oldSlot.description,
                isPopularInCountry: false,
                playLink: linkPlay,
                linkYoutube: oldSlot.linkYoutube,
                videoDescription: oldSlot.linkYoutubeDescription ? oldSlot.linkYoutubeDescription : 'NO',
                name: oldSlot.name,
                rating: parseInt(oldSlot.rating),
                tips: oldSlot.tips,
                relatedSlots: [],
                country: countryData?.id!,
                technicals: oldSlot.tecnicals,
                legacyId: oldSlot.id,
                slug: snakeCase(oldSlot.name),
                producer: undefined,
                status: SLOT_STATUS.PUBLISHED,
                legacySlug: snakeCase(oldSlot.name),
                image: undefined,
                type: oldTypeToNewType(oldSlot.type),
                onlineEquivalent: undefined,
                bonuses: undefined,
                nameWithTypeAndCountry: `${oldSlot.name} ${countryCode} ${oldTypeToNewType(oldSlot.type)}`,
            }

            aquaClient.mutation({
                mutation: CREATE_SLOT,
                variables: {
                    newSlotData: newSlotInput
                }
            })
        }

        const oldSlotList = await getAllSlots(country)
        oldSlotList.forEach(oldSlot => {

            // solo se non è già presente
            if (newSlotsIdList?.includes(oldSlot.id!)) {   
            } else {
                slotsToAdd.push(oldSlot)
            }
        })

        slotsToAdd.forEach(slotToAdd => {
            addNewSlot(slotToAdd)
        })

    }

    const remapBonus = async (country: SupportedCountries) => {
        const oldBonusList = await getAllBonuses(country)
        const bonusToAdd: Bonus[] = []

        oldBonusList.forEach(oldBonus => {
            if (newBonusesIdList?.includes(oldBonus.id!)) {

            } else {
                bonusToAdd.push(oldBonus)
            }
        })

        bonusToAdd.forEach(oldBonus => {
            aquaClient.mutation({
                mutation: CREATE_BONUS,
                variables: {
                    newBonusData: {
                        description: oldBonus.bonus,
                        backgroundColor: oldBonus.bonusImageBg,
                        borderColor: oldBonus.borderColor,
                        link: oldBonus.link,
                        name: oldBonus.name,
                        noDeposit: oldBonus.noDepositText,
                        withDeposit: oldBonus.withDepositText,
                        rating: parseInt(oldBonus.rating),
                        tips: oldBonus.tips,
                        country: countryData?.id!,
                        legacyId: oldBonus.id,
                        slug: snakeCase(oldBonus.name),
                        status: BONUS_STATUS.VISIBLE,
                        circular_image: undefined,
                        nameWithCountry: `${oldBonus.name} - ${countryCode}`
                    }
                }
            })
        })
    }

    const remapProducers = async (country: SupportedCountries) => {
        const oldProducerList = await getAllProducers(country)
        const producersToAdd: Producer[] = []

        oldProducerList.forEach(oldProducer => {
            if (newProducersIdList?.includes(oldProducer.id!)) {

            } else {
                producersToAdd.push(oldProducer)
            }
        })

        producersToAdd.forEach(oldProducer => {
            aquaClient.mutation({
                mutation: CREATE_PRODUCER,
                variables: {
                    newProducerData: {
                        name: oldProducer.name,
                        website: oldProducer.link,
                        description: oldProducer.description,
                        country: countryData?.id!,
                        legacyId: oldProducer.id,
                        slug: snakeCase(oldProducer.name),
                        legacySlug: snakeCase(oldProducer.name),
                        status: PRODUCER_STATUS.VISIBLE,
                        image: 1,
                        nameWithCountry: `${oldProducer.name} - ${countryData?.code}`
                    }
                }
            })
        })
    }

    const injectRelatedSlotsIntoNewSlots = async () => {
        const updateSlotWithRelatedSlots = async (newSlotId: number, slot: Slot) => {
            const oldSlotEquivalent = oldSlotList?.find(oldSlot => oldSlot.id === slot.legacyId)
            if (oldSlotEquivalent) {

                if (oldSlotEquivalent.similarSlots !== undefined) {
                    const { similarSlots } = oldSlotEquivalent

                    const relatedSlotsObject = Object.keys(similarSlots).map(similarId => {

                        const m = newSlots?.find(newSlot => newSlot.legacyId === similarId)!

                        if (m === undefined) { 
                        }

                        return m
                    })

                    if (relatedSlotsObject.length > 0) {
                       
                        const relatedSlots = relatedSlotsObject.filter(e => e !== undefined).map(match => parseInt(match.id))

                        if (relatedSlots.length > 0) {
                            aquaClient.mutation({
                                mutation: UPDATE_RELATED_SLOTS,
                                variables: {
                                    where: { id: newSlotId },
                                    data: {
                                        relatedSlots: relatedSlots
                                    }
                                }
                            })
                        }
                    } else {
                        console.log(`${oldSlotEquivalent} has EMPTY similar slots`)
                    }
                } else {
                    console.log(`${oldSlotEquivalent} has no similar slots`)
                }
            } else {
                console.log('equivalent not found')
                console.log(oldSlotEquivalent)
            }
        }

        newSlots?.forEach(newSlot => {
            updateSlotWithRelatedSlots(parseInt(newSlot.id), newSlot)
        })
    }

    const injectProducerIntoSlots = () => {
        const updateSlotWithProducer = async (newSlotId: number, slot: Slot) => {

            const oldSlotEquivalent = oldSlotList?.find(oldSlot => oldSlot.id === slot.legacyId)

            if (oldSlotEquivalent) {
                
                if (oldSlotEquivalent.producer !== undefined) {

                    const { producer } = oldSlotEquivalent

                    const match = newProducers?.find(p => p.legacyId === producer.id)

                    if (match) {
                        
                        aquaClient.mutation({
                            mutation: UPDATE_RELATED_SLOTS,
                            variables: {
                                where: { id: newSlotId },
                                data: {
                                    producer: parseInt(match.id!)
                                }
                            }
                        })

                    } else {
                        console.log(`${oldSlotEquivalent} has no match for producer`)
                        console.log(oldSlotEquivalent.producer.id)
                    }
                } else {
                    console.log(`${oldSlotEquivalent} has no producer`)
                }
            } else {
                console.log('producer not found')
            }
        }

        newSlots?.forEach(newSlot => {
            updateSlotWithProducer(parseInt(newSlot.id), newSlot)
        })
    }

    const injectBonusInSlots = () => {
        const updateSlotWithBonuses = async (id: number, slot: Slot) => {
            const oldSlotEquivalent = oldSlotList?.find(oldSlot => oldSlot.id === slot.legacyId)

            if (oldSlotEquivalent) {
                const { bonus, bonusSpecial } = oldSlotEquivalent

                if (bonusSpecial === undefined) {
                    console.log('bonus principale mancante')
                    console.log('ABORTING')
                    return
                }

                if (mapJsonToArray(bonus).length === 0 || bonus === undefined) {
                    console.log('bonus ausiliari mancanti')
                    console.log('ABORTING')
                    return
                }

                const oldBonusIds = [
                    ...mapJsonToArray(bonusSpecial, true).map((b: any) => b.id),
                    ...mapJsonToArray(bonus, true).map((b: any) => b.id)
                ]

                const newBonusIds = newBonuses?.filter(newBonus => oldBonusIds.includes(newBonus.legacyId))
                const remappedBonuses = newBonusIds?.map(newBonus => parseInt(newBonus.id!))

                aquaClient.mutation({
                    mutation: UPDATE_RELATED_SLOTS,
                    variables: {
                        where: { id: id },
                        data: {
                            bonuses: remappedBonuses
                        }
                    }
                })

            } else {
                console.log('equivalent not found')
            }
        }

        newSlots?.forEach(newSlot => {
            updateSlotWithBonuses(parseInt(newSlot.id), newSlot)
        })
    }

    const injectOnlineVersionIntoBarSlots = () => {

        const updateSlotWithOnlineEquivalent = async (id: number, slot: Slot) => {
            const oldSlotEquivalent = oldSlotList?.find(oldSlot => oldSlot.id === slot.legacyId)
            if (oldSlotEquivalent) {
                console.log('equivalente trovata')
                console.log(oldSlotEquivalent)

                if (oldSlotEquivalent.onlineVersion !== undefined) {
                    console.log('versione online trovata')

                    const { onlineVersion } = oldSlotEquivalent
                    if (onlineVersion) {
                        const onlineVersionId = Object.keys(onlineVersion)[0]
                        console.log(onlineVersionId)
                        const match = newSlots?.find(p => p.legacyId === onlineVersionId)
                        if (match) {
                            console.log(match)
                            // const data = await updateSlot({
                            //     variables: {
                            //         where: { id: id },
                            //         data: {
                            //             description: slot.description,
                            //             isPopularInCountry: slot.isPopularInCountry,
                            //             playLink: slot.playLink,
                            //             linkYoutube: slot.linkYoutube,
                            //             videoDescription: slot.videoDescription,
                            //             name: slot.name,
                            //             rating: slot.rating,
                            //             tips: slot.tips,
                            //             relatedSlots: slot.relatedSlots.map(rs => parseInt(rs.id)),
                            //             country: slot.country.id,
                            //             technicals: slot.technicals,
                            //             legacyId: slot.legacyId!,
                            //             slug: slot.slug,
                            //             producer: parseInt(match.id!),
                            //             onlineEquivalent: parseInt(match.id!)
                            //         }
                            //     }
                            // })
                        } else {
                            console.log(`${oldSlotEquivalent} has EMPTY similar slots`)
                        }
                    }

                } else {
                    console.log(`${oldSlotEquivalent} has no similar slots`)
                }
            } else {
                console.log('equivalent not found')
            }
        }

        newSlots?.filter(ns => ns.type === SLOT_TYPE.BAR || ns.type === SLOT_TYPE.VLT).forEach(newSlot => {
            updateSlotWithOnlineEquivalent(parseInt(newSlot.id), newSlot)
        })
    }

    return <StyleProvider>
        <h1>Transfer Data</h1>
        <Container>
            <Button variant="contained" color="primary" onClick={() => remapBonus(countryCodeToEnum(countryCode))}>
                Remap Bonus
            </Button>

            <Button variant="contained" color="primary" onClick={() => remapProducers(countryCodeToEnum(countryCode))}>
                Remap Producers
            </Button>

            <Button variant="contained" color="primary" onClick={() => remapSlots(countryCodeToEnum(countryCode))}>
                Remap Slots
            </Button>

        </Container>

        <h1>Relationships</h1>
        <Container>
            <Button variant="contained" color="primary" onClick={() => injectRelatedSlotsIntoNewSlots()}>
                Inject Related Slots
            </Button>

            <Button variant="contained" color="primary" onClick={() => injectProducerIntoSlots()}>
                Inject Producers Into Slots
            </Button>

            <Button variant="contained" color="primary" onClick={() => injectBonusInSlots()}>
                Inject Bonus Into Slots
            </Button>

            <Button variant="contained" color="primary" onClick={() => injectOnlineVersionIntoBarSlots()}>
                Inject Online Version Into Bar Slots
            </Button>
        </Container>

        {/* testing */}
        {/* <div style={{ padding: '0rem 16rem' }} className='rte-wrapper'>
            {slot && <ReactMarkdown source={injectCDN(slot[0].description)} />}
        </div> */}
        {/* {newSlots.data?.slots.map((b, i) => <h1 key={`${b.name}_${i}`}>{b.name}</h1>)} */}
    </StyleProvider>
}

const injectCDN = (s: string, size: 'small_' | 'medium_' | 'large_' | '' = ''): string => {
    const baseUrl = 'https://spike-images.s3.eu-central-1.amazonaws.com/'
    const cloudFrontRoot = `https://dzyz6pzqu8wfo.cloudfront.net/${size}`
    return s.split(baseUrl).join(cloudFrontRoot)
}

Remapper.getInitialProps = async ({ apolloClient, pathname, query, AppTree }): Promise<PageProps> => {

    return {
        pathname,
        query,
        AppTree,
    }
}

const StyleProvider = styled.div`
    h1{
        color : ${(props) => props.theme.colors.primary};
        font-size : 2rem;
        text-align:center;
        font-weight : bold;
    }

    .rte-wrapper{
        img{
            display : block;
            margin : auto;
        }
    }
`

const Container = styled.div`
    display : flex;
    padding : 2rem;
    justify-content : space-around;
    margin : 3rem 12rem;

`

export default Remapper