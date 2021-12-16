import styled from "styled-components"
import { desktop } from "../Responsive/Breakpoints"

export const BodyContainer = styled.div`
    position: relative;
    /* display flex qui rompe lo slideshow */
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    strong {
        font-weight: bold;
    }

    strong.red {
        color: ${(props) => props.theme.colors.primary};
        font-family: ${(props) => props.theme.text.secondaryFont};
    }

    strong.secondary {
        color: ${(props) => props.theme.colors.secondary};
        font-family: ${(props) => props.theme.text.secondaryFont};
    }

    .newsletter {
        all: unset;
        cursor: pointer;
        font-family: ${(props) => props.theme.text.secondaryFont};
        color: #2a6aeb;
    }
`

export const MainColumn = styled.div`
    max-width: 900px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
export const RightColumn = styled.div`
    display: none;

    width: 200px;
    /* background : blueviolet; */
    position: relative;

    ${desktop} {
        display: flex;
        flex-direction: column;
        min-width: 300px;
    }

    .bonus-column-container {
        position: absolute;
        left: 0;
        top: 320px;
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
    }

    .bonus-header {
        font-family: ${(props) => props.theme.text.secondaryFont};
        font-size: 1.5rem;
        color: ${(props) => props.theme.colors.primary};
        padding: 2rem 1rem;
    }

    .video-header {
        font-family: ${(props) => props.theme.text.secondaryFont};
        font-size: 1.5rem;
        color: ${(props) => props.theme.colors.primary};
        padding: 1rem;
    }
`
