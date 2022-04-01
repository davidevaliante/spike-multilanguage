export const BLOG_ARTICLE_BY_SLUG = `
query BLOG_ARTICLE_BY_SLUG($slug:String){
    blogArticles(where:{slug:$slug}){
      article
      created_at
      updated_at
      title
      slug
      image{
        url
        alternativeText
      }
      seo{
        seoTitle
        seoDescription
        shareImg
      }
    }
  }
`

export const BLOG_ARTICLES_BY_COUNTRY = `
query ARTICLES_BY_COUNTRY($countryCode:String="it"){
  blogArticles(where: {country:{code:$countryCode}}, sort: "created_at:desc"){
    id
 		title
    tags
    slug
    created_at

    image{
      url
      alternativeText
    }

    country{
      code
    }

  }
}
`
