export const VLT_SLOT_LIST_BY_COUNTRY = `
query VLT_SLOT_LIST_BY_COUNTRY($countryCode:String){
    vltSlotLists(where: {country: {code: $countryCode}}){
      topArticle
      bottomArticle
      sliderSlots{
        name
        slug
        rating
        image{
          url
        }
      }
      seo{
        seoTitle
        seoDescription
      }
    }
  }
`