
export const ALL_BONUS = `
    query AllBonus($countryCode : String) {
        bonuses(where : {country : {code : $countryCode}}){
            id
            country{
              code
            }
            description
            backgroundColor
            borderColor
            link
            name
            noDeposit
            withDeposit
            rating
            tips
            legacyId
        }
    }
`

export const HOME_BONUS_LIST = `
query HOME_BONUS_LIST($countryCode:String){
  homes(where: {country: {code:$countryCode}}){
  bonuses{
      bonus{
        bonus{
          name
          country{
            code
          }
          bonus_guide{
            slug
          }
          link
          circular_image{
          url
          }
          borderColor
          backgroundColor
          noDeposit
          withDeposit
          tips
          rating
        }
      }
      
  }
  }
}
`

export const GET_BONUS_BY_LEGACY_ID = `
    query GET_BONUS_BY_LEGACY_ID($legacyId:String){
        bonuses(where:{ legacyId: $legacyId, country: {code:"it"}}){
        id
        name
        country{
          code
        }
        bonus_guide{
          slug
        }
        rating
        withDeposit
        noDeposit
        backgroundColor
        borderColor
        link
        description
        legacyId
        circular_image{
            url
        }
        }   
    }
`

export const GET_BONUS_BY_SLUG = `
    query GET_BONUS_BY_SLUG($slug:String){
        bonuses(where:{ slug: $slug, country: {code:"it"}}){
        id
        name
        country{
          code
        }
        bonus_guide{
          slug
        }
        rating
        withDeposit
        noDeposit
        backgroundColor
        borderColor
        link
        description
        legacyId
        circular_image{
            url
        }
        }   
    }
`

export const GET_BONUS_BY_NAME_AND_COUNTRY = `
query BONUS_BY_NAME_AND_COUNTRY($name:String, $countryCode:String){
    bonuses(where:{
      name:$name,
      status:"public",
      country:{
        code:$countryCode
      }
    }){
      country{
        code
      }
      name
      withDeposit
      noDeposit
      link
      backgroundColor
      borderColor
      circular_image{
        url
      }
    }
  }
`

export const BONUSES_BY_NAME = `
query BONUS_BY_NAME($names:[String]=["StarCasinò","Starvegas", "888 Casino"], $countryCode:String="it"){
  bonuses(
    where:{
      country :{code:$countryCode}
      name_in: $names
    }
  ){
      id
      name
      country{
        code
      }
      bonus_guide{
        slug
      }
      rating
      bonusCompareLink
      withDeposit
      noDeposit
      backgroundColor
      borderColor
      link
      description
      legacyId
      circular_image{
          url
      }
  }
}
`