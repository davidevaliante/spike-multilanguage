import React, { Fragment } from 'react'
import { FormGroup, FormControlLabel, Checkbox } from '@material-ui/core'
import { FunctionComponent } from 'react'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import {useTranslation} from 'react-i18next'

interface Props {
    onOrderChange: (value: 'date' | 'alphabetical' | 'rating') => void
    ordering: 'date' | 'alphabetical' | 'rating'
    style?: CSSProperties
}

const SlotListOrdering: FunctionComponent<Props> = ({ onOrderChange, ordering, style }) => {

    const {t} = useTranslation()

    const handleOrderChange = (event: React.FormEvent<HTMLInputElement>) => {
        // @ts-ignore
        onOrderChange(event.currentTarget.value)
    }

    return (
        <Fragment>
            <FormGroup aria-label="position" row style={style}>
                <FormControlLabel
                    value="date"
                    control={<Checkbox onChange={handleOrderChange} checked={ordering === 'date'} color="primary" />}
                    label={t("By Date")}
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="alphabetical"
                    control={<Checkbox onChange={handleOrderChange} checked={ordering === 'alphabetical'} color="primary" />}
                    label={t("From A to Z")}
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="rating"
                    control={<Checkbox onChange={handleOrderChange} checked={ordering === 'rating'} color="primary" />}
                    label={t("By Vote")}
                    labelPlacement="end"
                />
            </FormGroup>
        </Fragment>
    )
}

export default SlotListOrdering
