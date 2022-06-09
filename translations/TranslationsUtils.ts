import HeadTranslations from './HeadTranslations.json'
import translation from './translations-strings.json'

export const translateHeadString = (countryCode: string, s: string) => {
    if (HeadTranslations[countryCode]) return HeadTranslations[countryCode][s]
    else return HeadTranslations['row'][s]
}

export const translate = (countryCode: string, key: string) => {
    let result
    if (translation[countryCode]) result = translation[countryCode]['translations'][key]
    else result = translation['row']['translations'][key]

    if (result) return result
    return key
}
