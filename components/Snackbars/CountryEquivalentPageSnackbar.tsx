import React, {Fragment, useState, useContext, FunctionComponent} from 'react'
import { Snackbar, Button, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { LocaleContext } from './../../context/LocaleContext';
import { useRouter } from 'next/router';

interface Props {
    path : string
}

const CountryEquivalentPageSnackbar : FunctionComponent<Props> = ({path}) => {

    const {t, contextCountry, userCountry} = useContext(LocaleContext)
    const router = useRouter()

    const [open, setOpen] = useState(true)

    const handleClose = () => setOpen(false)

    const visit = () => router.push(path)

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={open}
                autoHideDuration={10000}
                onClose={handleClose}
                message={'This page is also available for your country'}
                action={
                    <Fragment>
                        <Button color='primary' size='medium' onClick={visit}>
                        Visit
                        </Button>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                        </IconButton>
                    </Fragment>
                }
            />
        </div>
    )
}

export default CountryEquivalentPageSnackbar
