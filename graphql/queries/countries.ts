
export const allCountriesComplete = `
    query ALL_COUNTRIES{
        supportedCountries{
            id
            code
            name
            englishName
        }
    }
`

export const GET_COUNTRY_WITH_COUNTRY_CODE = `
    query GET_COUNTRY_WITH_COUNTRY_CODE($code:String){
        supportedCountries(where : {code:$code}){
            id
            code
            name
            englishName
        }
    }
`