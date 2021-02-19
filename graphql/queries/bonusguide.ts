export const BONUS_GUIDE_BY_SLUG_AND_COUNTRY = `
query BONUS_GUIDE_BY_SLUG_AND_COUNTRY($slug:String="starvegas", $countryCode:String="it"){
  bonusGuides(where: {
    country: {
      code:$countryCode
    },
    slug:$slug
  }){
    article

    image{
      url
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
      }
    }

    seo{
      seoTitle
      seoDescription
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
      }
    }
    image{
      url
    }
    country{
      code
    }
    slug
    updated_at
  }
}
`