
export const ALL_PRODUCER_NAMES = `
    query Producers {
        producers {
            id
            name
            description
        }
    }
`

export const ALL_PRODUCERS = `
    query Producers($countryCode : String) {
        producers(where : { country : { code : $countryCode } }) {
            id
            name
            website
            legacyId
            country{
                name
            }
        }
    }
`

export const PRODUCERS_BY_COUNTRY_DROPDOWN = `
    query PRODUCERS_BY_COUNTRY_DROPDOWN($countryCode:String){
        producers(
            sort:"name:ASC"
            where: {country:{code:$countryCode}}
        ){
            name,
            slug,
        }
    }
`

export const GET_PRODUCER = `
    query GET_PRODUCER($countryCode:String, $slug:String){
        producers(where:{country:{code:$countryCode}, slug:$slug}){
            id
            name
            description
            website
            slug
            bottomArticle
            image{
                url
            }
        }
    }
`


