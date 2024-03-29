export const ARTICLE_BY_SLUG = `
query ARTICLE_BY_SLUG($slug:String, $countryCode:String){
    articles(where: {slug:$slug, country: {code: $countryCode}}){
      created_at
      title
      slug
      seo{
        seoTitle
        seoDescription
      }
      image{
        url
        alternativeText
      }

      country{
        code
      }

      content{
        
          ...on ComponentArticleArticle{
            type
            article
          }
        
          ...on ComponentBonusListBonusList{
            type
            direction
            bonus{
              bonus{
                name
                bonus_guide{
                  slug
                }
                withDeposit
                noDeposit
                link
                borderColor
                backgroundColor
                tips
                circular_image{
                  url
                  alternativeText
                }
              }
            }
          }
        
          ...on ComponentSlotListSlotList{
            type
            slot{
              slot{
                name
                rating
                slug
                image{
                  url
                  alternativeText
                }
              }
            }
          }
        
         ...on ComponentVideoComponentVideoComponent{
              type
              videoUrl
              thumbnailUrl
        }
      }
    }
  }
`

export const ARTICLES_BY_COUNTRY = `
query ARTICLE_BY_SLUG($countryCode:String){
  articles(sort: "created_at:desc",where: {country:{code:$countryCode}}){
    title
    slug
    seo{
      seoTitle
      seoDescription
    }
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
