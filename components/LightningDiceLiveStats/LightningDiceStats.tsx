import React, { FunctionComponent } from "react"
import styled from "styled-components"

interface ILightningDiceStats {
    stat: any
    totalSpinsConsidered: number
    timeFrame: any
}

const LightningDiceStats: FunctionComponent<ILightningDiceStats> = ({ stat, totalSpinsConsidered, timeFrame }) => {
    console.log(stat, totalSpinsConsidered, timeFrame)

    return (
        <Container>
            <div>{stat.percentage.toFixed(2)}%</div>
            <div className="symbol">{stat.symbol}</div>
            <div style={{ fontSize: ".8rem", textAlign: "center" }}>Moltiplicatore Medio</div>
            <span style={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center", marginTop: ".3rem" }}>
                {stat.avgMultiplier}X
            </span>
            <div style={{ marginTop: "auto", textAlign: "center", fontSize: ".75rem" }}>
                Non esce da <span style={{ fontWeight: "bold", fontSize: "1rem" }}>{stat.spinSince}</span> tiri
            </div>
        </Container>
    )
}

const Container = styled.div`
    width: 130px;
    height: 186px;
    border: 2px solid #db0d30;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 0.7rem;
    box-sizing: border-box;

    margin-bottom: 0.3rem;
    border-radius: 4px;
    margin-bottom: 1rem;

    .symbol {
        font-size: 2.6rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: #db0d30;
    }
`

export default LightningDiceStats
