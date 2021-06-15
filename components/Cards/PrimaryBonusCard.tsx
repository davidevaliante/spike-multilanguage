import React, { Fragment, FunctionComponent,useContext } from "react"
import styled from 'styled-components'
import { Bonus } from "../../graphql/schema"
import { injectCDN, extractTips } from './../../utils/Utils'
import LazyLoad from 'react-lazyload'
import { laptop } from './../Responsive/Breakpoints'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { appTheme } from './../../theme/theme'
import Link from "next/link"
import { LocaleContext } from './../../context/LocaleContext';

interface Props {
    bonus: Bonus,
    withSuggestion?: boolean,
    style?: CSSProperties
}

const PrimaryBonusCard: FunctionComponent<Props> = ({ bonus, style, withSuggestion = true }) => {
   
    const mapPaymentsMethodsToIcons = () => {
        return bonus.acceptedPayments.map(({ methodName }) => {
            if (methodName === 'mastercard') return <Icon src='/icons/mastercard.svg' />
            if (methodName === 'paypal') return <Icon src='/icons/paypal.svg' />
            if (methodName === 'postepay') return <Icon src='/icons/postepay_circular.svg' />
            if (methodName === 'bank') return <Icon src='/icons/bank.svg' />
            if (methodName === 'landbasedbettingshop') return <Icon src='/icons/pin_money.svg' />
            if (methodName === 'neteller') return <Icon src='/icons/neteller.svg' />
            if (methodName === 'skrill') return <Icon src='/icons/skrill.svg' />
        })
    }
    const {t, contextCountry, setContextCountry} = useContext(LocaleContext)

    const visitOne = () =>  {
		window.open('https://www.888casino.it/promozioni/bonus-senza-deposito/?utm_medium=casap&utm_source=aff&sr=1648815&mm_id=46717&utm_source=aff&utm_medium=casap#tc')
	}

	const visitTwo = () =>  {
		window.open('https://www.888casino.it/promozioni/bonus-benvenuto/?utm_medium=casap&utm_source=aff&sr=1648815&mm_id=46717&utm_source=aff&utm_medium=casap#tc')
	}


    return <Fragment>
        <Container withSuggestion={withSuggestion} bonus={bonus} style={style}>
            <ImageContainer withSuggestion={withSuggestion} bonus={bonus} onClick={() => window.open(bonus.link)}>
                {/* {withSuggestion && <h3>Per questa slot suggeriamo</h3>} */}
                {bonus?.circular_image && <LazyLoad>
                    <img
                        style={{ marginTop: '.5rem' }}
                        src={injectCDN(bonus.circular_image.url)}
                        className='circular-image' />
                </LazyLoad>}
                <p>{bonus?.description}</p>

            </ImageContainer>
            <TipsContainer onClick={() => bonus.name !== '888 Casino' && window.open(bonus.link)}>
                {bonus?.tips && extractTips(bonus.tips).map((t, index) => <div
                    key={t}
                    style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', padding: '.5rem' }}>
                    <InfoIcon src='/icons/info_icon.svg' />
                    {((index == 0 || index == 1) && bonus.name === '888 Casino') ? <EightEightEightClickable onClick={index == 0 ? visitOne : visitTwo} className='tip'>{t}</EightEightEightClickable> : <p className='tip'>{t}</p>}
                </div>)}
            </TipsContainer>

            <Button onClick={() => window.open(bonus.link)}><div><div>{t("VISIT THE SITE")}</div><div style={{ marginTop: '.5rem', textAlign: 'center', fontFamily: appTheme.text.primaryFont, fontSize: '.8rem' }}>{bonus?.name}</div></div></Button>

            {bonus?.bonus_guide && <Link href={`/guida/[slug]/[countryCode]`} as={`/guida/${bonus.bonus_guide.slug}/${contextCountry}`}>
                <a>
                    <HollowButton>{t("READ THE GUIDE")}</HollowButton>
                </a>
            </Link>}

            <PaymentAccepetedIcons>
                {bonus?.acceptedPayments && mapPaymentsMethodsToIcons()}
            </PaymentAccepetedIcons>
        </Container>
    </Fragment>
}


const EightEightEightClickable = styled.p`
	cursor : pointer;
`


const HollowButton = styled.div`
    border : 1px solid ${(props) => props.theme.colors.primary};
    padding : .5rem 2rem;
    color : ${(props) => props.theme.colors.primary};
    border-radius:6px;
`

const InfoIcon = styled.img`
	width : 16px;
	height: 16px;
	margin-right : .5rem;
`

const TipsContainer = styled.div`
    flex-grow : 1;
    justify-content : center;

    .tip{
		color : black;
		font-size : 80%;
	}

    ${laptop}{
        display : flex;
        flex-direction : column;
    }
`

const Icon = styled.img`
    width : 30px;
    height : 30px;
`

const PaymentAccepetedIcons = styled.div`
    display : flex;
    justify-content : space-evenly;
    width : 100%;
    padding : 1rem;
`

interface PrimaryBonusCardProps {
    bonus: Bonus,
    withSuggestion: boolean
}

const Container = styled.div`

    cursor: pointer;
    width : 90%;
    max-width : 280px;
    height : 450px;
    display : flex;
    flex-direction : column;
    align-items:center;
    margin : auto;
    position : relative;
    z-index : 9;
    border : 1px solid grey;
    border-radius : 6px;
    margin-top : 2rem;
    box-shadow: 10px 9px 5px -4px rgba(0,0,0,0.39);
    background : white;

    .circular-image{
        width : 70px;
        height : 70px;
        border : ${(props: PrimaryBonusCardProps) => `2px solid ${props.bonus?.borderColor}`};
        border-radius : 50%;
        margin : .2rem;
        margin-top : ${(props: PrimaryBonusCardProps) => !props.withSuggestion ? '1rem' : '0rem'};
    }

    h3{
        font-family: ${(props) => props.theme.text.secondaryFont};
        padding  :1rem;
    }
`

const ImageContainer = styled.div`
    background : ${(props: PrimaryBonusCardProps) => props.bonus?.backgroundColor};
    width : 100%;
    display : flex;
    flex-direction : column;
    color : white;
    justify-content : center;
    align-items : center;
    border-top-left-radius : 6px;
    border-top-right-radius : 6px;
    text-align : center;
    p{
        font-family : ${(props) => props.theme.text.secondaryFont};
        padding : 1rem;
    }

`

const Button = styled.div`
    border-radius : 16px;
    padding : .6rem 2rem;
    background : ${(props) => props.theme.colors.primary};
    font-family : ${(props) => props.theme.text.secondaryFont};
    color : white;
    margin :1rem;
`

export default PrimaryBonusCard