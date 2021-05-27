import React, { FunctionComponent, useContext } from 'react'
import { MonopolyTableRow } from '../../data/models/MonopolyTable'
import { Paper, Divider } from '@material-ui/core'
import styled from 'styled-components'
import { injectCDN } from '../../utils/Utils'
import { LocaleContext } from '../../context/LocaleContext'


interface Props {
    type : 'low' | 'mid' | 'high',
    rows : MonopolyTableRow[]
}

const MonopolyDiceRollTable : FunctionComponent<Props> = ({ type, rows }) => {

    const {t} = useContext(LocaleContext)

    const renderRow = (i : number, row : MonopolyTableRow) => {
        if(type === 'low'){
            switch(i){
                case 0: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(1)}/>
                                <DiceImage src={getDiceImageSrc(1)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 1: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(1)}/>
                                <DiceImage src={getDiceImageSrc(2)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 2: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(1)}/>
                                <DiceImage src={getDiceImageSrc(3)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 3: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(1)}/>
                                <DiceImage src={getDiceImageSrc(4)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 4: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(1)}/>
                                <DiceImage src={getDiceImageSrc(5)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 5: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(1)}/>
                                <DiceImage src={getDiceImageSrc(6)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 6: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(1)}/>
                                <DiceImage src={getDiceImageSrc(1)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                default : 
                    return <div></div>
            }
        }

        if(type === 'mid'){
            switch(i){
                case 0: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(2)}/>
                                <DiceImage src={getDiceImageSrc(3)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 1: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(2)}/>
                                <DiceImage src={getDiceImageSrc(4)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 2: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(2)}/>
                                <DiceImage src={getDiceImageSrc(5)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 3: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(2)}/>
                                <DiceImage src={getDiceImageSrc(6)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 4: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(3)}/>
                                <DiceImage src={getDiceImageSrc(3)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 5: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(3)}/>
                                <DiceImage src={getDiceImageSrc(4)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 6: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(3)}/>
                                <DiceImage src={getDiceImageSrc(5)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                default : 
                    return <div></div>
            }
        }

        if(type === 'high'){
            switch(i){
                case 0: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(3)}/>
                                <DiceImage src={getDiceImageSrc(6)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 1: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(4)}/>
                                <DiceImage src={getDiceImageSrc(4)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 2: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(4)}/>
                                <DiceImage src={getDiceImageSrc(5)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 3: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(4)}/>
                                <DiceImage src={getDiceImageSrc(6)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 4: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(5)}/>
                                <DiceImage src={getDiceImageSrc(5)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 5: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(5)}/>
                                <DiceImage src={getDiceImageSrc(6)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                case 6: 
                    return (
                        <RowContainer>
                            <div style={{display : 'flex'}}>
                                <DiceImage src={getDiceImageSrc(6)}/>
                                <DiceImage src={getDiceImageSrc(6)}/>
                            </div>
                            <PercentageContainer>
                                <h6>{t('Rolls Percentage')}</h6>
                                <p>{row.percentage}%</p>
                            </PercentageContainer>

                            <RightInfoContainer>
                                {`${row.lands}/${row.total} Tiri`}
                            </RightInfoContainer>
                        </RowContainer>
                    )

                default : 
                    return <div></div>
            }
        }
    }

    const typeToHeader = () => {
        if(type === 'low') return 'Tiri Bassi'
        if(type === 'mid') return 'Tiri Medi'
        if(type === 'high') return 'Tiri Alti'
    }

    return (
        <Paper style={{padding : '1rem .5rem'}}>
            <h1 style={{fontSize : '2rem', marginBottom : '1rem'}}>{typeToHeader()}</h1>
            <Divider />
            <div style={{marginTop : '1rem'}}>
                {rows.map((r : MonopolyTableRow, index : number) => renderRow(index, r))}
            </div>
        </Paper>
    )
}

const getDiceImageSrc = (diceNumber : number) => {
    switch(diceNumber){
        case 1:
            return injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-dice-1_0966155b4b.png')
        
        case 2:
            return injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-dice-2_3cb8578a5c.png')

        case 3:
            return injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-dice-3_4673da1e82.png')

        case 4:
            return injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-dice-4_84d401792c.png')
        
        case 5:
            return injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-dice-5_ab51b04528.png')
        
        case 6:
            return injectCDN('https://spike-images.s3.eu-central-1.amazonaws.com/monopoly-dice-6_3a3352669d.png')
    }
}

const PercentageContainer = styled.div`
    padding : .7rem;
    font-size : .8rem;

    h6{
        color : tomato;
        margin-bottom : .3rem;
    }

    font-size : .8rem;
`

const RightInfoContainer = styled.div`
    padding-left : .7rem;
    font-size : .9rem;
`


const RowContainer = styled.div`
    display : flex;
    justify-content : space-around;
    align-items : center;

    font-family : 'Montserrat' !important;
`


const DiceImage = styled.img`
    width : 40px;
    height : 40px;
    margin : 3px;
`

export default MonopolyDiceRollTable
