const isProd = process.env.NODE_ENV === 'production'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
// // module.exports = withBundleAnalyzer({})

module.exports = withBundleAnalyzer({
    assetPrefix: isProd ? 'https://spikeslotgratis.b-cdn.net' : '',
    images: {
        domains: ['images.spikeslot.com'],
    },
})

// module.exports = withBundleAnalyzer()
