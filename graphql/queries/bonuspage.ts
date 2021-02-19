export const BONUS_PAGE_BY_COUNTRY = `
query BONUS_PAGE_BY_COUNTRY($countryCode:String){
    bonusPages(where:{country:{code:$countryCode}}){
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
            tableLabel  
            collapsable
            bonus{
              bonus{
                country{
                  code
                }
                description
                acceptedPayments{
                  methodName
                }
                name
                bonus_guide{
                  slug
                }
                withDeposit
                noDeposit
                link
                rating
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