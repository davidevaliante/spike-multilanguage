import React, { FunctionComponent, useContext } from 'react'
import LazyBonusImage from '../Lazy/LazyBonusImage'
import LazyImage from '../Lazy/LazyImage'
import styled from 'styled-components'
import { laptop } from '../Responsive/Breakpoints'
import { Bonus } from '../../graphql/schema'
import { LocaleContext } from '../../context/LocaleContext'

const palette = {
    darkBg: '#2e2e2e',
    extraDarkBg: '#1c1c1c',
    red: '#f95565'
}

interface Props {
    bonusData: Bonus
    onClick: (link: string) => void
}

const VideoAuxBonusCard: FunctionComponent<Props> = ({ bonusData, onClick }) => {

    const { t } = useContext(LocaleContext)

    return (
        <MainBonusContainer
            onClick={() => onClick(bonusData.link)}
            neonColor={bonusData.backgroundColor}>
            <BonusInfoContainer>
                <LazyBonusImage
                    src={bonusData.circular_image.url}
                    width={46}
                    height={46}
                    borderColor={bonusData.borderColor} />

                <Col headerColor={bonusData.borderColor}>
                    <h3>{t("Without Deposit")}</h3>
                    <p>{bonusData.noDeposit}</p>
                </Col>

                <Col headerColor={bonusData.borderColor}>
                    <h3>{t("With Deposit")}</h3>
                    <p>{bonusData.withDeposit}</p>
                </Col>

                <LazyImage width={26} height={26} src='/icons/cheveron_right_white.svg' />
            </BonusInfoContainer>
        </MainBonusContainer>
    )
}

interface IMainBonusContainer {
    neonColor: string
}

const MainBonusContainer = styled.div`
    cursor : pointer;
    display : flex;
    flex-direction : column;
    background : ${palette.darkBg};
    border-radius : 6px;  
    margin : 1em 0rem;
    box-shadow: 9px 9px 8px -4px ${(props: IMainBonusContainer) => props.neonColor};        
    z-index : 2;
    max-width : 800px;

    ${laptop}{
        margin : 1rem auto;
    }

    h3{
        color : white;
        margin : 1rem 2rem;
        font-weight : bold; 
        text-align : center;
    }
`

const BonusInfoContainer = styled.div`
    display : flex;
    padding  : .8rem;
    justify-content : space-between;
    align-items : center;

    ${laptop}{
        padding : 1rem;
    }
`

interface ICol {
    headerColor: string
}

const Col = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;   
    align-items : center;
    width : 150px;  

    ${laptop}{
        width : 250px;
    }

    h3{
        color : ${(props: ICol) => props.headerColor};
        font-size : .8rem;
        margin : .5rem auto;        

         ${laptop}{
            font-size : 1rem;
        }  
    }

    p{
        color : white;
        font-size : .7rem;
        margin : auto;          
        text-align : center;

        ${laptop}{
            font-size : 1rem;
        }
    }
`

export default VideoAuxBonusCard
