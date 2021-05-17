import React, { FunctionComponent, Fragment, useContext, useState, useEffect } from "react"
import styled from 'styled-components'
import LazyImage from "../Lazy/LazyImage"
import { LocaleContext } from '../../context/LocaleContext'

const NavbarAams: FunctionComponent = () => {

    const {t, contextCountry} = useContext(LocaleContext)

    useEffect(() => {
        setImage(getImage())
    }, [contextCountry])
    
    const getImage = () => {
        switch(contextCountry){
            case 'it':
                return 'https://spikewebsitemedia.b-cdn.net/adm_logo.png'
            case 'row':
                return '/icons/gamble_aware.png'
            default:
                return 'https://spikewebsitemedia.b-cdn.net/adm_logo.png'
        }
    }

    const getWidth = () => {
        switch(contextCountry){
            case 'it':
                return 66
            case 'row':
                return 66
            default:
                return 66
        }
    } 

    const getHeight = () => {
        switch(contextCountry){
            case 'it':
                return 56
            case 'row':
                return 66
            default:
                return 66
        }
    } 

    const [image, setImage] = useState(getImage())


    return <Fragment>
        <Container>

            <LazyImage
                key={image}
                width={getWidth()}
                height={getHeight()}
                style={{ marginRight: '1rem' }}
                alt='aams logo'
                src={image} />

            <LazyImage
                width={36}
                height={36}
                style={{ marginRight: '1rem' }}
                alt='eighteen'
                src='https://spikewebsitemedia.b-cdn.net/eighteen_white.svg' />

            <p>{t("Gambling is forbidden for minors and can cause pathological addiction - odds of winning")}</p>
        </Container>
    </Fragment>
}

const Container = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    width : 100%;
    max-width : 400px;
    font-size : 70%;
`

export default NavbarAams