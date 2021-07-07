import React, { Fragment, useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
const { create } = require('xmlbuilder2')
import { format } from 'date-fns'
import snakeCase from 'lodash/snakeCase'
import XMLViewer from 'react-xml-viewer'
import { replaceAll, mapJsonToArray } from '../../utils/Utils'
import { firebaseDatabaseUrl } from '../../data/firebaseConfig'
import AquaClient from './../../graphql/aquaClient'

const ALL_SLOTS = `
query{
    slots(
      where:{
        country:{
          code:"it"
        }
        status:"published"
      }
    ){
      name
      slug
      hasVltVersion
      hasBarVersion
      type
      status
      updated_at

    }
  }
`

const BONUS_GUIDES = `
query{
    bonusGuides(
      where:{
        country:{
          code:"it"
        }
      }
    ){
      slug
  
      updated_at
    
    }
  }
`

const ARTICLES = `
query{
    articles(
      where:{
        country:{
          code:"it"
        }
      }
    ){
      slug
  
      updated_at
    
    }
  }
`

const BLOG_ARTICLES = `
query{
    blogArticles(
      where:{
        country:{
          code:"it"
        }
      }
    ){
      slug
  
      updated_at
    
    }
  }
`

const PRODUCERS = `
query{
  producers(where:{
    country: {
      code:"it"
    }
  }){
    name
    slug
    updated_at
  }
}
`

const sitemapgenerator = () => {

  const [map, setMap] = useState(undefined)

  const aquaClient = new AquaClient()

  const [approved, setApproved] = useState(undefined)

  useEffect(() => {
    console.log(approved, 'approved')
  }, [approved])

  const [slots, setSlots] = useState(undefined)

  useEffect(() => {
    if (slots !== undefined) {
      // setOnlineSlots(slots.filter(s => s.type === 'GRATIS'))
      // setBarSlots(slots.filter(s => s.type === 'BAR'))
      // setVltSlots(slots.filter(s => s.type === 'VLT'))
    }
  }, [slots])

  const [barSlots, setBarSlots] = useState(undefined)

  useEffect(() => {
    if (barSlots !== undefined) {
      console.log(barSlots, 'barSlots')
    }
  }, [barSlots])

  const [onlineSlots, setOnlineSlots] = useState(undefined)

  useEffect(() => {
    if (onlineSlots !== undefined) {
      console.log(onlineSlots, 'onlineSlots')
    }
  }, [onlineSlots])

  const [vltSlots, setVltSlots] = useState(undefined)

  useEffect(() => {
    if (vltSlots !== undefined) {
      console.log(vltSlots, 'vltSlots')
    }
  }, [vltSlots])

  const [articles, setArticles] = useState(undefined)

  useEffect(() => {
    if (articles !== undefined) {
      console.log(articles, 'articles')
    }
  }, [articles])

  const [producers, setProducers] = useState(undefined)

  useEffect(() => {
    if (producers !== undefined) {
      console.log(producers, 'producers')
    }
  }, [producers])

  const [allSlots, setAllSlots] = useState(undefined)

  const getVideos = async () => {
    const videoResponse = await axios.get(`${firebaseDatabaseUrl}/AwsVideosApproved.json`)
    const data = mapJsonToArray(videoResponse.data)

    const raw = data.filter(v => v.title === undefined)
    const filled = data.filter(v => v.title !== undefined)

    setApproved(mapJsonToArray([...raw, ...filled]))
  }

  const getSlots = async () => {
    const slotResponse = await aquaClient.query({
      query: ALL_SLOTS,
      variables: {}
    })

    setAllSlots(slotResponse.data.data.slots)
  }

  const [guides, setGuides] = useState(undefined)

  const getGuides = async () => {
    const guideResponse = await aquaClient.query({
      query: BONUS_GUIDES,
      variables: {}
    })

    setGuides(guideResponse.data.data.bonusGuides)
  }

  const getArticles = async () => {
    const articleResponse = await aquaClient.query({
      query: ARTICLES,
      variables: {}
    })

    setArticles(articleResponse.data.data.articles)
  }

  const [blogArticles, setBlogArticles] = useState(undefined)

  const getBlogArticles = async () => {
    const blogArticleResponse = await aquaClient.query({
      query: BLOG_ARTICLES,
      variables: {}
    })
    setBlogArticles(blogArticleResponse.data.data.blogArticles)
  }

  const getProducers = async () => {
    const producersResponse = await aquaClient.query({
      query: PRODUCERS,
      variables: {}
    })
    setProducers(producersResponse.data.data.producers)
  }

  useEffect(() => {
    getSlots()
    getVideos()
    getGuides()
    getArticles()
    getBlogArticles()
    getProducers()
  }, [])


  const test = () => {
    const rootUrl = 'https://spikeslot.com'

    const mainUrls = [
      '/videos/it',
      '/slots/it',
      '/slot-bar/it',
      '/slot-vlt/it',
      '/migliori-bonus-casino',
      '/guide-e-trucchi/it',
      '/blog/it'
    ]

    const r = create().ele('urlset', {
      'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
    });

    r.com('Main Urls START')

    mainUrls.forEach(urlToAdd => {
      const url = r.ele('url')
      url.ele('loc').txt(`${rootUrl}${urlToAdd}`)
      url.ele('lastmod').txt(`${format(new Date(), 'yyyy-MM-dd')}`)
      url.ele('priority').txt(`0.8`)
    })

    r.com('Main Urls END')

    r.com('Videos Urls START')

    approved.filter(({ title, time }) => title !== undefined && time !== undefined).forEach(video => {
      const url = r.ele('url')
      url.ele('loc').txt(`${rootUrl}/videos/${replaceAll(snakeCase(video.title), '€', 'euro')}/it`)
      url.ele('lastmod').txt(`${format(new Date(video.time), 'yyyy-MM-dd')}`)
      url.ele('priority').txt(`0.8`)
    })

    r.com('Videos Urls END')

    r.com('Slots Urls START')

    allSlots.forEach(slot => {
      const url = r.ele('url')
      url.ele('loc').txt(`${rootUrl}/slot/${slot.slug}/it`)
      url.ele('lastmod').txt(`${format(new Date(slot.updated_at), 'yyyy-MM-dd')}`)
      url.ele('priority').txt(`0.8`)
    })

    r.com('Slots Urls END')

    r.com('Guides Urls START')

    guides.forEach(guide => {
      const url = r.ele('url')
      url.ele('loc').txt(`${rootUrl}/guida/${guide.slug}/it`)
      url.ele('lastmod').txt(`${format(new Date(guide.updated_at), 'yyyy-MM-dd')}`)
      url.ele('priority').txt(`0.8`)
    })

    r.com('Articles Urls END')

    articles.forEach(article => {
      const url = r.ele('url')
      url.ele('loc').txt(`${rootUrl}/articoli/${article.slug}/it`)
      url.ele('lastmod').txt(`${format(new Date(article.updated_at), 'yyyy-MM-dd')}`)
      url.ele('priority').txt(`0.8`)
    })

    r.com('Articles Urls END')

    r.com('Blog Articles Urls START')

    blogArticles.forEach(article => {
      const url = r.ele('url')
      url.ele('loc').txt(`${rootUrl}/blog/${article.slug}/it`)
      url.ele('lastmod').txt(`${format(new Date(article.updated_at), 'yyyy-MM-dd')}`)
      url.ele('priority').txt(`0.8`)
    })

    r.com('Blog Articles Urls END')

    r.com('Producers Urls START')

    producers.forEach(prod => {
      const url = r.ele('url')
      url.ele('loc').txt(`${rootUrl}/producer/${prod.slug}/it`)
      url.ele('lastmod').txt(`${format(new Date(prod.updated_at), 'yyyy-MM-dd')}`)
      url.ele('priority').txt(`0.8`)
    })

    r.com('Producers Urls END')

    // r.com('Bar Slot Urls START')

    // barSlots.filter(({ name, time }) => name !== undefined && time !== undefined).forEach(slot => {
    //     const url = r.ele('url')
    //     url.ele('loc').txt(`${rootUrl}/slot-bar/${snakeCase(slot.name)}/it`)
    //     url.ele('lastmod').txt(`${format(new Date(slot.time), 'yyyy-MM-dd')}`)
    //     url.ele('priority').txt(`0.8`)
    // })

    // r.com('Bar Slot Urls END')

    // r.com('VLT Slot Urls START')

    // vltSlots.filter(({ name, time }) => name !== undefined && time !== undefined).forEach(slot => {
    //     const url = r.ele('url')
    //     url.ele('loc').txt(`${rootUrl}/slot-vlt/${snakeCase(slot.name)}/it`)
    //     url.ele('lastmod').txt(`${format(new Date(slot.time), 'yyyy-MM-dd')}`)
    //     url.ele('priority').txt(`0.8`)
    // })

    // r.com('VLT Slot Urls END')

    // r.com('Articles Urls START')

    // articles.filter(({ title, time }) => title !== undefined && time !== undefined).forEach(article => {
    //     const url = r.ele('url')
    //     url.ele('loc').txt(`${rootUrl}/article/${snakeCase(article.title)}/it`)
    //     url.ele('lastmod').txt(`${format(new Date(article.time), 'yyyy-MM-dd')}`)
    //     url.ele('priority').txt(`0.8`)
    // })

    // r.com('Articles Urls END')

    // r.com('Producers Urls START')

    // producers.filter(({ name, time }) => name !== undefined && time !== undefined).forEach(producer => {
    //     const url = r.ele('url')
    //     url.ele('loc').txt(`${rootUrl}/producer/${producer.name}/it`)
    //     url.ele('lastmod').txt(`${format(new Date(producer.time), 'yyyy-MM-dd')}`)
    //     url.ele('priority').txt(`0.8`)
    // })

    // r.com('Producers Urls END')

    const xml = r.end({ prettyPrint: true });
    console.log(xml);
    setMap(xml)
  }


  return <Fragment>
    <StyleProvider>
      {approved && <button onClick={() => test()}>Genera Sitemap</button>}
      {map && <XMLViewer xml={map} />}
    </StyleProvider>
  </Fragment>
}

const StyleProvider = styled.div`
    background : white;
    min-height : 100vh;
    width : 100%;
    color : black;
`

export default sitemapgenerator