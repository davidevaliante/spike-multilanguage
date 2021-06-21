import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import Divider from '../../Ui/Divider'
import Router, { useRouter } from 'next/router'
import { countryContext } from './../../../context/CountryContext'
import { useContext } from 'react';
import { LocaleContext } from '../../../context/LocaleContext'

interface Props {
    state: boolean,
    tiles: any,
}

const PushMenu: FunctionComponent<Props> = ({ state, children, tiles }) => {

    const offset = '80vw'

    const router = useRouter()

    const [childrenWrapperPosition, setChildrenWrapperPosition] = useState(false)

    const {t, contextCountry} = useContext(LocaleContext)

    useEffect(() => {
        if (state === true) setChildrenWrapperPosition(true)
        else updateStateDelayed()
    }, [state])

    const updateStateDelayed = () => {
        setTimeout(() => {
            setChildrenWrapperPosition(false)
        }, 300)
    }

    const navigateTo = (link: string) => {
        if (link === '/' || link === '/migliori-bonus-casino') Router.push(link)
        else Router.push(`${link}/${contextCountry}`)
    }

    return (
        <Wrapper>
            <PushMenuContainer isOpen={state} offSet={offset} childrenWrapperPosition={childrenWrapperPosition}>
                <div>
                    {tiles.map(tile => tile.label !== 'LiveStats' ? <div key={`push_menu_${tile.label}`} onClick={() => navigateTo(tile.link)}>
                        <p>{t(tile.label)}</p>
                        <Divider />
                    </div> : <div>
                        <div key={`push_menu_crazy_time`} onClick={() => router.push(`/live-stats/crazy-time/${contextCountry}`)}>
                            <p>Crazy Time Stats</p>
                            <Divider />
                        </div>
                            <div key={`push_menu_monopoly`} onClick={() => router.push(`/live-stats/monopoly/${contextCountry}`)}>
                            <p>Monopoly Stats</p>
                            <Divider />
                        </div>
                    </div>)}
                </div>
            </PushMenuContainer>

            <ChildrenWrapper isOpen={state} offSet={offset} childrenWrapperPosition={childrenWrapperPosition}>
                {children}
            </ChildrenWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display : flex;
    overflow-x : scroll;
`

const ChildrenWrapper = styled.div`
    width:100%;
    box-sizing:border-box;
    right: ${(props: PushMenuContainerInterface) => props.isOpen ? `-${props.offSet}` : '0px'};
    transition: all .3s ease-in;
    overflow-x:hidden;
    position:${(props: PushMenuContainerInterface) => props.childrenWrapperPosition ? 'fixed' : 'static'};
`

interface PushMenuContainerInterface {
    isOpen: boolean
    offSet: string
    childrenWrapperPosition: boolean
}

const PushMenuContainer = styled.div`
    height : 100vh;
    width : ${(props: PushMenuContainerInterface) => props.offSet};
    background : ${(props) => props.theme.colors.primaryDark};;
    left : ${(props: PushMenuContainerInterface) => props.isOpen ? '0px' : `-${props.offSet}`};
    position: fixed;
    transition: all .3s ease-in;
    display : flex;
    flex-direction : column;


    p{
        padding : 1.2rem 1rem;
        color : white;
    }
`

export default PushMenu
