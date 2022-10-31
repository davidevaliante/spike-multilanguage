import { Seo } from '../../graphql/schema'
import DynamicContent, {
    DynamicArticle,
    DynamicBonusList,
    DynamicSlotList,
    DynamicVideo,
} from '../../components/DynamicContent/DynamicContent'
import { FunctionComponent, useContext, useState, useEffect } from 'react'
import AquaClient from '../../graphql/aquaClient'
import { useRouter } from 'next/router'
import { LocaleContext } from '../../context/LocaleContext'
import { getUserCountryCode, getBonusPageRedirectUrlForCountry, getCanonicalPath } from '../../utils/Utils'
import { BONUS_PAGE_BY_COUNTRY } from '../../graphql/queries/bonuspage'
import NavbarProvider from '../../components/Navbar/NavbarProvider'
import Head from 'next/head'
import { BodyContainer, MainColumn } from '../../components/Layout/Layout'
import CountryEquivalentPageSnackbar from '../../components/Snackbars/CountryEquivalentPageSnackbar'

interface BonusPage {
    seo: Seo
    content: (DynamicArticle | DynamicBonusList | DynamicSlotList | DynamicVideo)[]
}

interface Props {
    _shallow: boolean
    _bonusPage: BonusPage
    _requestedCountryCode: string
}

const automaticRedirect = false

const index: FunctionComponent<Props> = ({ _shallow, _bonusPage, _requestedCountryCode }) => {
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)
    const router = useRouter()
    const {
        t,
        appCountry: contextCountry,
        setAppCountry: setContextCountry,
        userCountry,
        setUserCountry,
    } = useContext(LocaleContext)

    const [loading, setLoading] = useState(true)
    const [bonusPage, setBonusPage] = useState<BonusPage>(_bonusPage)
    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)

    return (
        <NavbarProvider currentPage='/bonus-bakeca' countryCode={contextCountry}>
            <Head>
                <title>{t('Best Casino Bonuses |  SPIKE')}</title>
                <link rel='canonical' href={`https://spikeslotgratis.com/bonus-benvenuto`} />
                <meta name='robots' content='noindex' />
                <meta
                    name='description'
                    content='La classifica di SPIKE sui migliori bonus dei Casinò Online italiani'
                ></meta>

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp='name' content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo" />
                <meta
                    itemProp='description'
                    content='La classifica di SPIKE sui migliori bonus dei Casinò Online italiani'
                />
                <meta itemProp='image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta
                    name='twitter:title'
                    content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                />
                <meta
                    name='twitter:description'
                    content='La classifica di SPIKE sui migliori bonus dei Casinò Online italiani'
                />
                <meta name='twitter:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />

                <meta property='og:image' content={'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'} />
                <meta property='og:locale' content={'it'} />
                <meta property='og:type' content='article' />
                <meta
                    property='og:description'
                    content='La classifica di SPIKE sui migliori bonus dei Casinò Online italiani'
                />
                <meta
                    property='og:site_name'
                    content="SPIKE Slot | Il Blog n.1 in Italia su Slot Machines e Gioco D'azzardo"
                />
            </Head>

            <BodyContainer>
                {userCountryEquivalentExists && (
                    <CountryEquivalentPageSnackbar path={getBonusPageRedirectUrlForCountry(userCountry)} />
                )}
                <div style={{ padding: '1rem', maxWidth: '1200px' }}>
                    <DynamicContent content={bonusPage?.content} isBakeca={true} />
                </div>
            </BodyContainer>
        </NavbarProvider>
    )
}

export const getServerSideProps = async ({ params }) => {
    const aquaClient = new AquaClient(`https://spikeapistaging.tech/graphql`)

    const requestedCountryCode = 'bakeca'

    const data = await aquaClient.query({
        query: BONUS_PAGE_BY_COUNTRY,
        variables: { countryCode: requestedCountryCode },
    })

    return {
        props: {
            _bonusPage: data.data.data.bonusPages[0],
            _requestedCountryCode: requestedCountryCode,
            _shallow: false,
        },
    }
}

export default index
