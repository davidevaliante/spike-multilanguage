import ReactGA from 'react-ga'

const davideId = 'UA-132810169-1'

const karloId = 'UA-132816901-1'

export const initializeAnalytics = (pageName: string) => {
    ReactGA.initialize([
        {
            trackingId: davideId,
            gaOptions: {
                name: 'dev'
            }
        },
        {
            trackingId: karloId,
            gaOptions: {
                name: 'spike'
            }
        }
    ])

    ReactGA.ga('dev.send', 'pageview', pageName)
    ReactGA.ga('spike.send', 'pageview', pageName)
}