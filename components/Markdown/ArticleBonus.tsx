import React, { useEffect, useState } from 'react'
import { FunctionComponent } from 'react'
import AquaClient from './../../graphql/aquaClient'
import { GET_BONUS_BY_NAME_AND_COUNTRY } from '../../graphql/queries/bonus'
import { Bonus } from '../../graphql/schema'
import ArticleBonusCard from './../Cards/ArticleBonusCard'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

interface Props {
    bonusName: string
    countryCode: string
    style?: CSSProperties,
    isBakeca?: boolean
}

const ArticleBonus: FunctionComponent<Props> = ({ bonusName, countryCode, style, isBakeca = false }) => {

    const [bonus, setBonus] = useState<Bonus | undefined>(undefined)

    const remapBonusLink = (b : Bonus) => {
        if(b.name === 'LeoVegas') b.link = 'https://ads.leovegas.com/redirect.aspx?pid=3704891&bid=1496'
        if(b.name === 'BetFlag') b.link = 'https://adv.betflag.com/redirect.aspx?pid=5268&bid=2680'
        if(b.name === '888 Casino') b.link = 'https://ic.aff-handler.com/c/43431?sr=1868494'
        if(b.name === 'PokerStars Casino') b.link = 'https://secure.starsaffiliateclub.com/C.ashx?btag=a_182820b_4095c_&affid=100976968&siteid=182820&adid=4095&c='
        if(b.name === 'StarCasinò') b.link = 'http://record.affiliatelounge.com/_SEA3QA6bJTMP_fzV1idzxmNd7ZgqdRLk/132/'
        if(b.name === 'GoldBet') b.link = 'https://media.goldbetpartners.it/redirect.aspx?pid=4641&bid=1495'
        if(b.name === 'Starvegas') b.link = 'https://www.starvegas.it/gmg/refer/60a2b6ffcb4f5e0001afa975'
        if(b.name === 'Eurobet') b.link = 'https://record.betpartners.it/_E_C7XwxgprAZV93hC2dJ_GNd7ZgqdRLk/110/'
        if(b.name === 'Gioco Digitale') b.link = 'https://mediaserver.entainpartners.com/renderBanner.do?zoneId=2022788'
        return b
    }

    useEffect(() => {
    }, [bonus])

    const aquaClient = new AquaClient()

    useEffect(() => {
        getBonusData()
    }, [])

    const getBonusData = async () => {
        const bonusResponse = await aquaClient.query({
            query: GET_BONUS_BY_NAME_AND_COUNTRY,
            variables: {
                name: bonusName,
                countryCode: countryCode
            }
        })

        !isBakeca ? setBonus(bonusResponse.data.data.bonuses[0]) : setBonus(remapBonusLink(bonusResponse.data.data.bonuses[0]))
    }

    return (
        <div>
            {bonus && <ArticleBonusCard style={style} bonus={bonus} />}
        </div>
    )
}

export default ArticleBonus


