export const BLOG_ARTICLE_BY_SLUG = `
query BLOG_ARTICLE_BY_SLUG($slug:String){
    blogArticles(where:{slug:$slug}){
      article
      title
      image{
        url
      }
      seo{
        seoTitle
        seoDescription
      }
    }
  }
`

export const BLOG_ARTICLES_BY_COUNTRY = `
query ARTICLES_BY_COUNTRY($countryCode:String){
  blogArticles(where: {country:{code:$countryCode}}){
 		title
    tags
    slug
    created_at

    image{
      url
    }

    country{
      code
    }

  }
}
`