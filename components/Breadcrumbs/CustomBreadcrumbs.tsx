import React, { Fragment, useContext } from 'react'
import styled from 'styled-components'
import { countryContext } from './../../context/CountryContext'
import { FunctionComponent, CSSProperties } from 'react'
import Link from 'next/link'
import Icon from '../Icons/Icon'
import lowerCase from 'lodash/lowerCase'
import capitalize from 'lodash/capitalize'
import {useTranslation} from 'react-i18next'

interface Props {
    from: 'slot' | 'article' | 'slot-list' | 'producer' | 'blog' | 'guide' | 'guide-list' | 'vlt-slot-list' | 'article' | 'about' | 'privacy-policy' | 'contacts' | 'blog-article' | 'bar-slot-list',
    producerName?: string,
    producerSlug?: string,
    slotName?: string,
    slotSlug?: string,
    guideSlug?: string
    name?: string,
    currentPageLink?: string
    style?: CSSProperties
}

const websiteRoot = 'https://spikeslot.com'

const Breadcrumbs: FunctionComponent<Props> = ({ from, name, currentPageLink, producerName, producerSlug, slotSlug, slotName, guideSlug, style }) => {

    const { currentCountry } = useContext(countryContext)
    const {t} = useTranslation()

    const breadCrumbRenderer = () => {
        if (from === 'slot') {
            const SlotBreadCrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Slots",
                        "item": `${websiteRoot}/slots/${currentCountry}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": `${producerName}`,
                        "item": `${websiteRoot}/producer/${producerSlug}/${currentCountry}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 4,
                        "name": `${slotName}`,
                        "item": `${websiteRoot}/slot/${slotSlug}/${currentCountry}`
                    }]
                }
            }

            const SlotBreadCrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(SlotBreadCrumbObject()) }}
                    type='application/ld+json'
                    key={`slot_breadcrumb`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <SlotBreadCrumb />
                <Link href={'/'}>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <a href={`/slots/${currentCountry}`}>
                    Slots
                </a>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <Link href={`/producer/[slug]/[countryCode]`} as={`/producer/${producerSlug}/${currentCountry}`}>
                    <a>{producerName}</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <Link href='#'>
                    <a>{capitalize(lowerCase(name))}</a>
                </Link>
            </div>
        }

        if (from === 'slot-list') {

            const SlotListBreadCrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Slots",
                        "item": `${websiteRoot}/slots/${currentCountry}`
                    }]
                }
            }

            const SlotListBreadCrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(SlotListBreadCrumbObject()) }}
                    type='application/ld+json'
                    key={`slot_list_breadcrumbs`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <SlotListBreadCrumb />
                <Link href={'/'}>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <a href={`/slots/${currentCountry}`}>
                    <a>Slots</a>
                </a>
            </div>
        }

        if (from === 'vlt-slot-list') {

            const VltSlotListBreadCrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Vlt Slots",
                        "item": `${websiteRoot}/vlt-slots/${currentCountry}`
                    }]
                }
            }

            const VltSlotListBreadCrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(VltSlotListBreadCrumbObject()) }}
                    type='application/ld+json'
                    key={`slot_list_breadcrumbs`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <VltSlotListBreadCrumb />
                <Link href={'/'}>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <Link href='#'>
                    <a>Vlt Slots</a>
                </Link>
            </div>
        }

        if (from === 'bar-slot-list') {

            const VltSlotListBreadCrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Vlt Slots",
                        "item": `${websiteRoot}/slot-bar/${currentCountry}`
                    }]
                }
            }

            const VltSlotListBreadCrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(VltSlotListBreadCrumbObject()) }}
                    type='application/ld+json'
                    key={`slot_list_breadcrumbs`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <VltSlotListBreadCrumb />
                <Link href={currentCountry === 'it' ? '/' : `/${currentCountry}`}>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <Link href='#'>
                    <a>Bar Slots</a>
                </Link>
            </div>
        }

        if (from === 'producer') {

            const ProducerCrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": `${producerName}`,
                        "item": `${websiteRoot}/producer/${producerSlug}/${currentCountry}`
                    }]
                }
            }

            const ProducerCrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ProducerCrumbObject()) }}
                    type='application/ld+json'
                    key={`slot_breadcrumb`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <ProducerCrumb />
                <Link href='/'>
                    <a>Home</a>
                </Link>
                {/* <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <p>
                    {Translations.producersSlug[currentCountry]}
                </p> */}
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <a href={currentPageLink}>
                    {name}
                </a>
            </div>
        }

        if (from === 'blog') {
            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link href='/'>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <a href={`/blog/${currentCountry}`}>
                    Blog
                </a>
            </div>
        }

        if (from === 'guide') {

            const GuideBreadcrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": `Guide e Trucchi`,
                        "item": `${websiteRoot}/guide-e-trucchi/${currentCountry}`
                    }, {
                        "@type": "ListItem",
                        "position": 3,
                        "name": `${name}`,
                        "item": `${websiteRoot}/guida/${guideSlug}/${currentCountry}`
                    }]
                }
            }

            const GuideBreadcrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(GuideBreadcrumbObject()) }}
                    type='application/ld+json'
                    key={`slot_breadcrumb`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <GuideBreadcrumb />
                <Link href='/'>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <a href={`/guide-e-trucchi/${currentCountry}`}>
                    {t("Guides and Tricks")}
                </a>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <p>
                    {name}
                </p>
            </div>
        }

        if (from === 'article') {
            const ArticleBreadcrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": `Guide e Trucchi`,
                        "item": `${websiteRoot}/guide-e-trucchi/${currentCountry}`
                    }, {
                        "@type": "ListItem",
                        "position": 3,
                        "name": `${name}`,
                        "item": `${websiteRoot}/articoli/${guideSlug}/${currentCountry}`
                    }]
                }
            }

            const ArticleBreadcrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ArticleBreadcrumbObject()) }}
                    type='application/ld+json'
                    key={`article_breadcrumb`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <ArticleBreadcrumb />
                <Link href='/'>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <a href={`/guide-e-trucchi/${currentCountry}`}>
                    {t("Guides and Tricks")}
                </a>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <p>
                    {name}
                </p>
            </div>
        }

        if (from === 'blog-article') {
            const BlogArticleBreadcrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": `Guide e Trucchi`,
                        "item": `${websiteRoot}/guide-e-trucchi/${currentCountry}`
                    }, {
                        "@type": "ListItem",
                        "position": 3,
                        "name": `${name}`,
                        "item": `${websiteRoot}/articoli/${guideSlug}/${currentCountry}`
                    }]
                }
            }

            const ArticleBreadcrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(BlogArticleBreadcrumbObject()) }}
                    type='application/ld+json'
                    key={`article_breadcrumb`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <ArticleBreadcrumb />
                <Link href='/'>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <a href={`/blog/${currentCountry}`}>
                    Blog
                </a>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <p>
                    {name}
                </p>
            </div>
        }

        if (from === 'guide-list') {
            const GuideListBreadcrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": `Guide e Trucchi`,
                        "item": `${websiteRoot}/guides/${currentCountry}`
                    }]
                }
            }

            const GuideListBreadcrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(GuideListBreadcrumbObject()) }}
                    type='application/ld+json'
                    key={`slot_breadcrumb`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <GuideListBreadcrumb />
                <Link href='/'>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <a href={`/guide-e-trucchi/${currentCountry}`}>
                    {t(`${name}`)}
                </a>
            </div>
        }

        if (from === 'about') {
            const AboutBreadcrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": `SPIKE`,
                        "item": `${websiteRoot}/spike`
                    }]
                }
            }

            const AboutListBreadcrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(AboutBreadcrumbObject()) }}
                    type='application/ld+json'
                    key={`about_breadcrumb`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <AboutListBreadcrumb />
                <Link href='/'>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <a href={`/spike`}>
                    {name}
                </a>
            </div>
        }

        if (from === 'privacy-policy') {
            const PrivacyPolicyBreadcrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": `Privacy Policy`,
                        "item": `${websiteRoot}/cookie-privacy-policy`
                    }]
                }
            }

            const PrivacyPolicyBreadcrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(PrivacyPolicyBreadcrumbObject()) }}
                    type='application/ld+json'
                    key={`privacy_breadcrumb`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <PrivacyPolicyBreadcrumb />
                <Link href='/'>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <a href={`/cookie-privacy-policy`}>
                    {name}
                </a>
            </div>
        }

        if (from === 'contacts') {
            const ContactsBreadcrumbObject = () => {
                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${websiteRoot}`
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": `Contatti`,
                        "item": `${websiteRoot}/contatti`
                    }]
                }
            }

            const ContactsBreadcrumb = () => {
                return <script
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ContactsBreadcrumbObject()) }}
                    type='application/ld+json'
                    key={`contacts_breadcrumb`} />
            }

            return <div style={{ display: 'flex', alignItems: 'center' }}>
                <ContactsBreadcrumb />
                <Link href='/'>
                    <a>Home</a>
                </Link>
                <Icon style={{ margin: '0 .5rem' }} width={16} height={16} source='/icons/chevron_colored.svg' />
                <p>
                    {name}
                </p>
            </div>
        }
    }


    return (
        <Fragment>
            <Container style={style}>
                {breadCrumbRenderer()}
            </Container>
        </Fragment>
    )
}

const Container = styled.div`
    display : flex;
    color : ${(props) => props.theme.colors.primary};

    a{
        cursor : pointer;
        color : ${(props) => props.theme.colors.primary};
    }

`

export default Breadcrumbs
