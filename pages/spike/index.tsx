import React, { Fragment, useContext } from 'react'
import { FunctionComponent } from 'react'
import { NextPageContext } from 'next'
import AquaClient from '../../graphql/aquaClient'
import { ABOUT_PAGE } from './../../graphql/queries/about'
import DynamicContent, { DynamicContentProps } from './../../components/DynamicContent/DynamicContent'
import { Seo } from './../../graphql/schema'
import NavbarProvider from '../../components/Navbar/NavbarProvider'
import { BodyContainer, MainColumn, RightColumn } from '../../components/Layout/Layout'
import CustomBreadcrumbs from '../../components/Breadcrumbs/CustomBreadcrumbs'
import Head from 'next/head'
import Icon from '../../components/Icons/Icon'
import LatestVideoCard from '../../components/Cards/LatestVideoCard'
import { ApolloBonusCardReveal } from '../../data/models/Bonus'
import ApolloBonusCardRevealComponent from './../../components/Cards/BonusCardReveal'
import { HOME_BONUS_LIST } from '../../graphql/queries/bonus'
import fetch from 'cross-fetch'
import { getCanonicalPath } from '../../utils/Utils'
import { LocaleContext } from '../../context/LocaleContext'

interface Props extends DynamicContentProps {
    seo: Seo
    bonusList: { bonus: ApolloBonusCardReveal }[]
}

const About: FunctionComponent<Props> = ({ seo, content, bonusList }) => {

    const { t } = useContext(LocaleContext)

    return (
        <Fragment>
            <Head>
                <title>{seo.seoTitle}</title>
                <link rel="canonical" href={getCanonicalPath()} />
                <meta
                    name="description"
                    content={seo.seoDescription}>
                </meta>
                <meta httpEquiv="content-language" content="it-IT"></meta>
            </Head>
            <NavbarProvider currentPage='about' countryCode={''}>
                <div style={{ width: '100%', marginBottom: '6rem', paddingTop : '3rem' }}>
                    <BodyContainer>
                        <MainColumn>
                            <CustomBreadcrumbs style={{ marginBottom: '2rem' }} from='about' name='SPIKE' />
                            <DynamicContent content={content} />
                        </MainColumn>
                        <RightColumn>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon
                                    width={56}
                                    height={56}
                                    source='/icons/flame_icon.svg' />
                                <h1 className='video-header'>{t("Watch SPIKE's latest video")}</h1>
                            </div>
                            <LatestVideoCard />
                            <h1 className='bonus-header'>{t("The best welcome bonuses")}</h1>
                            <div className='bonus-column-container'>
                                {bonusList && bonusList.map(bo => <ApolloBonusCardRevealComponent key={bo.bonus.name} bonus={bo.bonus} />)}
                            </div>
                        </RightColumn>
                    </BodyContainer>
                </div>
                
            </NavbarProvider>
        </Fragment>

    )
}

export async function getServerSideProps(context: NextPageContext) {
    const publicIp = require('public-ip')

    let ip: any
    ip = await publicIp.v4()

    const res = await fetch('http://ip-api.com/json/' + ip)
    const country: any = await res.json()
    const countryCode = country.countryCode.toLowerCase();
    const aquaClient = new AquaClient()

    const aboutPageResponse = await aquaClient.query({
        query: ABOUT_PAGE,
        variables: {}
    })

    const bonusListResponse = await aquaClient.query({
        query: HOME_BONUS_LIST,
        variables: {
            countryCode: countryCode
        }
    })
    
    const bonusList = bonusListResponse.data.data.homes[0].bonuses.bonus
    return {
        props: {
            seo: aboutPageResponse.data.data.about.seo,
            content: aboutPageResponse.data.data.about.content,
            bonusList: bonusList,
            countryCode:countryCode
        }
    }
}

export default About
