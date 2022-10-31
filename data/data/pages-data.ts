import { HOME } from '../../graphql/queries/home'
import AquaClient from '../../graphql/aquaClient'
import { Home } from '../../graphql/schema'
import { mainCountry } from '../../config'

const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

export const homeDataForCountry = async (countryCode: string = mainCountry): Promise<Home> => {
    const data = await aquaClient.query({
        query: HOME,
        variables: { countryCode },
    })

    return data.data.data.homes[0] as Home
}
