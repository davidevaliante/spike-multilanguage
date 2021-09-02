import { serverSide404 } from "../utils/Utils"

function Error({ statusCode }) {
    return <p>{statusCode ? `An error ${statusCode} occurred on server` : "An error occurred on client"}</p>
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404

    if (statusCode === 500 || statusCode === 404) serverSide404(res)
    return { statusCode }
}

export default Error
