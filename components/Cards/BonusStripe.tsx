import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { Bonus } from './../../graphql/schema'
import LazyBonusImage from '../Lazy/LazyBonusImage'
import { injectCDN } from './../../utils/Utils'
import snakeCase from 'lodash'
import LazyImage from '../Lazy/LazyImage'
import Link from 'next/link'
import { LocaleContext } from '../../context/LocaleContext'
import Image from 'next/image'
import { laptop } from '../Responsive/Breakpoints'

interface Props {
    bonus: Bonus
}

const getFlagFromCountry = (country: string) => {
    const baseLine = '/flags'
    let s = ''
    switch (country) {
        case 'ca':
            s = `${baseLine}/ca.svg`
            break

        case 'it':
            s = `${baseLine}/it.svg`
            break

        case 'es':
            s = `${baseLine}/es.svg`
            break

        case 'mt':
            s = `${baseLine}/mt.svg`
            break

        case 'row':
            s = `${baseLine}/row.svg`
            break

        default:
            s = '/flags/ca.svg'
            break
    }
    return s
}

const BonusStripe: FunctionComponent<Props> = ({ bonus }) => {
    const { t, contextCountry } = useContext(LocaleContext)
    const [flagSrc, setFlagSrc] = useState('/flags/it.svg')

    useEffect(() => {
        setFlagSrc(getFlagFromCountry(contextCountry))
    }, [contextCountry])

    const visit = () => {
        window.open(bonus.link)
    }

    return (
        <Container>
            <Row onClick={() => visit()}>
                <LazyBonusImage
                    width={50}
                    height={50}
                    borderColor={bonus.borderColor}
                    src={injectCDN(bonus.circular_image.url)}
                />
                <div className='name-container'>
                    <h2>{bonus.name}</h2>
                    <StarContainer>
                        {[...Array(bonus.rating).keys()].map((s, i) => (
                            <img
                                key={`${snakeCase(bonus.name)}_${i}_start_full`}
                                alt='full_star_icon'
                                className='star'
                                src='/icons/star_full.svg'
                            />
                        ))}
                        {[...Array(5 - bonus.rating).keys()].map((s, i) => (
                            <img
                                key={`${snakeCase(bonus.name)}_${i}_start_empty`}
                                alt='empty_star_icon'
                                className='star'
                                src='/icons/star_empty.svg'
                            />
                        ))}
                    </StarContainer>
                </div>
                <Image width={30} height={30} src={flagSrc ? flagSrc : ''} />
            </Row>

            <RowDeposit onClick={() => visit()}>
                <div className='deposit-container'>
                    <h3>{t('Without Deposit')}</h3>
                    <p>{bonus.noDeposit}</p>
                </div>

                <div className='deposit-container'>
                    <h3>{t('With Deposit')}</h3>
                    <p>{bonus.withDeposit}</p>
                </div>
            </RowDeposit>

            <Row style={{ marginLeft: 'auto', justifyContent: 'space-between' }}>
                {bonus.bonus_guide && (
                    <GuideButton>
                        <Link
                            href={`/guida/[slug]/[countryCode]`}
                            as={`/guida/${bonus.bonus_guide.slug}/${contextCountry}`}
                        >
                            <a>{t('READ THE GUIDE')}</a>
                        </Link>
                    </GuideButton>
                )}

                <WebSiteButton>
                    <a className='link' rel='nofollow' href={`/go?to=${bonus.link}`}>
                        {t('VISIT THE SITE')}
                    </a>
                </WebSiteButton>
            </Row>
        </Container>
    )
}

const GuideButton = styled.div`
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.colors.primary};
    padding: 0.5rem 1rem;
    width: 40%;
    text-align: center;
    font-weight: bold;
    color: ${(props) => props.theme.colors.primary};
    border-radius: 4px;
    max-width: 145px;
`

const WebSiteButton = styled.div`
    cursor: pointer;
    background: ${(props) => props.theme.colors.primary};
    border: 2px solid ${(props) => props.theme.colors.primary};
    padding: 0.5rem 1rem;
    width: 35%;
    text-align: center;
    color: white;
    font-weight: bold;
    border-radius: 4px;

    .link {
        all: unset;
        color: white;
    }
`

const StarContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    width: 100%;

    .star {
        width: 16px;
        height: 16px;
    }
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;

    ${laptop} {
        margin: 0rem 1rem;
    }

    align-items: center;
    flex-grow: 1;
    max-width: 320px;

    h2 {
        text-align: start;
    }

    .name-container {
        flex-grow: 1;
        margin-left: 2rem;
    }
`

const RowDeposit = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-grow: 1;
    padding: 0.5rem;
    margin-top: 0.4rem;
    min-height: 70px;
    max-width: 320px;

    ${laptop} {
        max-width: 400px;
    }

    .deposit-container {
        width: 45%;
        ${laptop} {
            width: 170px;
        }
    }

    h3 {
        color: grey;
        font-weight: bold;
        font-size: 0.8rem;
        margin-bottom: 0.2rem;
    }

    p {
        color: black;
        font-weight: bold;
        line-height: 1.2rem;
    }
`

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    border: 1px solid ${(props) => props.theme.colors.primary};
    padding: 1rem;
    background: #ffffff;
    a {
        all: unset;
        color: ${(props) => props.theme.colors.primary};
    }

    h2 {
        font-weight: bold;
        font-size: 1.3rem;
        margin-bottom: 0.4rem;
    }
`

export default BonusStripe
