export const BONUS_GUIDE_BY_SLUG_AND_COUNTRY = `
query BONUS_GUIDE_BY_SLUG_AND_COUNTRY($slug:String="starvegas", $countryCode:String="it"){
  bonusGuides(where: {
    country: {
      code:$countryCode
    },
    slug:$slug
  }){
    article
    slug
    image{
      url
      alternativeText
    }

    bonus{
      country{
        code
      }
      description
      name
      backgroundColor
      borderColor
      withDeposit
      noDeposit
      acceptedPayments{
        methodName
      }
      bonus_guide{
        slug
      }
      link
      tips
      slug
      circular_image{
        url
        alternativeText
      }
    }

    seo{
      seoTitle
      seoDescription
      shareImg
    }
    
  }
}
`

export const BONUS_GUIDES_BY_COUNTRY = `
query GUIDES_BY_COUNTRY($countryCode:String="it"){
  bonusGuides(limit: 30 ,where: {country:{ code: $countryCode}}){
    bonus{
      name
      country{
        code
      }
      backgroundColor
      borderColor
      circular_image{
        url
        alternativeText   
      }
    }
    image{
      url
      alternativeText
    }
    country{
      code
    }
    slug
    updated_at
  }
}
`