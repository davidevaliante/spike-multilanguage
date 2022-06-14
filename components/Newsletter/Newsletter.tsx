import React, { Fragment, useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { LocaleContext } from '../../context/LocaleContext'

interface Props {}

const Newsletter = (props: Props) => {
    const { t, contextCountry, setContextCountry, userCountry, setUserCountry } = useContext(LocaleContext)

    const itSrc =
        'https://c4236f72.sibforms.com/serve/MUIEAH9KaDzyuXi3daFo5LJ-0Y8EBDFsdQ4PEXaF5c2P0bghKc__0xqGLS0G0XL8lniYtTnyPiKPyLC83CM8ZBLDOXTAN-bf4nijExyd1yBXjXAA-NJkOY7xTU9w6r_z0HxnnmewgVrYVdcJzKPZKou9FTgwc957psJ189mbdwRfqj70JyPvJRtFhaizXBR87WKEjHI5tVbE9rb5'
    const rowSrc =
        'https://c4236f72.sibforms.com/serve/MUIEALFsl09fYetUCtIMY22xEC4AaUJrTF98a_TclyO_u4EhveGu5nsWxIoxfUn9pUX1jCkNWXFIIusBH7LyRs7FZjZXKLWjpppXQdkZyiQuyhU3gXvqSN_Doa9BKrd5wD_HnQ0o2HjmoQekEOy6kkH5_GR2jcbGubR0jNjXzSavjg3DFoUV39UCVvwKp6_xNC1uim0qQstMiWL0'

    const [src, setSrc] = useState('')

    useEffect(() => {
        if (contextCountry === 'it') setSrc(itSrc)
        else setSrc(rowSrc)
    }, [contextCountry])

    return (
        <Fragment>
            <Provider>
                <iframe
                    style={{
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        maxWidth: '100%',
                        padding: '0',
                    }}
                    className={'sib-form'}
                    width='500'
                    height='600'
                    src={src}
                    frameBorder='0'
                    scrolling='auto'
                    allowFullScreen
                ></iframe>
            </Provider>
        </Fragment>
    )
}

const Provider = styled.div`
    .sib-form {
        padding: 0px !important;
        margin: 0px !important;
    }
`

export default Newsletter
