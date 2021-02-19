import axios from 'axios'
import { firebaseDatabaseUrl } from "../firebaseConfig"
import { plainToClass } from 'class-transformer'
import { mapJsonToArray } from './../../utils/Utils'
import { AwsVideoApproved } from "../models/AwsVideoApproved"
import { Video } from "../../graphql/schema"
import { orderBy } from "lodash"

export const getLatestVideo = async (): Promise<AwsVideoApproved> => {

    const result = await axios.get(`${firebaseDatabaseUrl}/AwsVideosApproved/.json?orderBy="time"&limitToLast=3`)
    // @ts-ignore
    return plainToClass(AwsVideoApproved, orderBy((mapJsonToArray(result.data)).filter(v => v.visibility! === 'VISIBLE'), ['time'], ['desc']))[0]
}

export const getInitialVideos = async (callback?: (list: Video[]) => void) => {

    const response = await axios.get(`${firebaseDatabaseUrl}/AwsVideosApproved.json?orderBy="time"&limitToLast=17`)

    const placeholder: Video[] = []

    for (const id in response.data) {
        const video = response.data[id]
        placeholder.push(video)
    }

    callback && callback(placeholder)

    return response.data;
}

export const loadNextVideoListChunk = async (start: number, callback: (list: Video[]) => void) => {

    const response = await axios.get(`${firebaseDatabaseUrl}/AwsVideosApproved.json?orderBy="time"&endAt=${start + 1}&limitToLast=16`)

    const placeholder: Video[] = []

    for (const id in response.data) {
        const video = response.data[id]
        placeholder.push(video)
    }

    callback && callback(placeholder)

    return response.data;
}
