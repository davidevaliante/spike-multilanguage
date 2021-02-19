import { useState, useEffect } from 'react'

export default function useOrientationChange() {
    const [orientation, setOrientation] = useState(window.orientation)

    useEffect(() => {
        const handler = () => setOrientation(window.orientation)

        window.addEventListener('orientationchange', handler)

        return () => {
            window.removeEventListener('orientationchange', handler)
        }
    }, [])

    return orientation === 0 ? 'portrait' : 'landscape' // for -90 (right) and 90 (left)
}
