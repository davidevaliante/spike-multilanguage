export const BAR_SLOT_LIST = `
query BAR_SLOT_LIST($countryCode:String){
	barSlotLists(where:{country: {code: $countryCode}}){
    topArticle
    bottomArticle
    seo{
      seoTitle
      seoDescription
    }
    
    sliderSlots{
      slot{
        slot{
           name
              slug
              rating
              image{
                url
              }
        }
      }
    }
    
  }
}
`