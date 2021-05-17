export const ABOUT_PAGE = `
query ABOUT_PAGE($countryCode:String="it"){
    aboutPages(where: {country: {code: $countryCode}}){
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