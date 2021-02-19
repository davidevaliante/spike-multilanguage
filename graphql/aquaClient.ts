import axios, { AxiosInstance } from 'axios';

class AquaClient {
    axios: AxiosInstance;

    constructor(public baseURL: string = 'https://spikeapistaging.tech/graphql', public headers?: string) {
        this.axios = axios.create({ baseURL })
    }

    query({ query, variables }) {
        return this.axios.post('', {
            query,
            variables
        })
    }

    mutation({ mutation, variables }) {
        return this.axios.post('', {
            query: mutation,
            variables
        })
    }
}


export default AquaClient;