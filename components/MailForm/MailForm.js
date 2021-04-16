import React, { useState, useContext } from 'react'
import delay from 'lodash/delay'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import { LocaleContext } from './../../context/LocaleContext'
import axios from 'axios'

const MailForm = (props) => {

    const [email, setEmail] = useState(undefined)
    const [message, setMessage] = useState(undefined)
    
    const { t } = useContext(LocaleContext)

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    })

    const handleMailChange = e => {
        setEmail(e.target.value)
    }

    const handleMessageChange = e => {
        setMessage(e.target.value)
    }

    const handleResponse = (status, msg) => {
        if (status === 200) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg }
            })

            delay(() => {
                setStatus({
                    submitted: false,
                    submitting: false,
                    info: { error: false, msg: null }
                })
            }, 1500)
        } else {
            setStatus({
                submitted: false,
                submitting: false,
                info: { error: true, msg: msg }
            })
        }
    }


    const handleOnSubmit = async e => {
        console.log('asdasdas')

        const res = await axios.post('http://localhost:3000/api/send',{
            email: email,
            message: message
        })

        console.log('asdasdas')

        const text = res.data
        console.log(text)
        handleResponse(res.status, text)
    }

    return (
        <div style={{ width: '100%' }}>
            <TextField
                label={t("Your email")}
                style={{ marginBottom: '2rem', width: '100%' }}
                placeholder={t("Write your email address here")}
                onChange={handleMailChange}
                multiline
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                label={t("Content")}
                placeholder={t("Write your message here")}
                style={{ width: '100%' }}
                multiline
                fullWidth
                onChange={handleMessageChange}
                rows="10"
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />


            <SendButton onClick={(e) => handleOnSubmit(e)}>
                {t("Send email")}
            </SendButton>
        </div>
    )
}

const SendButton = styled.div`
    cursor: pointer;
    background-color : ${({ theme }) => theme.colors.primary};
    border-radius : 25px;
    text-align : center;
    padding-top : .7rem;
    padding-bottom : .7rem;
    padding-right : 2rem;
    padding-left : 2rem;
    margin-top : 2rem;
    max-width : 250px;
    color : white;
`

export default MailForm
