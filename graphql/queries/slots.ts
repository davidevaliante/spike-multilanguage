export const ALL_SLOTS = `
    query Slots($countryCode : String) {
        slots(limit:1000, where : {country : { code : $countryCode }}) {
            id,
            description,
            isPopularInCountry,
            playLink,
            linkYoutube,
            videoDescription,
            name,
            rating,
            tips,
            country{
                id
                code
            },
            technicals,
            legacyId,
            slug,
            producer{
                id
            },
            relatedSlots{
                id
            },
            type
        }
    }
`

export const SLOTS_NAME = `
    query Slots {
        slots(limit:1000) {
            id,
            # description,
            # isPopularInCountry,
            # playLink,
            # linkYoutube,
            # videoDescription,
            name,
            # rating,
            # tips,
            # country{
            #     id
            # },
            # technicals,
            # legacyId,
            # slug,
            # producer{
            #     id
            # },
            # relatedSlots{
            #     id
            # },
        }
    }
`

export const DEMO_FOR_SLOT_WITH_SLUG = `
        query DemoBySlug($slug:String, $countryCode:String){
            slots(where:{slug:$slug, country:{code:$countryCode}}){
                playLink
                bonuses{
                    name,
                    noDeposit
                    withDeposit
                    backgroundColor
                    borderColor
                    link
                    tips
                    circular_image{
                    url
                    alternativeText
                }                    
            }
        }
    }
`

export const SLOT_WITH_SLUG = `
    query SlotBySlug($slug:String, $countryCode:String){
        slots(where:{slug:$slug, country:{code:$countryCode}}){
            name
            created_at
            updated_at
            rtp
      			winningSpinFrequency
      			theme
      			volatility
      			gameMode

            slug
            description
            playLink
            videoDescription
            rating
            technicals
            tips

            seo{
              seoTitle
              seoDescription
              shareImg
            }

            producer{
              name
              slug
              image{
                url
                alternativeText
              }
            }

            image{
              url
              alternativeText
            }

            mainBonus{
              name,
                description,
                noDeposit
                withDeposit
                backgroundColor
                borderColor
                bonus_guide{
                  slug
                }
                link
                tips
                circular_image{
                  url
                  alternativeText
                }
                country{
                  code
                }
                acceptedPayments{
                  methodName
                }
              }
            

            bonuses{
                name,
                description,
                noDeposit
                withDeposit
                backgroundColor
                borderColor
                bonus_guide{
                  slug
                }
                link
                tips
                circular_image{
                  url
                  alternativeText
                }
                country{
                  code
                }
              }
          }
    }
`

export const PAGINATED_SLOTS = `
query PAGINATED_SLOTS(
    $countryCode:String, 
    $sortingField:String, 
    $start:Int, 
    $limit:Int,
    $type:String="online"
  ){
      slots(
          where:{
              country:{
                code:$countryCode
              }
              status:"published"
              type:$type
          }
          sort:$sortingField
          start:$start
          limit:$limit
          ){
              created_at
              name
              rating
              slug
              image{
                  url
                  alternativeText
              }
              bonuses(limit:1, start: 0){
                link
              }
              mainBonus{
                link
              }
          }
  }
`

export const PRODUCER_SLOTS = `
query PRODUCER_SLOTS(
    $countryCode:String, 
    $sortingField:String, 
    $start:Int, 
    $type:String="online"
  	$producerName:String="Novomatic"
  ){
      slots(
          where:{
              country:{
                code:$countryCode
              }
            producer:{
              name:$producerName
            }
              status:"published"
              type:$type
          }
          sort:$sortingField
          start:$start
          ){
              created_at
              name
              rating
              slug
              image{
                  url
                  alternativeText
              }
              bonuses(limit:1, start: 0){
                link
              }
      				producer{
                name
              }
              mainBonus{
                link
              }
          }
  }
`

export const THEME_SLOTS = `
query THEME_SLOTS(
    $countryCode:String, 
    $sortingField:String, 
    $start:Int, 
    $type:String="online"
  	$theme:String="western"
  ){
      slots(
          where:{
              country:{
                code:$countryCode
              }
            	theme:$theme
              status:"published"
              type:$type
          }
          sort:$sortingField
          start:$start
          ){
              created_at
              name
              rating
              slug
              image{
                  url
                  alternativeText
              }
              bonuses(limit:1, start: 0){
                link
              }
      				producer{
                name
              }
              mainBonus{
                link
              }
          }
  }
`

export const PAGINATED_BAR_SLOTS = `
query PAGINATED_SLOTS(
  $countryCode:String, 
  $sortingField:String, 
  $start:Int, 
  $limit:Int,

){
    slots(
        where:{
            country:{
              code:$countryCode
            }
            status:"published"
            hasBarVersion:true
        }
        sort:$sortingField
        start:$start
        limit:$limit
        ){
            
            created_at
            name
            rating
            slug
            image{
                url
                alternativeText
            }
            bonuses(limit:1, start: 0){
              link
            }
            mainBonus{
              link
            }
        }
}
`

export const HIGHLIGHT_SLOT = `
    query{
        slot(id: 556){
            id
            name
            slug
            image{
                url
                alternativeText
            }
            rating
        }
    }
`

export const GET_SLOTS_BY_PRODUCER_SLUG = `
    query GET_SLOTS_BY_PRODUCER_SLUG(
        $slug:String, 
        $countryCode:String, 
        $start:Int, 
        $limit:Int          
        $sorting:String){
        slots(
            sort:$sorting,
            start: $start, 
            limit:$limit,
            where:{country:{code:$countryCode}, producer:{slug:$slug}, status : "published"}){
            name
            type
            slug
            rating
            bonuses(limit:1, start: 0){
                link
            }
            image{
                url
                alternativeText
            }
            producer{
                id
            }
            mainBonus{
              link
            }
        }
    }
`

export const GET_SLOT_BY_LEGACY_ID = `
query SLOT_BY_LEGACY_ID($legacyId:String){
    slots(where: {country:{code:"it"}, legacyId:$legacyId}){
      name
      slug
      rating
      bonuses(limit:1, start: 0){
        link
      }
      image{
        url
        alternativeText
      }
      mainBonus{
        link
      }
    }
  }
`

export const GET_SLOT_CARD_BY_ID = `
query SLOT_CARD_BY_ID($id:ID=2171){
  slot(id:$id){
    name
      slug
      rating
      bonuses(limit:1, start: 0){
        link
      }
      image{
        url
        alternativeText
      }
      mainBonus{
        link
      }
  }
}
`

export const SLOT_BY_NAME = `
query SLOT_BY_NAME($countryCode:String="it", $name:String){
  slots(where: {country: {code:$countryCode}, name:$name}){
    name
    rating
    slug
    image{
      url
      alternativeText
    }
  }
}
`
