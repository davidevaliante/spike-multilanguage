import React, { useState, useContext } from 'react'
import delay from 'lodash/delay'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import { LocaleContext } from '../../context/LocaleContext'
import axios from 'axios'

const MailForm = (props) => {
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [message, setMessage] = useState<string | undefined>(undefined)
    const [errors, setErrors] = useState<string[]>([])

    const [messageSent, setMessageSent] = useState(false)

    const { t } = useContext(LocaleContext)

    const buildSlackPayload = (email: string, message: string) => ({
        channel: 'G016R4W4H25',
        text: 'Contatti su spikeslot.com ha appena ricevuto un messaggio',
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: 'Nuovo Messaggio su spikeslot.com',
                    emoji: true,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `Mittente : ${email}`,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: message,
                },
            },
            {
                type: 'divider',
            },
            {
                type: 'input',
                element: {
                    type: 'plain_text_input',
                    action_id: 'plain_text_input-action',
                },
                label: {
                    type: 'plain_text',
                    text: 'Aggiungi Nota',
                    emoji: true,
                },
            },
            {
                type: 'actions',
                elements: [
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Rispondi',
                            emoji: true,
                        },
                        value: 'click_me_123',
                        url: `mailto:${email}?Subject=Re:Ciao%20${email}`,
                    },
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Rispondi con testo',
                            emoji: true,
                        },
                        value: 'click_me_123',
                        url: `mailto:${email}?Subject=Re:Ciao%20${email}&body=%0A%0A%0A${message.replace(/ /g, '%20')}`,
                    },
                ],
            },
        ],
    })

    const sendMessageToSlack = async () => {
        const err: string[] = []

        if (!email || !validateEmail(email)) err.push('email')
        else {
            if (errors.includes('email')) errors.splice(errors.indexOf('email'), 1)
        }
        if (!message || message.length == 0) err.push('message')
        else {
            if (errors.includes('message')) errors.splice(errors.indexOf('message'), 1)
        }

        if (err.length > 0) {
            setErrors(err)
            return
        }

        if (email && message) {
            setErrors([])

            const bannedEmails = ['xyz, sandeep', 'paulaestebancopy']

            if (!bannedEmails.includes(email.split('@')[0]))
                await axios.post(
                    // 'https://hooks.slack.com/services/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',
                    'https://hooks.slack.com/services/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',
                    JSON.stringify(buildSlackPayload(email, message))
                )

            setMessageSent(true)

            console.log(`mailto:${email}?Subject=Re:Ciao%20${email}&body=%0A%0A%0A${message.replace(/ /g, '%20')}`)

            delay(() => {
                // setEmail('')
                // setMessage('')
                setMessageSent(false)
            }, 2000)
        }
    }

    const handleMailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value)
    }

    const handleOnSubmit = async (e) => {
        sendMessageToSlack()
    }

    return (
        <div style={{ width: '100%' }}>
            <TextField
                label={errors.includes('email') ? t('Email Not Valid') : t('Your email')}
                style={{ marginBottom: '2rem', width: '100%' }}
                placeholder={t('Write your email address here')}
                onChange={handleMailChange}
                multiline
                fullWidth
                value={email}
                error={errors.includes('email')}
                margin='normal'
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                label={errors.includes('message') ? t('Message Too Short') : t('Content')}
                placeholder={t('Write your message here')}
                style={{ width: '100%' }}
                multiline
                fullWidth
                onChange={handleMessageChange}
                rows='10'
                value={message}
                margin='normal'
                error={errors.includes('message')}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <SendButton color={messageSent ? '#3feb6d' : undefined} onClick={(e) => handleOnSubmit(e)}>
                {messageSent ? t('Email Sent') : t('Send email')}
            </SendButton>
        </div>
    )
}

const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

const SendButton = styled.div<{ color?: string }>`
    cursor: pointer;
    background-color: ${({ theme, color }) => (color ? color : theme.colors.primary)};
    border-radius: 25px;
    text-align: center;
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;
    padding-right: 2rem;
    padding-left: 2rem;
    margin-top: 2rem;
    max-width: 250px;
    color: white;

    transition: background-color 0.3s ease;
`

export default MailForm
