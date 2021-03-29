import  HeadTranslations  from './HeadTranslations.json';
import translation from './translations-strings.json'

export const translateHeadString = (countryCode : string, s : string) => {
    if(HeadTranslations[countryCode]) return HeadTranslations[countryCode][s]
    else return HeadTranslations['row'][s]
}

export const translate = (countryCode : string, key : string) => {
    if(translation[countryCode]) return translation[countryCode]['translations'][key]
    else return translation['row']['translations'][key]
}