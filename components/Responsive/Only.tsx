import styled from "styled-components"
import { laptop, bigscreens } from "./Breakpoints"


export const OnlyMobile = styled.div`
    display : block;

    ${laptop}{
        display : none;
    }
`

export const OnlyDesktop = styled.div`
    display : none;

    ${laptop}{
        display : block;
    }
`

export const OnlyBigScreens = styled.div`
    display : none;

    ${bigscreens}{
        display : block;
    }
`