import React, { FunctionComponent, Fragment } from "react"
import styled from 'styled-components'
import LazyImage from "../Lazy/LazyImage"
import {useTranslation} from 'react-i18next'

const NavbarAams: FunctionComponent = () => {

    const {t} = useTranslation()
    
    return <Fragment>
        <Container>

            <LazyImage
                width={66}
                height={56}
                style={{ marginRight: '1rem' }}
                alt='aams logo'
                src='https://spikewebsitemedia.b-cdn.net/adm_logo.png' />

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