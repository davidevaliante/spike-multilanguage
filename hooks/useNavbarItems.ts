import { useContext, useEffect, useState } from 'react'
import { LocaleContext } from '../context/LocaleContext'

export const useNavbarItems = () => {
    const [items, setItems] = useState([
        { label: 'Homes', link: '/' },
        { label: 'Video', link: '/videos' },
        { label: 'Free Slot Machine Games', link: '/slots' },
        { label: 'Bar Slot', link: '/slot-bar' },
        { label: 'VLT slot', link: '/slot-vlt' },
        { label: 'LiveStats', link: '/live-stats' },
        // here is gonna be filled
        { label: 'Book of Ra Online', link: '/slot/book-of-ra-deluxe' },
        // here is gonna be filled

        { label: 'Blogs and Articles', link: '/blog' },
        { label: 'Investimenti Online', link: '/guide/lab' },
    ])

    const { t, appCountry } = useContext(LocaleContext)
    useEffect(() => {
        let copy = [...items]
        if (appCountry === 'it') {
            copy.splice(6, 0, { label: 'Welcome bonus', link: '/migliori-bonus-casino' })
            copy.splice(8, 0, { label: 'Guides and Tricks', link: '/guide-e-trucchi' })
        }
        if (appCountry === 'row' || appCountry === 'ca') {
            copy.splice(6, 0, { label: 'Welcome bonus', link: `/best-casino-bonus` })
            copy.splice(8, 0, { label: 'Guides and Tricks', link: '/guides-and-tricks' })
            copy.splice(1, 1)
        }
        setItems(copy)
    }, [appCountry])

    return items
}
