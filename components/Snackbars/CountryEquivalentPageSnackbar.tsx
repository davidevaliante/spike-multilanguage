import React, { Fragment, useState, useContext, FunctionComponent } from 'react'
import { Snackbar, Button, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { LocaleContext } from './../../context/LocaleContext'
import { useRouter } from 'next/router'
import { Flag } from '../Navbar/CountrySelect'

interface Props {
    path: string
}

const CountryEquivalentPageSnackbar: FunctionComponent<Props> = ({ path }) => {
    const router = useRouter()

    const { t, contextCountry, userCountry, setContextCountry } = useContext(LocaleContext)

    const [open, setOpen] = useState(true)

    const handleClose = () => setOpen(false)

    const visit = () => {
        setContextCountry(userCountry)
        router.push(path)
        setOpen(false)
    }

    const getFlagLink = (countryCode: string) => {
        if (countryCode === 'it') return '/flags/it.svg'
        if (countryCode === 'row') return '/flags/row.svg'
        if (countryCode === 'mt') return '/flags/mt.svg'
        if (countryCode === 'ca') return '/flags/ca.svg'
        if (countryCode === 'nz') return '/flags/nz.svg'
        if (countryCode === 'es') return '/flags/es.svg'
    }

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={100000}
                onClose={handleClose}
                message={'This page is also available for your country'}
                action={
                    <div
                        style={{
                            padding: '0rem 1rem',
                            minHeight: '100px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Flag src={getFlagLink(userCountry)} />
                        <Button
                            style={{ margin: '0rem 1rem' }}
                            color='primary'
                            size='medium'
                            variant='contained'
                            onClick={visit}
                        >
                            Visit
                        </Button>
                        <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    </div>
                }
            />
        </div>
    )
}

export default CountryEquivalentPageSnackbar
