import type { NextApiRequest, NextApiResponse } from 'next'
import AquaClient from '../../graphql/aquaClient'
import fs from 'fs'

const websiteRoot = 'https://spikeslot.com'

export default async (req: NextApiRequest, res: NextApiResponse) => {

    const { last } = req.query 

    //@ts-ignore
    const limit = last ? parseInt(last) : 25

    const posts = await fetchData(limit)

    const rss = generateRss(posts);

    fs.writeFileSync('./public/rss.xml', rss);

    res.status(200).json({
        status : 'Updated Successfully',
        data : posts
    })
}

interface BlogPostRss {
    created_at : string
    image : {
        url : string
    }
    seo : {
        seoDescription : string
    }
    slug : string
    title : string
}

const generateRssItem = (post: BlogPostRss): string => `
    <item>
        <guid>${websiteRoot}/blog/${post.slug}/it</guid>
        <title>${post.title}</title>
        <link>${websiteRoot}/blog/${post.slug}</link>
        <description>${post.seo.seoDescription}</description>
        <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
    </item>
`

const generateRss = (posts: BlogPostRss[]): string => `
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
            <channel>
            <title>Le Migliori Slot Online | Slot da Bar e VLT | SPIKE SLOT</title>
            <link>${websiteRoot}/blog/it</link>
            <description>Nel Blog di SPIKE slot potrai trovare articoli di approfondimento e le rubriche periodiche su vari argomenti oltre le Slot e il Gioco d'azzardo.</description>
            <language>it</language>
            <lastBuildDate>${new Date(posts[0].created_at).toUTCString()}</lastBuildDate>
            <atom:link href="https://spikeslot.com/rss.xml" rel="self" type="application/rss+xml" />
            ${posts.map(generateRssItem).join('')}
        </channel>
    </rss>
`

const fetchData = async (numberOfSPosts : number) => {

    const aquaClient = new AquaClient()

    const postsQuery = `
        query{
            blogArticles(sort:"created_at:desc", limit:${numberOfSPosts}){
                title
                created_at
                seo{
                    seoDescription
                }
                slug
                image{
                    url
                }
            }
        }
    `

    const latestPost =  await aquaClient.query({
        query : postsQuery,
        variables :{}
    })

    const posts = latestPost.data.data.blogArticles as BlogPostRss[]

    return posts
}