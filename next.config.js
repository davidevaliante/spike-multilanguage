const isProd = process.env.NODE_ENV === 'production'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
// // module.exports = withBundleAnalyzer({})

module.exports = withBundleAnalyzer({
    assetPrefix: isProd ? 'https://spikeslotgratis.b-cdn.net' : '',
})

// module.exports = withBundleAnalyzer()
