import { IncomingMessage, ServerResponse } from "http";
import axios from 'axios'

export default async (req: IncomingMessage, res: ServerResponse) => {
    if(req.url) {
        const userIp = req.url.split('/').pop()
        const geoLocation = await axios.get('http://ip-api.com/json/' + userIp)
        const countryCode = geoLocation.data.countryCode.toLowerCase()
        res.end(JSON.stringify({countryCode}))
    }
}