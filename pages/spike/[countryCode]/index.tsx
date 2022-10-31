import React, { Fragment, useContext, useState, useEffect } from 'react'
import { FunctionComponent } from 'react'
import { NextPageContext, GetServerSideProps } from 'next'
import AquaClient from '../../../graphql/aquaClient'
import { ABOUT_PAGE } from '../../../graphql/queries/about'
import DynamicContent, { DynamicContentProps } from '../../../components/DynamicContent/DynamicContent'
import { Seo } from '../../../graphql/schema'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn, RightColumn } from '../../../components/Layout/Layout'
import CustomBreadcrumbs from '../../../components/Breadcrumbs/CustomBreadcrumbs'
import Head from 'next/head'
import Icon from '../../../components/Icons/Icon'
import LatestVideoCard from '../../../components/Cards/LatestVideoCard'
import { ApolloBonusCardReveal } from '../../../data/models/Bonus'
import ApolloBonusCardRevealComponent from '../../../components/Cards/BonusCardReveal'
import { HOME_BONUS_LIST } from '../../../graphql/queries/bonus'
import fetch from 'cross-fetch'
import { getCanonicalPath, getUserCountryCode } from '../../../utils/Utils'
import { LocaleContext } from '../../../context/LocaleContext'
import FullPageLoader from '../../../components/Layout/FullPageLoader'
import { HOME } from '../../../graphql/queries/home'
import CountryEquivalentPageSnackbar from '../../../components/Snackbars/CountryEquivalentPageSnackbar'

interface Props extends DynamicContentProps {
    seo: Seo
    bonusList: { bonus: ApolloBonusCardReveal }[]
    _requestedCountryCode: string
}

const About: FunctionComponent<Props> = ({ seo, content, bonusList, _requestedCountryCode }) => {
    const aquaClient = new AquaClient()

    const [loading, setLoading] = useState(true)

    const {
        t,
        appCountry: contextCountry,
        userCountry,
        setUserCountry,
        setAppCountry: setContextCountry,
    } = useContext(LocaleContext)
    const [userCountryEquivalentExists, setUserCountryEquivalentExists] = useState(false)
    const [canonicalPath, setCanonicalPath] = useState(getCanonicalPath())

    const getCountryData = async () => {
        const geoLocatedCountryCode = await getUserCountryCode()
        setUserCountry(geoLocatedCountryCode)

        if (geoLocatedCountryCode !== _requestedCountryCode) {
            const aboutPageResponse = await aquaClient.query({
                query: ABOUT_PAGE,
                variables: {
                    countryCode: geoLocatedCountryCode,
                },
            })

            if (aboutPageResponse.data.data.aboutPages[0]) setUserCountryEquivalentExists(true)
        }
        setContextCountry(_requestedCountryCode)
        setLoading(false)
    }

    useEffect(() => {
        getCountryData()
        setLoading(false)
    }, [])

    useEffect(() => {
        setContextCountry(_requestedCountryCode)
    }, [_requestedCountryCode])

    return (
        <Fragment>
            <Head>
                <title>{seo.seoTitle}</title>
                <link rel='canonical' href={canonicalPath} />
                <meta name='description' content={seo.seoDescription}></meta>
                <meta httpEquiv='content-language' content='it-IT'></meta>
            </Head>
            <NavbarProvider currentPage='about' countryCode={contextCountry}>
                <div style={{ width: '100%', marginBottom: '6rem', paddingTop: '3rem' }}>
                    {userCountryEquivalentExists && <CountryEquivalentPageSnackbar path={`/spike/${userCountry}`} />}
                    <BodyContainer>
                        <MainColumn>
                            <CustomBreadcrumbs style={{ marginBottom: '2rem' }} from='about' name='SPIKE' />
                            <DynamicContent content={content} />
                        </MainColumn>
                        <RightColumn>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon width={56} height={56} source='/icons/flame_icon.svg' />
                                <h1 className='video-header'>{t("Watch SPIKE's latest video")}</h1>
                            </div>
                            <LatestVideoCard />
                            <h1 className='bonus-header'>{t('The best welcome bonuses')}</h1>
                            <div className='bonus-column-container'>
                                {bonusList &&
                                    bonusList.map((bo) => (
                                        <ApolloBonusCardRevealComponent key={bo.bonus.name} bonus={bo.bonus} />
                                    ))}
                            </div>
                        </RightColumn>
                    </BodyContainer>
                </div>
            </NavbarProvider>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const { countryCode } = query
    const aquaClient = new AquaClient()

    const aboutPageResponse = await aquaClient.query({
        query: ABOUT_PAGE,
        variables: {
            countryCode: countryCode,
        },
    })

    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: countryCode,
        },
    })

    const bonusList = bonusListResponse.data.data.homes[0].bonuses.bonus
    return {
        props: {
            seo: aboutPageResponse.data.data.aboutPages[0].seo,
            content: aboutPageResponse.data.data.aboutPages[0].content,
            bonusList: bonusList,
            _requestedCountryCode: countryCode,
        },
    }
}

export default About
