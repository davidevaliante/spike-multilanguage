import React, { FunctionComponent, Fragment, useEffect, useState } from "react"
import FullPageLoader from "./../../components/Layout/FullPageLoader"
import { useRouter } from "next/router"
import Head from "next/head"

interface Iindex {}

const index: FunctionComponent<Iindex> = ({}) => {
    const router = useRouter()

    const [d, setD] = useState<string | undefined>(undefined)

    useEffect(() => {
        const dest = window.location.href.split("/go?to=")[1]
        setD(dest)
        // const visited = window.localStorage.getItem("visited")
        // if (visited === dest) {
        //     window.localStorage.removeItem("visited")
        //     window.history.back()
        // } else {
        //     window.localStorage.setItem("visited", dest)
        //     //@ts-ignore
        //     router.push(dest)
        // }
    }, [])

    return (
        <div>
            <Head>
                <meta httpEquiv="refresh" content={`0.1;url=${d}`}></meta>
            </Head>
        </div>
    )

    return <FullPageLoader />
}

export default index
