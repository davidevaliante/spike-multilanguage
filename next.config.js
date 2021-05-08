const isProd = process.env.NODE_ENV === 'production'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })
  module.exports = withBundleAnalyzer({})

module.exports = withBundleAnalyzer({
    assetPrefix: isProd ? 'https://spikeslotwebsite.b-cdn.net' : '',
})