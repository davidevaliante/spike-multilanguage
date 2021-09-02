export const PRIVACY_POLICY = `
query PRIVACY_POLICY{
    cookiePolicy{
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
