import { IncomingMessage, ServerResponse } from "http"
import algoliasearch from 'algoliasearch'
import AquaClient from './../../graphql/aquaClient'
import { Bonus, Producer } from './../../graphql/schema'

const ALL_SLOTS_QUERY = `
    query{
        slots(limit:7000, where:{type_ne:"bar", country:{code:"it"}}){
            id
            name
            type
            slug
            rating
            country{
                code
            }
            image{
            url
            }
            bonuses(limit:1, start: 0){
                link
            }
        }
    }
`

const ALL_BONUS_QUERY = `
    query{
        bonuses(limit:1000){
            id
            name,
            slug,
            bonus_guide{
                slug
              }
            link,
            country{
                code
            }
            circular_image{
                url
            }
        }
    }
`

const ALL_PRODUCERS_QUERY = `
query{
    producers(where : {country:{code:"it"}},limit: 10000){
        id
        name,
        slug,
        country{
            code
        }
        image{
          url
        }
    }
}
`

interface AlgoliaSlot {
    id: number
    country: {
        code: string
    }
    name: string
    bonuses: Bonus[]
    image: {
        url: string
    }
    slug: string
    rating: number
    link: string
    type: 'slot'
}

export default async (req: IncomingMessage, res: ServerResponse) => {
    const client = algoliasearch('92GGCDET16', '72d81cff846ce00014dab2122cd757ac');
    const index = client.initIndex('entities');

    const aquaClient = new AquaClient('https://spikeapistaging.tech/graphql')

    const allSlots = await aquaClient.query({ query: ALL_SLOTS_QUERY, variables: { limit: 6000 } })
    const allBonuses = await aquaClient.query({ query: ALL_BONUS_QUERY, variables: { limit: 1000 } })
    const allProducers = await aquaClient.query({ query: ALL_PRODUCERS_QUERY, variables: { limit: 1000 } })

    const slotEntities = (allSlots.data.data.slots).filter((slot: AlgoliaSlot) => slot.type).map((slot: AlgoliaSlot) => {
        if (slot.country !== null && slot.country !== undefined)
            return {
                objectID: `${slot.id}_slot`,
                country: slot.country.code,
                name: slot.name,
                slug: slot.slug,
                rating: slot.rating,
                image: slot.image ? slot.image.url : 'https://spikeapi.eu/icons/app_icon.svg',
                link: slot.bonuses && slot.bonuses.length > 0 && slot.bonuses[0].link,
                type: 'slot',
            }
        return undefined
    })

    const bonusEntities = (allBonuses.data.data.bonuses).map((bonus: Bonus) => {
        return {
            objectID: `${bonus.id}_bonus`,
            country: bonus.country.code,
            name: bonus.name,
            slug: bonus.bonus_guide?.slug,
            link: bonus.link,
            image: bonus.circular_image ? bonus.circular_image.url : 'https://spikeapi.eu/icons/app_icon.svg',
            type: 'bonus'
        }
    })

    const producerEntities = (allProducers.data.data.producers).map((producer: Producer) => {
        return {
            objectID: `${producer.id}_producer`,
            country: producer.country.code,
            name: producer.name,
            slug: producer.slug,
            image: producer.image[0] ? producer.image[0].url : 'https://spikeapi.eu/icons/app_icon.svg',
            type: 'producer'
        }
    })

    const arr = [...slotEntities, ...producerEntities, ...bonusEntities]

    try {
        await index.saveObjects(arr, {
            autoGenerateObjectIDIfNotExist: true
        })

    } catch (error) {
        console.log(error)
    }

    if (req.method === 'GET') {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        console.log('get')
        res.end(
            JSON.stringify(arr),
        )
    }
}