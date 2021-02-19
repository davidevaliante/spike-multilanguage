export const PAYMENT_METHOD_GENERAL_PAGE_BY_COUNTRY = `
query PAGE_BY_COUNTRY($countryCode:String="it"){
  paymentGenerals(where:{country:{code:$countryCode}}){
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
              country{
                code
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