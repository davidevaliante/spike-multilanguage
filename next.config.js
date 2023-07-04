const isProd = process.env.NODE_ENV === 'production'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
// // module.exports = withBundleAnalyzer({})

module.exports = withBundleAnalyzer({
  assetPrefix: isProd ? 'https://spikeslotwebsite.b-cdn.net' : '',
  images: {
    domains: ['dzyz6pzqu8wfo.cloudfront.net', 'images.spikeslot.com'],
  },
})

// module.exports = withBundleAnalyzer()
