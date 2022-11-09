import { useRouter } from 'next/router'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { LocaleContext } from '../../context/LocaleContext'

interface IBlockingOverlay {
    userCountry: string
    redirectLink?: string
}

const autoRedirectTimeout = 5000

export const getLastPath = (path: string) => {
    const pathArray = path.split('/')
    return pathArray[pathArray.length - 1]
}

const BlockingOverlay: FunctionComponent<IBlockingOverlay> = ({ userCountry, redirectLink }) => {
    console.log(redirectLink)

    const router = useRouter()
    useEffect(() => {
        setPageCountry(getLastPath(router.asPath))
    }, [router])

    const { contextCountry, setContextCountry } = useContext(LocaleContext)

    const [pageCountry, setPageCountry] = useState(getLastPath(router.asPath))

    const [countDown, setCountDown] = useState(autoRedirectTimeout / 1000)
    useEffect(() => {
        let timeout
        if (userCountry === 'it' && pageCountry !== 'it') {
            timeout = setInterval(() => {
                setCountDown((prev) => {
                    if (prev > 0) return prev - 1
                    return 0
                })
            }, 1000)
        }
        return () => timeout && clearTimeout(timeout)
    }, [userCountry])

    useEffect(() => {
        let timeout

        if (userCountry === 'it' && pageCountry !== 'it') {
            timeout = setTimeout(() => {
                console.log(redirectLink, 'redirectLink')
                setContextCountry('it')
                redirectLink ? router.push(redirectLink) : router.push('/')
            }, autoRedirectTimeout)
        }

        return () => timeout && clearTimeout(timeout)
    }, [userCountry])

    if (userCountry !== 'it' || pageCountry === 'it') return null
    return (
        <div>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    zIndex: 30,
                    backdropFilter: 'blur(16px)',
                    userSelect: 'none',
                }}
            >
                <div
                    style={{
                        fontFamily: 'Montserrat',
                        display: 'flex',
                        backgroundColor: 'white',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        margin: 'auto auto',
                        width: '300px',
                        textAlign: 'center',
                        height: '200px',
                        padding: '1rem',
                        borderRadius: '6px',
                    }}
                >
                    <div style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
                        Questa pagina non è disponibile dall'Italia
                    </div>
                    <div>
                        Stai per essere reindirizzato{' '}
                        <span style={{ fontWeight: 'bold', color: 'red' }}>automaticamente</span> alla versione italiana
                        del sito in <strong style={{ fontWeight: 'bold' }}>{countDown}</strong> secondi
                    </div>
                    {/* <div
                        onClick={() => router.push('/')}
                        style={{
                            background: 'red',
                            borderRadius: '6px',
                            color: 'white',
                            padding: '1rem',
                            cursor: 'pointer',
                            marginTop: '3rem',
                        }}
                    >
                        Torna alla Home
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default BlockingOverlay
