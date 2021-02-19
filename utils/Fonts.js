const FontFaceObserver = require('fontfaceobserver')

const Fonts = () => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Raleway&display=swap"
    link.rel = 'stylesheet'

    document.head.appendChild(link)

    const raleway = new FontFaceObserver('Raleway')
    const montserrat = new FontFaceObserver('Montserrat')

    raleway.load().then(() => {
        document.documentElement.classList.add('raleway')
    })

    montserrat.load().then(() => {
        document.documentElement.classList.add('montserrat')

    })
}

export default Fonts