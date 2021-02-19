import React, { FunctionComponent, Fragment, CSSProperties} from 'react'
import LazyBonusImage from '../Lazy/LazyBonusImage'
import LazyImage from '../Lazy/LazyImage'
import styled from 'styled-components'
import { laptop } from '../Responsive/Breakpoints'
import { Bonus } from '../../graphql/schema'
import Divider from '../Ui/Divider'
import Link from 'next/link'
import {useTranslation} from 'react-i18next'

const palette = {
    darkBg: '#2e2e2e',
    extraDarkBg: '#1c1c1c',
    red: '#f95565'
}

interface Props {
    bonusData: Bonus
    onClick: (link: string) => void
    style?: CSSProperties
}

const VideoMainBonusCard: FunctionComponent<Props> = ({ bonusData, style, onClick }) => {
    
    const {t} = useTranslation()
    
    return (
        <Fragment>
            <MainBonusContainer
                style={style}
                neonColor={bonusData.backgroundColor}>
                <h3>{`Ho giocato su ${bonusData.name}, puoi VISITARE IL SITO per maggiori info cliccando qui oppure leggere la guida`}</h3>
                <div style={{ width: '80%', margin: 'auto' }} onClick={() => onClick(bonusData.link)}>
                    <Divider color={bonusData.borderColor} />

                </div>
                <BonusInfoContainer onClick={() => onClick(bonusData.link)}>
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
                <div className='guide-button-container'>
                    <Link href={`/guide/[slug]/[countryCode]`} as={`/guide/${bonusData.bonus_guide?.slug}/${bonusData.country.code}`} passHref>
                        <a>{t("READ THE GUIDE")}</a>
                    </Link>
                </div>
            </MainBonusContainer>
        </Fragment >
    )
}

interface IMainBonusContainer {
    neonColor: string
}

const MainBonusContainer = styled.div`
    cursor : pointer;
    display : flex;
    flex-direction : column;
    /* background : ${palette.darkBg}; */
    background : #ffffff;
    border-radius : 6px;  
    margin : 1em 0rem;
    box-shadow: 9px 9px 8px -4px ${(props: IMainBonusContainer) => props.neonColor};        
    z-index : 2;

    a{
        text-align:center;
        color : ${(props: IMainBonusContainer) => props.neonColor};
        font-weight : bold;
    }

    .guide-button-container{
        display : flex;
        justify-content : center;
        padding : 1rem;
        color : ${(props: IMainBonusContainer) => props.neonColor};
        font-weight : bold;
    }



    ${laptop}{
        margin : 1rem 0rem;
    }

    h3{
        color : black;

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
    max-width : 140px;

    ${laptop}{
        max-width : 250px;  
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
        color : black;
        font-size : .7rem;
        margin : auto;          
        text-align : center;

        ${laptop}{
            font-size : 1rem;
        }
    }
`

export default VideoMainBonusCard
