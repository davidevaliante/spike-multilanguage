import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { laptop } from '../Responsive/Breakpoints'

interface MyProps {
    onDrawerOpen: Function,
    onDrawerClose: Function,
    isOpen: boolean,
    style?: object
}

const BurgerMenuIcon: FunctionComponent<MyProps> = ({ onDrawerOpen, onDrawerClose, style, isOpen }) => {

    const toggleDrawer = () => {
        if (isOpen) {
            document.getElementById('nav-icon3')?.classList.remove('open')
            onDrawerClose()
        }
        else {
            document.getElementById('nav-icon3')?.classList.add('open')
            onDrawerOpen()
        }
    }

    return (
        <StyleProvider style={style} onClick={() => toggleDrawer()}>
            <div id="nav-icon3">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </StyleProvider>
    )
}

const StyleProvider = styled.div`
    display : flex;
    justify-content : center;
    outline : none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);

    img{
        padding-left : 1rem;
        width : 36px;
        height : 36px;
    }

    ${laptop}{
        display : none;
    }

    #nav-icon1, #nav-icon2, #nav-icon3, #nav-icon4 {
        width: 40px;
        height: 30px;
        margin-left : 1rem;
        position: relative;
        transform: rotate(0deg);
        transition: .5s ease-in-out;
        cursor: pointer;
    }

    #nav-icon1 span, #nav-icon3 span, #nav-icon4 span {
        display: block;
        position: absolute;
        height: 4px;
        width: 100%;
        background: white;
        border-radius: 9px;
        opacity: 1;
        left: 0;
        transform: rotate(0deg);
        transition: .25s ease-in-out;
    }

    #nav-icon3 span:nth-child(1) {
        top: 0px;
    }

    #nav-icon3 span:nth-child(2),#nav-icon3 span:nth-child(3) {
        top: 12px;
    }

    #nav-icon3 span:nth-child(4) {
        top: 24px;
    }

    #nav-icon3.open span:nth-child(1) {
        top: 18px;
        width: 0%;
        left: 50%;
    }

    #nav-icon3.open span:nth-child(2) {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
    }

    #nav-icon3.open span:nth-child(3) {
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }

    #nav-icon3.open span:nth-child(4) {
        top: 18px;
        width: 0%;
        left: 50%;
    }
`

export default BurgerMenuIcon