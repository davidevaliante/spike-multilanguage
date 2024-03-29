export const BLOG_LIST_BY_COUNTRY = `
query BLOG_LIST_BY_COUNTRY($countryCode:String){
    blogLists(where: {country: {code:$countryCode}}){
      seo{
        seoTitle
        seoDescription
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
