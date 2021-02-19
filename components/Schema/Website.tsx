import React from 'react'

export const SlotListSchema = () => {
    return {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        '@id': 'https://www.spikeslot.com/#website',
        url: 'https://www.spikeslot.com/',
        name: 'Spike | Consigli e trucchi slot online',
    }
}

export const HomeSchemaWebSiteData = () => {
    return {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        '@id': 'https://www.spikeslot.com/#website',
        url: 'https://www.spikeslot.com/',
        name: 'Spike | Consigli e trucchi slot online',
    }
}

export const HomeSchemaOrganizationData = () => {
    return {
        '@context': 'http://schema.org',
        '@type': 'Organization',
        '@id': 'https://www.spikeslot.com/#organization',
        url: 'https://www.spikeslot.com/',
        sameAs: ['https://www.instagram.com/spikeslot/', 'https://youtube.com/spikeslotmachine'],
        name: 'Spike | Consigli e trucchi slot online',
        logo: 'https://www.spikeslot.com/static/app_icon.svg'
    }
}

export const WebpageSchema = () => {
    return {
        '@context': 'http://schema.org',
        '@type': 'Organization',
        '@id': 'https://www.spikeslot.com/#organization',
        url: 'https://www.spikeslot.com/',
        sameAs: ['https://www.instagram.com/spikeslot/', 'https://youtube.com/spikeslotmachine'],
        name: 'Spike | Consigli e trucchi slot online',
        logo: 'https://www.spikeslot.com/static/app_icon.svg'
    }
}

export const HomeSchemaWebSite = () => {
    return (
        <script
            dangerouslySetInnerHTML={{ __html: JSON.stringify(HomeSchemaWebSiteData()) }}
            type='application/ld+json'
            key={`home_structured_website`} />
    )
}

export const HomeSchemaOrganization = () => {
    return (
        <script
            dangerouslySetInnerHTML={{ __html: JSON.stringify(HomeSchemaOrganizationData()) }}
            type='application/ld+json'
            key={`home_structured_org`} />
    )
}