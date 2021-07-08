export const placeholderImage = 'https://spikeapi.eu/icons/app_icon.svg'

export const websiteRoot = 'https://spikeslot.com'

export const defaultShareImage = 'https://spikewebsitemedia.b-cdn.net/spike_share_img.jpg'

export const contentLanguage = (countryCode : string) => {
    switch(countryCode){

        case 'it':
            return 'it-IT'
        
        case 'row':
            return 'en'

        default:
            return 'it-IT'
    }
}
