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
    style?: CSSProperties
}

const ArticleBonus: FunctionComponent<Props> = ({ bonusName, countryCode, style }) => {

    const [bonus, setBonus] = useState<Bonus | undefined>(undefined)

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

        setBonus(bonusResponse.data.data.bonuses[0])
    }

    return (
        <div>
            {bonus && <ArticleBonusCard style={style} bonus={bonus} />}
        </div>
    )
}

export default ArticleBonus


