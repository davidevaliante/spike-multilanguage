import React, { Fragment, useState, useContext } from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import Divider from '../Ui/Divider'
import Link from 'next/link'
import LazyImage from '../Lazy/LazyImage'
import ArticleToMarkdown from '../Markdown/ArticleToMarkdown'
import { LocaleContext } from './../../context/LocaleContext'
import Image from 'next/image'

interface Props {
    topArticle?: string
}

const HomeHeader: FunctionComponent<Props> = ({ topArticle }) => {
    const { t, appCountry: contextCountry } = useContext(LocaleContext)

    const [disclaimerOpen, setDisclaimerOpen] = useState(false)

    return (
        <div className='my-7 text-sm px-4 lg:px-0'>
            <div className='flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between items-center my-6'>
                <div className='flex flex-row items-center gap-6'>
                    <h1 className='font-serif text-3xl text-primary-500'>Slot Online SPIKE SLOT</h1>
                    <Image
                        className='cursor-pointer'
                        width={24}
                        height={24}
                        onClick={() => setDisclaimerOpen(!disclaimerOpen)}
                        alt='alert icon'
                        src='/icons/info-icon.svg'
                    />
                </div>

                <Link href={`/slots/${contextCountry}`}>
                    <div>
                        <div className='bg-primary-500 px-4 py-3 text-white flex flex-row rounded-md items-center justify-between gap-4'>
                            <h2 className='text-white uppercase font-bold'>{t('Go to the full list of slots')}</h2>
                            <Image width={36} height={36} alt='slot 777' src='/icons/jackpot_slot_icon.svg' />
                            <Image width={26} height={26} alt='arrow right' src='/icons/cheveron_right_white.svg' />
                        </div>
                    </div>
                </Link>
            </div>
            {disclaimerOpen && (
                <div>
                    <p className='text-sm mb-1'>{t('HomeHeaderDisclaimer')}</p>
                </div>
            )}

            <div className='h-px w-full bg-zinc-200 mb-8' />

            <ArticleToMarkdown content={topArticle} />
        </div>
    )
}

const GoToCrazyTimeStatsButton = styled.div`
    cursor: pointer;
    display: flex;
    padding: 1rem;
    background: ${(props) => props.theme.colors.primaryDark};
    margin-bottom: 1rem;
    border-radius: 4px;
    align-items: center;
    color: #fff;
    font-weight: bold;
    justify-content: space-between;
    max-width: 450px;
    transition: background 0.2s ease-in;

    :hover {
        background: ${(props) => props.theme.colors.primary};
    }
`

const NewsLetterCTAButton = styled.div`
    cursor: pointer;
    display: flex;
    padding: 1rem;
    background: #5290f2;
    margin-bottom: 1rem;
    border-radius: 4px;
    align-items: center;
    color: #fff;
    font-weight: bold;
    justify-content: space-between;
    max-width: 450px;
    transition: background 0.2s ease-in;

    :hover {
        background: ${(props) => props.theme.colors.primary};
    }
`

export default HomeHeader
