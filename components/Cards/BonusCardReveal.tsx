import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { ApolloBonusCardReveal, Bonus } from '../../data/models/Bonus'
import { extractTips, injectCDN } from '../../utils/Utils'
import { AppTheme } from '../../theme/theme'
import LazyBonusImage from '../Lazy/LazyBonusImage'
import Link from 'next/link'
import { LocaleContext } from './../../context/LocaleContext'

interface Props {
    bonus: ApolloBonusCardReveal
    isBakeca?: boolean
}

const ApolloBonusCardRevealComponent: FunctionComponent<Props> = ({ bonus, isBakeca = false }) => {
    const remapBonusLink = (b: ApolloBonusCardReveal) => {
        if (b.name === 'LeoVegas') b.link = 'https://ads.leovegas.com/redirect.aspx?pid=3704891&bid=1496'
        if (b.name === 'BetFlag') b.link = 'https://adv.betflag.com/redirect.aspx?pid=5268&bid=2680'
        if (b.name === '888 Casino') b.link = 'https://ic.aff-handler.com/c/43431?sr=1868494'
        if (b.name === 'PokerStars Casino')
            b.link =
                'https://secure.starsaffiliateclub.com/C.ashx?btag=a_182773b_6258c_&affid=100976968&siteid=182773&adid=6258&c='
        if (b.name === 'StarCasinò') b.link = 'http://record.affiliatelounge.com/_SEA3QA6bJTMP_fzV1idzxmNd7ZgqdRLk/132/'
        if (b.name === 'GoldBet') b.link = 'https://media.goldbetpartners.it/redirect.aspx?pid=4641&bid=1495'
        if (b.name === 'Starvegas') b.link = 'https://www.starvegas.it/gmg/refer/60a2b6ffcb4f5e0001afa975'
        if (b.name === 'Eurobet') b.link = 'https://record.betpartners.it/_E_C7XwxgprAZV93hC2dJ_GNd7ZgqdRLk/110/'
        if (b.name === 'Gioco Digitale')
            b.link = 'https://mediaserver.entainpartners.com/renderBanner.do?zoneId=2022788'
        if (b.name === 'WinCasino') b.link = 'https://www.wincasinopromo.it/?mp=20f65900-3c5c-4ac2-a5ee-17aac6ccf2be'
        if (b.name === 'NetBet') b.link = 'https://banners.livepartners.com/view.php?z=139081&source=bakeca'
        return b
    }

    const { t, contextCountry } = useContext(LocaleContext)

    const [_bonus, setBonus] = useState(isBakeca ? remapBonusLink(bonus) : bonus)

    const goToBonus = () => {
        window.open(_bonus?.link)
    }

    const visitOne = () => {
        window.open(
            'https://www.888casino.it/promozioni/bonus-senza-deposito/?utm_medium=casap&utm_source=aff&sr=1648815&mm_id=46717&utm_source=aff&utm_medium=casap#tc'
        )
    }

    const visitTwo = () => {
        window.open(
            'https://www.888casino.it/promozioni/bonus-benvenuto/?utm_medium=casap&utm_source=aff&sr=1648815&mm_id=46717&utm_source=aff&utm_medium=casap#tc'
        )
    }

    return (
        <StyleProvider style={{ marginBottom: '.5rem' }} bgColor={bonus?.backgroundColor}>
            <div>
                <div className='card'>
                    <div className='face face1'>
                        <div className='content'>
                            <div className='content-custom'>
                                <LazyBonusImage
                                    fromTop={100}
                                    width={60}
                                    height={60}
                                    style={{ marginBottom: '.3rem' }}
                                    borderColor={bonus?.borderColor}
                                    alt={
                                        bonus.circular_image.alternativeText
                                            ? bonus.circular_image.alternativeText
                                            : `${bonus.name}-image`
                                    }
                                    src={bonus.circular_image ? injectCDN(bonus.circular_image.url) : ''}
                                />
                                <h4 className='deposit-header'>{t('Without Deposit')}</h4>
                                <p className='deposit-text'>{bonus?.noDeposit}</p>
                                <h4 className='deposit-header'>{t('With Deposit')}</h4>
                                <p className='deposit-text'>{bonus?.withDeposit}</p>
                            </div>
                        </div>
                    </div>

                    <div className='face face2'>
                        <div className='content'>
                            <div>
                                {extractTips(bonus?.tips).map((t, index) => (
                                    <div
                                        key={t}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'start',
                                            alignItems: 'center',
                                            margin: '.7rem',
                                        }}
                                    >
                                        <InfoIcon src='/icons/info_icon.svg' />
                                        {(index == 0 || index == 1) && bonus.name === '888 Casino' ? (
                                            <EightEightEightClickable
                                                rel='nofollow'
                                                href={
                                                    index == 0
                                                        ? '/go?to=https://www.888casino.it/promozioni/bonus-senza-deposito/?utm_medium=casap&utm_source=aff&sr=1648815&mm_id=46717&utm_source=aff&utm_medium=casap#tc'
                                                        : '/go?to=https://www.888casino.it/promozioni/bonus-benvenuto/?utm_medium=casap&utm_source=aff&sr=1648815&mm_id=46717&utm_source=aff&utm_medium=casap#tc'
                                                }
                                                className='tip'
                                            >
                                                {t}
                                            </EightEightEightClickable>
                                        ) : (
                                            <p className='tip'>{t}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                                <a rel='nofollow' className='visit-website link' href={`/go?to=${_bonus.link}`}>
                                    {t('VISIT THE SITE')}
                                </a>
                                <Link
                                    href={`/guida/[slug]/[countryCode]`}
                                    as={`/guida/${bonus?.bonus_guide?.slug}/${contextCountry}`}
                                >
                                    <a className='read-guide link'>{t('READ THE GUIDE')}</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StyleProvider>
    )
}

const EightEightEightClickable = styled.a`
    cursor: pointer;
    color: black !important;
    background: white !important;
`

interface CircularImageProps {
    theme: AppTheme
    borderColor: string
}

const CircularImage = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: ${(props: CircularImageProps) => {
        return `2px solid ${props.borderColor}`
    }};
`

const InfoIcon = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 0.5rem;
`

interface CardProps {
    theme: AppTheme
    bgColor: string
}

const StyleProvider = styled.div`
    animation: decrescendo 0.4s ease-in;

    :hover {
        animation: crescendo 0.4s ease-in;
        transform: scale(1.1);
        z-index: 10;

        .deposit-header {
            font-size: 80%;
            padding: 0.3rem;
            font-family: ${(props) => props.theme.text.secondaryFont};
            /* color: ${(props) => props.theme.colors.fourth}; */
            transition: all 0.3s ease-in-out;
        }
    }

    @keyframes crescendo {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(1.1);
        }
    }

    @keyframes decrescendo {
        0% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }

    .visit-website {
        border: 2px solid red;
    }

    .deposit-text {
        text-align: center;
        font-size: 90%;
    }

    .deposit-header {
        font-size: 80%;
        padding: 0.3rem;
        font-family: ${(props) => props.theme.text.secondaryFont};
        color: white;
    }

    .tip {
        color: black;
        font-size: 80%;
    }

    .container .card {
        position: relative;
        cursor: pointer;
    }

    .content-custom {
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: center;

        p {
            padding: 0.5rem;
            font-weight: bold;
            color: white;
        }
    }

    .card .face {
        width: 280px;
        height: 200px;
        transition: 0.5s;
        border-radius: 4px;
    }

    .card .face.face1 {
        position: relative;
        background: ${(props: CardProps) => props.bgColor};
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        transform: translateY(100px);
    }

    .card:hover .face.face1 {
        background: ${(props: CardProps) => props.bgColor};
        transform: translateY(0);
    }

    .card .face.face1 .content {
        opacity: 1;
        transition: 0.5s;
    }

    .card:hover .face.face1 .content {
        opacity: 1;
    }

    .card .face.face1 .content img {
        max-width: 100px;
    }

    .card .face.face1 .content h3 {
        margin: 10px 0 0;
        padding: 0;
        color: #fff;
        text-align: center;
        font-size: 1.5em;
    }

    .card .face.face2 {
        position: relative;
        background: #fff;
        display: none;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        transform: translateY(-100px);
    }

    .card:hover .face.face2 {
        transform: translateY(0);
        display: flex;
    }

    .card .face.face2 .content p {
        margin: 0;
        padding: 0;
    }

    .card .face.face2 .content .link {
        margin: 15px 0 0;
        display: inline-block;
        text-decoration: none;
        font-weight: 900;
        color: white;
        padding: 8px;
        background: ${(props: CardProps) => props.theme.colors.primary};
        border-radius: 4px;
        text-align: center;
        transition: all 0.3s ease-in-out;
    }
`

export default ApolloBonusCardRevealComponent
