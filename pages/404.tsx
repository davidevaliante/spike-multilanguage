import React, { FunctionComponent, Fragment } from "react"
import styled from "styled-components"
import Router from "next/router"
import { tablet } from "../components/Responsive/Breakpoints"
import { Button } from "@material-ui/core"

interface I404 {}

const index: FunctionComponent<I404> = ({}) => {
    return (
        <ImageContainer>
            <StyledImage onClick={() => Router.push("/")} src={"/images/not-found.png"} />
            <Button style={{ marginTop: "1rem" }} variant="contained" color="primary" onClick={() => Router.push("/")}>
                Home
            </Button>
        </ImageContainer>
    )
}

export const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-width: 100vw;
    justify-content: center;
    align-items: center;
`

const StyledImage = styled.img`
    cursor: pointer;
    width: 300px;
    height: 180px;

    ${tablet} {
        width: 520px;
        height: 310px;
    }
`

export default index
