export const SLOT_LIST_ARTICLE_BY_COUNTRY = `
query SLOT_LIST_ARTICLE_BY_COUNTRY($countryCode:String){
    slotListArticles(where:{country: {code: $countryCode}}){
      topArticle
      bottomArticle
    }
  }
`