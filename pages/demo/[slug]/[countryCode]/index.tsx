import React, { Fragment, useEffect } from 'react'
import AquaClient from '../../../../graphql/aquaClient'
import { DEMO_FOR_SLOT_WITH_SLUG } from './../../../../graphql/queries/slots'
import { Slot } from '../../../../graphql/schema'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import Head from 'next/head'
import useOrientationChange from '../../../../hooks/useOrientationChange'
import { getCanonicalPath, goFullScreen } from '../../../../utils/Utils'

interface Props {
    slotData: Slot
}
//TODO da cancellare

const Demo: FunctionComponent<Props> = ({ slotData }) => {

    const orientation = typeof window !== 'undefined' && useOrientationChange()

    useEffect(() => {
        if (orientation == 'landscape') {
            try {
                goFullScreen()
            } catch (error) {
                console.log(error)
            }
        }
    }, [orientation])

    return (
        <Fragment>
            <Head>
                <link rel="canonical" href={getCanonicalPath()} />

                <meta name="robots" content="noindex" />
            </Head>

            <div>
                <StyleProvider>
                    <iframe
                        allowFullScreen
                        src={slotData.playLink} />
                </StyleProvider>

                <Overlay>

                </Overlay>
            </div>
        </Fragment>

    )
}

const FullScreenButton = styled.div`
`

const StyleProvider = styled.div`
    width : 100%;
    height : 100vh;
    position : relative;

    font-family : Raleway, sans-serif;

    iframe{
        width : 100%;
        height : 100%;
    }
`

const Overlay = styled.div`
    width : 100%;
    height : 100vh;
    position : absolute;
`

export async function getServerSideProps({ query }) {

    const slug = query.slug as string
    const country = query.countryCode as string

    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const response = await aquaClient.query({
        query: DEMO_FOR_SLOT_WITH_SLUG,
        variables: { slug: slug, countryCode: country }
    })

    return {
        props: {
            query,
            slotData: response.data.data.slots[0],
        }
    }
}

export default Demo
