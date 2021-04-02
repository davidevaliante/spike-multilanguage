import { HOME } from '../../graphql/queries/home'
import AquaClient from '../../graphql/aquaClient'
import { Home } from '../../graphql/schema'

const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)


export const homeDataForCountry = async (countryCode : string) : Promise<Home> => {
    const data = await aquaClient.query({
        query: HOME,
        variables: { countryCode}
    })

    return data.data.data.homes[0] as Home
}