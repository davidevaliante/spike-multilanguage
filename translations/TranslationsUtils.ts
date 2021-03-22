import  HeadTranslations  from './HeadTranslations.json';
import translation from './transaltions.json'

export const translateHeadString = (countryCode : string, s : string) => HeadTranslations[countryCode][s]

export const translate = (countryCode : string, key : string) => {
    console.log(countryCode);
    
    return translation[countryCode]['translations'][key]
}