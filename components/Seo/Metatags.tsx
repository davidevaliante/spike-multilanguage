import React, { FunctionComponent, Fragment } from 'react'
import  Head  from 'next/head'

interface IMetatags {
    title : string,
    url : string,
    description : string,
    image : string,
    locale : string,
    contentLanguage? : string,
    ogType? : string,
}

const Metatags : FunctionComponent<IMetatags> = ({
    title,
    url,
    description,
    contentLanguage = 'it-IT',
    image,
    locale = 'it',
    ogType
}) => {
    console.log(title, url)
    return (
        <Head>
            <title>{title}</title>
            <link rel="canonical" href={url} />
            <meta
                name="description"
                content={description}>
            </meta>
            {/* <meta httpEquiv="content-language" content={contentLanguage}></meta> */}

            {/* <!-- Google / Search Engine Tags --> */}
            <meta itemProp="name" content={title} />
            <meta itemProp="description" content={description} />
            <meta itemProp="image" content={image}  />
            
            {/* <!-- Twitter Meta Tags --> */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* <!-- Facebook Meta Tags --> */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:locale" content={locale} />
            {ogType && <meta property="og:type" content={ogType} />}
            <meta property="og:site_name" content={title} />
        </Head>
    )
}

export default Metatags