const isProd = process.env.NODE_ENV === 'production'
const withCss = require('@zeit/next-css')
const withPurgeCss = require('next-purgecss')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
    assetPrefix: isProd ? 'https://spikeslotwebsite.b-cdn.net' : '',
})

// module.exports = withPurgeCss(withCss())

// withBundleAnalyzer({
//     assetPrefix: isProd ? 'https://spikeslotwebsite.b-cdn.net' : '',
// })

// last working commit : 
// fix -> e9a2f6e19a55667d63c173eae5328acbc47e33d4
