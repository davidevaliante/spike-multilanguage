import { TextField } from '@material-ui/core'
import React from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import Mailchimp from 'react-mailchimp-form'

interface Props {
    
}

const NewsLetterForm : FunctionComponent<Props> = ({}) => {

    const url = 'https://topads.us7.list-manage.com/subscribe/post?u=1625cf3618b2dcc9036ff2f58&amp;id=66f1c2856c'

    return (
        <div>
        <Mailchimp
                action={url}
                fields={[
                {
                    name: 'EMAIL',
                    placeholder: 'Email',
                    type: 'email',
                    required: true
                }
                ]}
            />
        </div>
    )
}

export default NewsLetterForm
