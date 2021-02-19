import { IncomingMessage, ServerResponse } from "http"
import axios from 'axios'
import { firebaseDatabaseUrl } from './../../data/firebaseConfig'
import upperCase from "lodash/upperCase"
import AquaClient from './../../graphql/aquaClient'

const SLOT_BY_ID = `
query SLOT_BY_LEGACY_ID($legacyId: String="reel_rush"){
    slots(
        where: {
        country: {
            code: "it"
        }
        legacyId: $legacyId
    }
    ){
        slug
        updated_at

    }
}
`

export default async (req: IncomingMessage, res: ServerResponse) => {
    const slotName = req.url?.split("?name=")[1]

    const aquaClient = new AquaClient()

    const oldSlotResponse = await axios.get(
        `${firebaseDatabaseUrl}/Slots/it.json?orderBy="name"&equalTo="${upperCase(slotName)}"`
    );

    if (oldSlotResponse.data) {
        const oldSlotId = Object.keys(oldSlotResponse.data)[0]

        if (oldSlotId) {

            const newSlotSlug = await aquaClient.query({
                query: SLOT_BY_ID,
                variables: {
                    legacyId: oldSlotId
                }
            })

            res.statusCode = 200
            res.end(JSON.stringify({
                slug: newSlotSlug.data.data.slots[0].slug
            }))
        } else {
            res.statusCode = 404
            res.end(JSON.stringify({
                legacyId: 'NOT_FOUND'
            }))
        }

    }
}